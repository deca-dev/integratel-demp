/**
 * Proxy de integración Creatio para Integratel.
 * - Endpoint /api/cliente/:ruc → datos del contacto normalizados
 * - Endpoint /api/photo/:photoId → bypass autenticado para servir la foto
 */

import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const {
  CREATIO_URL,
  CREATIO_IDENTITY_URL,
  CREATIO_CLIENT_ID,
  CREATIO_CLIENT_SECRET,
  CREATIO_ENTITY = 'Contact',
  CREATIO_RUC_FIELD = 'UsrRUC',
  CREATIO_SELECT = 'Name,Email,UsrRUC,Age,PhotoId',
  ALLOWED_ORIGINS = '*',
  PORT = 3000
} = process.env;

if (!CREATIO_URL || !CREATIO_IDENTITY_URL || !CREATIO_CLIENT_ID || !CREATIO_CLIENT_SECRET) {
  console.error('⛔  Faltan variables de entorno. Revisa .env contra .env.example');
  process.exit(1);
}

const app = express();
app.use(cors({
  origin: ALLOWED_ORIGINS === '*' ? '*' : ALLOWED_ORIGINS.split(',').map(s => s.trim())
}));

// ──────────────────────────────────────────────────────────────
// Token cache
// ──────────────────────────────────────────────────────────────
let tokenCache = { token: null, expiresAt: 0 };

async function getAccessToken() {
  const now = Date.now();
  if (tokenCache.token && now < tokenCache.expiresAt - 60_000) {
    return tokenCache.token;
  }

  const tokenUrl = CREATIO_IDENTITY_URL.replace(/\/$/, '') + '/connect/token';
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: CREATIO_CLIENT_ID,
    client_secret: CREATIO_CLIENT_SECRET
  });

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Auth Creatio falló (HTTP ${res.status}): ${text}`);
  }

  const data = await res.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: now + (data.expires_in || 3600) * 1000
  };
  console.log(`✅  Token Creatio renovado (expira en ${data.expires_in}s)`);
  return tokenCache.token;
}

// ──────────────────────────────────────────────────────────────
// Consulta OData
// ──────────────────────────────────────────────────────────────
async function queryCreatio(ruc) {
  const token = await getAccessToken();
  const base = CREATIO_URL.replace(/\/$/, '');

  const url = new URL(`${base}/0/odata/${CREATIO_ENTITY}`);
  url.searchParams.set('$filter', `${CREATIO_RUC_FIELD} eq '${ruc}'`);
  url.searchParams.set('$select', CREATIO_SELECT);
  url.searchParams.set('$top', '1');

  console.log(`→ GET ${url.toString()}`);

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ForceUseSession: 'true'
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`OData falló (HTTP ${res.status}): ${text.slice(0, 300)}`);
  }

  const data = await res.json();
  return data.value?.[0] || null;
}

function normalize(raw) {
  const EMPTY = '00000000-0000-0000-0000-000000000000';
  const validPhoto = raw.PhotoId && raw.PhotoId !== EMPTY;

  return {
    Name: raw.Name ?? null,
    Email: raw.Email ?? null,
    UsrAge: raw.UsrAge ?? raw.Age ?? null,
    PhotoId: validPhoto ? raw.PhotoId : null
  };
}

// ──────────────────────────────────────────────────────────────
// Endpoint principal
// ──────────────────────────────────────────────────────────────
app.get('/api/cliente/:ruc', async (req, res) => {
  const ruc = String(req.params.ruc).replace(/\D/g, '');

  if (ruc.length < 8 || ruc.length > 11) {
    return res.status(400).json({ error: 'RUC inválido (debe tener entre 8 y 11 dígitos)' });
  }

  try {
    const raw = await queryCreatio(ruc);
    if (!raw) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ ruc, client: normalize(raw) });
  } catch (err) {
    console.error('[query error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ──────────────────────────────────────────────────────────────
// Proxy de foto: descarga desde Creatio con token y la sirve
// (porque el browser no puede pasarle el Bearer al <img>)
// ──────────────────────────────────────────────────────────────
app.get('/api/photo/:photoId', async (req, res) => {
  const photoId = req.params.photoId;
  if (!/^[0-9a-f-]{36}$/i.test(photoId)) {
    return res.status(400).end();
  }

  try {
    const token = await getAccessToken();
    const base = CREATIO_URL.replace(/\/$/, '');
    const url = `${base}/0/odata/SysImage(${photoId})/Data/$value`;

    console.log(`→ GET photo ${url}`);

    const r = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/octet-stream',
        ForceUseSession: 'true'
      }
    });

    if (!r.ok) {
      console.error(`[photo] Creatio devolvió ${r.status}`);
      return res.status(r.status).end();
    }

    const contentType = r.headers.get('content-type') || 'image/jpeg';
    res.set('Content-Type', contentType);
    res.set('Cache-Control', 'public, max-age=3600');
    const buffer = Buffer.from(await r.arrayBuffer());
    res.send(buffer);
  } catch (err) {
    console.error('[photo error]', err.message);
    res.status(500).end();
  }
});

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    creatio: CREATIO_URL,
    entity: CREATIO_ENTITY,
    field: CREATIO_RUC_FIELD,
    select: CREATIO_SELECT,
    tokenCached: !!tokenCache.token
  });
});

app.listen(PORT, () => {
  console.log(`🚀  Proxy en http://localhost:${PORT}`);
  console.log(`    Endpoint:  GET /api/cliente/:ruc`);
  console.log(`    Foto:      GET /api/photo/:photoId`);
  console.log(`    Health:    GET /health`);
  console.log(`    Creatio:   ${CREATIO_URL}`);
});
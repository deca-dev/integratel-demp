/**
 * Proxy de integración Creatio para Integratel.
 *
 * Por qué existe:
 *  - El front no puede llamar directo a Creatio: requiere autenticación (OAuth)
 *    y los secretos no pueden ir en el browser.
 *  - Este proxy guarda las credenciales de servicio y expone un único endpoint
 *    limpio para el portal: GET /api/cliente/:ruc
 *
 * Flujo:
 *  1. Recibe RUC del front.
 *  2. Obtiene/refresca access_token desde el Identity Service de Creatio
 *     (cache en memoria, refresco a los expires_in - 60s).
 *  3. Consulta OData de Creatio con el token.
 *  4. Devuelve el cliente normalizado, o 404 si no existe.
 *
 * Para correr local:
 *   cp .env.example .env  # llena las credenciales
 *   npm install
 *   npm run dev
 *
 * Para producción: deploy a Render, Railway, Fly.io o cualquier host con Node 18+.
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
  CREATIO_SELECT = 'Name,Email,UsrGender,UsrAge',
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
// Token cache (en memoria; OK para 1 instancia)
// ──────────────────────────────────────────────────────────────
let tokenCache = { token: null, expiresAt: 0 };

async function getAccessToken() {
  const now = Date.now();
  // refresca 60s antes para evitar usar token a punto de expirar
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

// ──────────────────────────────────────────────────────────────
// Endpoints
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

    res.json({
      ruc,
      client: {
        Name: raw.Name ?? null,
        Email: raw.Email ?? null,
        UsrGender: raw.UsrGender ?? raw.Gender ?? null,
        UsrAge: raw.UsrAge ?? raw.Age ?? null
      }
    });
  } catch (err) {
    console.error('[query error]', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    creatio: CREATIO_URL,
    entity: CREATIO_ENTITY,
    field: CREATIO_RUC_FIELD,
    tokenCached: !!tokenCache.token
  });
});

app.listen(PORT, () => {
  console.log(`🚀  Proxy Integratel × Creatio en http://localhost:${PORT}`);
  console.log(`    Endpoint: GET /api/cliente/:ruc`);
  console.log(`    Health:   GET /health`);
  console.log(`    Creatio:  ${CREATIO_URL}`);
  console.log(`    Entidad:  ${CREATIO_ENTITY} · campo RUC: ${CREATIO_RUC_FIELD}`);
});

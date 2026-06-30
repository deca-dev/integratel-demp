import { CONFIG } from '../config.js';
import { MOCK_DB } from './mock.js';

/**
 * Busca un cliente por RUC.
 * Devuelve { Name, Email, UsrGender, UsrAge } o null si no existe.
 * Lanza un Error si hay problema de conexión / auth / OData.
 */
export async function searchClient(ruc) {
  // Pequeño delay para que el spinner se vea natural en modo mock
  if (CONFIG.mode === 'mock') {
    await sleep(700);
    return MOCK_DB[ruc] || null;
  }

  if (CONFIG.mode === 'proxy') {
    return queryProxy(ruc);
  }

  throw new Error(`Modo desconocido: ${CONFIG.mode}`);
}

async function queryProxy(ruc) {
  const base = CONFIG.proxyUrl.replace(/\/$/, '');
  const url = `${base}/api/cliente/${encodeURIComponent(ruc)}`;

  let res;
  try {
    res = await fetch(url, { headers: { Accept: 'application/json' } });
  } catch (err) {
    throw new Error(
      `No se pudo contactar al proxy en ${base}. ` +
      `Verifica que esté corriendo y que CORS permita este origen.`
    );
  }

  if (res.status === 404) return null;

  if (!res.ok) {
    const detail = await safeJson(res);
    throw new Error(detail?.error || `Error del proxy (HTTP ${res.status})`);
  }

  const data = await res.json();
  return data.client;
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function safeJson(res) {
  try { return await res.json(); } catch { return null; }
}

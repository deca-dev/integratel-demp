/**
 * Configuración de la aplicación.
 *
 * Modos disponibles:
 *  - 'mock'   → usa datos locales de demo (sirve para GitHub Pages sin backend)
 *  - 'proxy'  → llama al proxy Node/Express que conecta a Creatio vía OAuth
 *
 * Se setea en build-time con variables de entorno (Vite):
 *   VITE_API_MODE=proxy
 *   VITE_PROXY_URL=https://mi-proxy.vercel.app
 *
 * O directamente editando los defaults aquí.
 */
export const CONFIG = {
  mode: import.meta.env.VITE_API_MODE || 'mock',
  proxyUrl: import.meta.env.VITE_PROXY_URL || 'http://localhost:3000'
};

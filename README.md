# Integratel × Creatio · Consulta de cliente

Demo standalone para presentar a Integratel Perú. Replica el look & feel de Movistar y consulta clientes por RUC contra **cualquier instancia de Creatio** vía OData. Independiente de cualquier otra infraestructura.

```
┌──────────────────┐   HTTPS    ┌──────────────────┐   OAuth + OData  ┌─────────────────┐
│  Portal (React)  │ ─────────▶ │   Proxy (Node)   │ ───────────────▶ │  Creatio CRM    │
│  GitHub Pages    │            │  Render / local  │                  │  cualquier tenant │
└──────────────────┘            └──────────────────┘                  └─────────────────┘
```

## Estructura

```
integratel-creatio/
├── src/                  React + Vite + Tailwind
│   ├── App.jsx
│   ├── components/       Header, Footer, LookupForm (look & feel Movistar)
│   ├── api/
│   │   ├── creatio.js    Capa de API (mock | proxy)
│   │   └── mock.js       Dataset de demo
│   └── config.js         Lee VITE_API_MODE y VITE_PROXY_URL
├── proxy/                Proxy Node.js que conecta a Creatio
│   ├── server.js         Express + OAuth 2.0 client_credentials + OData
│   ├── .env.example
│   └── package.json
├── .github/workflows/    CI/CD a GitHub Pages
└── package.json
```

## Modos de operación

El front tiene dos modos seleccionables vía variable de entorno:

| Modo    | Backend         | Cuándo usarlo                                              |
|---------|-----------------|------------------------------------------------------------|
| `mock`  | Ninguno         | Default. Para demo de UI sin necesidad de Creatio          |
| `proxy` | Node/Express    | Para conectar a un Creatio real                            |

---

## Quick start — solo UI (modo mock)

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Hay 4 RUCs de prueba precargados como chips.

---

## Conexión real a Creatio (modo proxy)

### 1. Crear el OAuth Client en tu Creatio

En tu instancia de Creatio (la que sea, dev o trial):

1. **System Designer → OAuth 2.0 Client Application Management → New**
2. Nombre: `Demo Portal Integratel`
3. Grant type: `Client Credentials`
4. Asignar un usuario técnico con permisos de **lectura** sobre la entidad del RUC (`Contact`, `Account` o custom)
5. Anotar el `Client ID` y `Client Secret`

> **Nota sobre el Identity Service URL:** en Creatio Cloud suele ser `https://{tenant}-is.creatio.com`. En on-prem o configuraciones custom puede vivir en otra ruta — verifica con tu admin o en `appsettings.json` del web app.

### 2. Levantar el proxy local

```bash
cd proxy
cp .env.example .env
# Editar .env con la URL y credenciales de tu Creatio
npm install
npm run dev
```

El proxy queda en `http://localhost:3000`. Sanity check:

```bash
curl http://localhost:3000/health
```

Debería responder con `tokenCached: false` (todavía no consultó). Probar un RUC real:

```bash
curl http://localhost:3000/api/cliente/20100017491
```

La primera llamada hace el handshake OAuth y queda cacheado el token hasta que expire.

### 3. Apuntar el front al proxy

En la raíz del proyecto:

```bash
cat > .env.local <<EOF2
VITE_API_MODE=proxy
VITE_PROXY_URL=http://localhost:3000
EOF2

npm run dev
```

Ahora la consulta del front va al proxy, y el proxy a Creatio real.

---

## Deploy del front a GitHub Pages

### Opción A — Automático (recomendado)

1. Push del repo a GitHub
2. **Settings → Pages → Source: GitHub Actions**
3. **Settings → Secrets and variables → Actions → Variables**, crear:
   - `API_MODE` = `proxy` (o `mock` para versión sin backend)
   - `PROXY_URL` = la URL pública donde despliegues el proxy
4. Push a `main` — el workflow corre solo
5. Queda publicado en `https://<tu-usuario>.github.io/<nombre-repo>/`

### Opción B — Manual con gh-pages

```bash
VITE_BASE=/integratel-creatio/ \
VITE_API_MODE=proxy \
VITE_PROXY_URL=https://tu-proxy.onrender.com \
npm run build

npm run deploy
```

---

## Deploy del proxy

El proxy es un Express estándar. Necesita Node ≥ 18 y un sitio donde tenga IP/dominio pública accesible desde GitHub Pages.

### Render (recomendado — gratis y simple)

1. Conectar el repo a Render
2. **New → Web Service**, apuntar al subdirectorio `proxy/`
3. Build command: `npm install`
4. Start command: `npm start`
5. Setear las env vars del `.env.example` en el dashboard de Render
6. Render entrega URL `https://xxx.onrender.com`
7. Usar esa URL como `PROXY_URL` en GitHub Pages

Plan free de Render duerme tras 15 min sin tráfico — la primera consulta tras inactividad demora ~30s en arrancar. Para una demo en vivo, considerá pingearlo unos minutos antes.

### Railway / Fly.io

Igual de directo: detectan Node, instalan deps, corren `npm start`. Setear env vars y listo.

### ngrok (para demo en vivo desde tu laptop)

Si preferís correr el proxy local durante la presentación:

```bash
cd proxy && npm run dev   # en una terminal
ngrok http 3000           # en otra
```

Tomar la URL `https://xxxx.ngrok.app` que da ngrok y ponerla como `PROXY_URL` en el front (o en el GitHub variable). Sin deploy, instantáneo.

---

## Mapeo de campos en Creatio

Por defecto el proxy hace:

```
GET /0/odata/Contact
  ?$filter=UsrRUC eq '<ruc>'
  &$select=Name,Email,UsrGender,UsrAge
  &$top=1
```

Si en tu Creatio el RUC vive en otra entidad o con otro nombre, ajustá en `proxy/.env`:

```env
CREATIO_ENTITY=Account              # Contact, Account, o entidad custom
CREATIO_RUC_FIELD=UsrNumeroDoc      # el nombre técnico real
CREATIO_SELECT=Name,Email,Type,...  # los campos a mostrar
```

El proxy normaliza la respuesta a `{ Name, Email, UsrGender, UsrAge }` antes de devolverla, así no toca el front si cambia el mapeo.

---

## Habilitar CORS en Creatio

Para que el proxy pueda llamar al Identity Service de Creatio, agregá el origen del proxy a la whitelist:

- **System Designer → System Settings → CORS settings** (o equivalente según versión)
- Agregar: `http://localhost:3000` para dev; tu URL de Render/ngrok para demo
- Reiniciar el web app si lo pide

---

## Seguridad

- Las credenciales viven **solo** en el proxy. Nunca en el front.
- `Client Secret` rotarlo cada 90 días desde Creatio.
- Usuario técnico con permisos mínimos: solo lectura sobre la entidad del RUC.
- En producción restringir `ALLOWED_ORIGINS` al dominio del portal.

---

## Stack

| Capa     | Tecnología                                         |
|----------|----------------------------------------------------|
| Front    | React 18 · Vite 5 · Tailwind 3                     |
| Proxy    | Node 20 · Express 4 · OAuth 2.0 client_credentials |
| Creatio  | OData v4 REST API                                  |
| Deploy   | GitHub Pages (front) + Render/Railway/ngrok (proxy) |

---

TrueDigital · Demo de integración Creatio · 2026

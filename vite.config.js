import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configura el base path para GitHub Pages.
// Cuando despliegues con `npm run deploy`, pásalo así:
//   VITE_BASE=/integratel-creatio/ npm run build
// O modifica el default abajo con el nombre real del repo.
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});

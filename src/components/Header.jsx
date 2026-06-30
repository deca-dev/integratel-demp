import { ChevronDown, UserIcon, SearchIcon, BellIcon } from './icons.jsx';

export default function Header() {
  return (
    <>
      {/* Barra superior */}
      <div className="bg-movistar-gray border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center text-xs">
          <div className="flex gap-5">
            <a href="#" className="text-neutral-800 font-medium hover:text-movistar-blue transition">Personas</a>
            <a href="#" className="text-neutral-500 hover:text-movistar-blue transition">Empresas</a>
          </div>
          <a href="#" className="text-neutral-600 hover:text-movistar-blue transition hidden sm:block">
            Información a Abonados y Usuarios
          </a>
        </div>
      </div>

      {/* Nav principal */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <a href="#" aria-label="Movistar" className="flex items-center">
              <svg viewBox="0 0 31 25" className="h-8 w-auto" fill="#019DF4" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.64 3.67C4.25 3.69 1.68 4.4.51 9.37c-.51 2.17-.71 4.43-.27 7.11.4 2.48 1.12 4.62 1.6 5.8.17.41.43.83.62 1.09.57.75 1.52.7 1.92.5.43-.22.94-.76.76-1.99-.09-.59-.34-1.46-.49-1.94-.43-1.48-1.02-3.27-1.07-4.54-.07-1.7.58-1.92 1.01-2.02.72-.16 1.33.66 1.9 1.69.69 1.23 1.86 3.41 2.82 5.07.86 1.51 2.46 3.12 5.03 3.01 2.62-.11 4.54-1.15 5.54-4.41.74-2.44 1.25-4.27 2.06-6.13.94-2.15 2.19-3.3 3.24-2.95.98.33 1.22 1.32 1.24 2.77.01 1.29-.13 2.71-.25 3.76-.04.38-.11 1.14-.08 1.56.06.83.4 1.66 1.31 1.79.96.14 1.73-.66 2.04-1.62.12-.38.23-.96.28-1.37.28-2.09.35-3.49.22-5.62-.15-2.49-.62-4.77-1.44-6.74C27.73 2.31 26.47 1.11 24.85 1c-1.79-.12-3.84 1.11-4.92 3.51-.99 2.21-1.79 4.47-2.27 5.62-.49 1.17-1.2 1.89-2.31 2.01-1.35.15-2.51-.87-3.36-2.32C11.25 8.55 9.78 6.15 8.99 5.34c-.74-.75-1.59-1.7-3.35-1.67Z" />
              </svg>
            </a>

            <ul className="hidden lg:flex items-center gap-7 text-[15px] text-neutral-800">
              <li><a href="#" className="flex items-center gap-1 hover:text-movistar-blue transition">Celulares <ChevronDown /></a></li>
              <li><a href="#" className="flex items-center gap-1 hover:text-movistar-blue transition">Hogar <ChevronDown /></a></li>
              <li><a href="#" className="flex items-center gap-1 hover:text-movistar-blue transition">Móvil <ChevronDown /></a></li>
              <li><a href="#" className="hover:text-movistar-blue transition">Atención al cliente</a></li>
              <li>
                <a href="#" className="flex items-center gap-1.5 text-movistar-purple font-medium hover:opacity-80 transition">
                  <span aria-hidden>🔥</span> Ofertas
                </a>
              </li>
            </ul>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 border border-movistar-blue text-movistar-blue rounded-full px-4 py-2 text-sm font-medium hover:bg-movistar-blue hover:text-white transition">
              <UserIcon />
              <span>App Mi Movistar</span>
            </button>
            <button className="text-neutral-700 hover:text-movistar-blue p-2 transition" aria-label="Buscar">
              <SearchIcon />
            </button>
            <button className="relative text-neutral-700 hover:text-movistar-blue p-2 transition" aria-label="Notificaciones">
              <BellIcon />
              <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">1</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="bg-movistar-gray border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-3 text-sm text-neutral-600 flex items-center gap-2">
          <a href="#" className="text-movistar-blue hover:underline">Inicio</a>
          <span className="text-neutral-400">›</span>
          <a href="#" className="text-movistar-blue hover:underline">Integratel Perú</a>
          <span className="text-neutral-400">›</span>
          <span>Consulta de cliente</span>
        </div>
      </div>
    </>
  );
}

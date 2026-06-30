import { FacebookIcon, YouTubeIcon, TwitterIcon } from './icons.jsx';

const COLUMNS = [
  {
    title: 'Hogar',
    links: ['Internet Hogar', 'Internet Fibra Óptica', 'Movistar TV', 'Planes dúo Movistar', 'Tríos Movistar', 'Movistar Total', 'Test de velocidad']
  },
  {
    title: 'Móvil',
    links: ['Portabilidad', 'Postpago', 'Renovar tu equipo', 'Celulares Liberados', 'Roaming', 'Preplan Movistar', 'Esim', 'Líneas adicionales']
  },
  {
    title: 'Celulares',
    links: ['iPhone 16', 'Samsung Galaxy A06', 'Honor X5 Plus', 'Motorola G24 Power', 'Xiaomi Redmi Note 13', 'iPhone 15 Pro', 'Samsung Galaxy A35']
  },
  {
    title: 'Atención al cliente',
    links: ['App Mi Movistar', 'Mi Movistar', 'Blog Movistar', 'Lucía', 'Asesora Virtual', 'Mapa Web', 'Lugares y Medios de Pago', 'Antifraude']
  },
  {
    title: 'Promociones especiales',
    links: ['Regalos para papá', 'Cyber Movistar', 'Celebratón', 'Ofertas y Promociones', 'Disney Plus', 'Promociones Fiestas Patrias']
  },
  {
    title: 'Regulación y legales',
    links: ['Calidad OSIPTEL', 'Cobertura Inalámbrica', 'SISMATE', 'Medio Ambiente', 'Conectarse', 'Neutralidad de red', 'Tarifas planes vigentes']
  }
];

const CLAIMS = [
  'Reclamos y solicitudes en línea',
  'Consultas de reclamos',
  'Información abonados y usuarios',
  'Libro de Reclamaciones'
];

export default function Footer() {
  return (
    <footer className="bg-movistar-navy text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-10">
          {COLUMNS.map(col => (
            <div key={col.title}>
              <h3 className="font-semibold text-white text-sm mb-4">{col.title}</h3>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-neutral-300 text-xs hover:text-white transition">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <span className="text-xs text-neutral-400">
            © 2026 Movistar. Todos los derechos reservados.
          </span>

          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
            {CLAIMS.map(c => (
              <li key={c}>
                <a href="#" className="text-neutral-300 hover:text-white transition">{c}</a>
              </li>
            ))}
          </ul>

          <ul className="flex gap-3">
            <li>
              <a href="#" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <FacebookIcon />
              </a>
            </li>
            <li>
              <a href="#" aria-label="YouTube" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <YouTubeIcon />
              </a>
            </li>
            <li>
              <a href="#" aria-label="Twitter" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <TwitterIcon />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

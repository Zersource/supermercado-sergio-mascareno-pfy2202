import { NavLink } from 'react-router-dom'

// Menu de navegacion fijo en la parte inferior de la pantalla
const enlaces = [
  { to: '/', etiqueta: 'Inicio', icono: '\u{1F3E0}', end: true },
  { to: '/preguntas-frecuentes', etiqueta: 'Preguntas frecuentes', icono: '❓' },
  { to: '/contactanos', etiqueta: 'Contáctanos', icono: '✉️' },
]

function MenuInferior() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.08)]"
      aria-label="Menú inferior"
    >
      <ul className="flex">
        {enlaces.map((e) => (
          <li key={e.to} className="flex-1">
            <NavLink
              to={e.to}
              end={e.end}
              className={({ isActive }) =>
                'flex flex-col items-center px-1 py-2 text-xs sm:text-sm hover:text-marca ' +
                (isActive ? 'font-semibold text-marca shadow-[inset_0_3px_0_#c8201f]' : 'text-gray-600')
              }
            >
              <span className="text-xl leading-tight" aria-hidden="true">{e.icono}</span>
              <span>{e.etiqueta}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MenuInferior

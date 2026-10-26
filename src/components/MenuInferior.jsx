import { NavLink } from 'react-router-dom'

// Menu de navegacion fijo en la parte inferior de la pantalla
const enlaces = [
  { to: '/', etiqueta: 'Inicio', icono: '\u{1F3E0}', end: true },
  { to: '/preguntas-frecuentes', etiqueta: 'Preguntas frecuentes', icono: '\u2753' },
  { to: '/contactanos', etiqueta: 'Contáctanos', icono: '\u2709\uFE0F' },
]

function MenuInferior() {
  return (
    <nav className="menu-inferior bg-white border-top" aria-label="Navegación principal">
      <ul className="list-unstyled d-flex justify-content-around mb-0">
        {enlaces.map((e) => (
          <li key={e.to} className="flex-fill text-center">
            <NavLink
              to={e.to}
              end={e.end}
              className={({ isActive }) => 'menu-link' + (isActive ? ' activo' : '')}
            >
              <span className="menu-icono" aria-hidden="true">{e.icono}</span>
              <span className="menu-texto">{e.etiqueta}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MenuInferior

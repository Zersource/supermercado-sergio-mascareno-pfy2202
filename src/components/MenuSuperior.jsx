import { NavLink } from 'react-router-dom'

// Menu superior: da acceso a las dos paginas de gestion de articulos
const enlaces = [
  { to: '/agregar-articulo', etiqueta: 'Agregar artículo' },
  { to: '/articulos', etiqueta: 'Listado de artículos' },
]

function MenuSuperior() {
  return (
    <nav className="bg-marca-oscuro" aria-label="Menú de artículos">
      <ul className="mx-auto flex max-w-5xl px-2">
        {enlaces.map((e) => (
          <li key={e.to}>
            <NavLink
              to={e.to}
              className={({ isActive }) =>
                'block px-4 py-2 text-sm font-bold text-white hover:bg-black/20 ' +
                (isActive ? 'border-b-4 border-ambar bg-black/20' : 'border-b-4 border-transparent')
              }
            >
              {e.etiqueta}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MenuSuperior

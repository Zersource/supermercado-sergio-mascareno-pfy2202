import { NavLink } from 'react-router-dom'
import { useCarrito } from '../hooks/useCarrito.js'

// Menu superior: da acceso a la gestion de articulos y al carrito
const enlaces = [
  { to: '/agregar-articulo', etiqueta: 'Agregar artículo' },
  { to: '/articulos', etiqueta: 'Listado de artículos' },
  { to: '/carrito', etiqueta: 'Carrito', esCarrito: true },
]

function MenuSuperior() {
  const { unidades } = useCarrito()

  return (
    <nav className="bg-marca-oscuro" aria-label="Menú de artículos">
      <ul className="mx-auto flex max-w-5xl px-1 sm:px-2">
        {enlaces.map((e) => (
          <li key={e.to} className="flex flex-1 sm:flex-none">
            <NavLink
              to={e.to}
              className={({ isActive }) =>
                'flex w-full items-center justify-center gap-1.5 px-2 py-2 text-center text-sm font-bold leading-tight text-white hover:bg-black/20 sm:px-4 ' +
                (isActive ? 'border-b-4 border-ambar bg-black/20' : 'border-b-4 border-transparent')
              }
            >
              {e.etiqueta}
              {e.esCarrito && (
                <>
                  <span
                    className="insignia-carrito inline-block min-w-[1.5rem] rounded-full bg-ambar px-1.5 text-xs font-extrabold text-gray-900"
                    aria-hidden="true"
                  >
                    {unidades}
                  </span>
                  <span className="sr-only">
                    {unidades === 1 ? 'unidad' : 'unidades'} en el carrito
                  </span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default MenuSuperior

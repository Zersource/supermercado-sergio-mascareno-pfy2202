import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useInventario } from '../hooks/useInventario.js'
import { formatearPrecio } from '../utils/formato.js'
import { TIPOS_PRODUCTO } from '../utils/tipos.js'
import { TODAS, filtrarPorCategoria, contarPorCategoria } from '../utils/filtros.js'
import EstadoInventario from '../components/EstadoInventario.jsx'
import Boton from '../components/ui/Boton.jsx'

function ListadoArticulos() {
  const { productos, cargando, error, reintentar } = useInventario()
  const navigate = useNavigate()
  const location = useLocation()

  // La categoria elegida vive en la URL (?categoria=...): asi el filtro se mantiene
  // al abrir un detalle y volver. `productos` (el inventario original) no se toca.
  const [params, setParams] = useSearchParams()
  const pedida = params.get('categoria')
  const categoria = TIPOS_PRODUCTO.includes(pedida) ? pedida : TODAS

  function cambiarCategoria(nueva) {
    setParams(nueva === TODAS ? {} : { categoria: nueva }, { replace: true })
  }

  // Lista filtrada: se calcula a partir del inventario completo en cada render
  const visibles = filtrarPorCategoria(productos, categoria)
  const conteo = contarPorCategoria(productos)

  // Al abrir un detalle se recuerda de donde viene para poder volver con el filtro puesto
  const irAlDetalle = (id) => navigate(`/articulos/${id}`, { state: { volverA: location.pathname + location.search } })

  return (
    <section aria-labelledby="titulo-listado">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="titulo-listado" className="text-2xl">Listado de artículos</h2>
        <Boton to="/agregar-articulo">Agregar artículo</Boton>
      </div>

      <EstadoInventario cargando={cargando} error={error} reintentar={reintentar} textoCarga="Cargando artículos...">
        <form className="mb-3 grid gap-2 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:gap-3" onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="categoria" className="font-bold">Categoría</label>
          <select
            id="categoria"
            className="campo sm:max-w-xs"
            value={categoria}
            onChange={(e) => cambiarCategoria(e.target.value)}
          >
            <option value={TODAS}>Todas las categorías ({productos.length})</option>
            {TIPOS_PRODUCTO.map((t) => (
              <option key={t} value={t}>{t} ({conteo[t] ?? 0})</option>
            ))}
          </select>
        </form>

        <p className="mb-2 text-gray-600" id="total-articulos" role="status">
          Mostrando {visibles.length} de {productos.length} {productos.length === 1 ? 'artículo' : 'artículos'}
          {categoria !== TODAS && (
            <>
              {' '}en «{categoria}».{' '}
              <button type="button" className="font-bold text-marca underline" onClick={() => cambiarCategoria(TODAS)}>
                Quitar filtro
              </button>
            </>
          )}
        </p>

        <div className="tabla-contenedor">
          <table className="tabla" aria-describedby="total-articulos">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th scope="col" className="hidden px-2 py-2 sm:table-cell sm:px-3">N°</th>
                <th scope="col" className="px-2 py-2 sm:px-3">Nombre</th>
                <th scope="col" className="px-2 py-2 sm:px-3">Marca</th>
                <th scope="col" className="px-2 py-2 sm:px-3">Tipo de producto</th>
                <th scope="col" className="hidden px-2 py-2 text-right md:table-cell sm:px-3">Precio</th>
                <th scope="col" className="px-2 py-2 sm:px-3 text-right">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibles.map((p) => (
                <tr
                  key={p.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={(e) => {
                    // El enlace del nombre ya navega por si mismo; evita navegar dos veces
                    if (!e.target.closest('a')) irAlDetalle(p.id)
                  }}
                >
                  <td className="hidden px-2 py-2 text-gray-500 sm:table-cell sm:px-3">{p.id}</td>
                  <td className="px-2 py-2 sm:px-3">
                    <Link
                      to={`/articulos/${p.id}`}
                      state={{ volverA: location.pathname + location.search }}
                      className="font-bold text-marca underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-marca/40"
                    >
                      {p.nombre}
                    </Link>
                    {/* En pantallas angostas la columna Precio se oculta: se muestra bajo el nombre */}
                    <span className="block text-xs text-gray-500 md:hidden">{formatearPrecio(p.precio)}</span>
                  </td>
                  <td className="px-2 py-2 sm:px-3">{p.marca}</td>
                  <td className="px-2 py-2 sm:px-3">{p.tipo}</td>
                  <td className="hidden px-2 py-2 text-right md:table-cell sm:px-3">{formatearPrecio(p.precio)}</td>
                  <td className="px-2 py-2 sm:px-3 text-right">{p.stock}</td>
                </tr>
              ))}
              {visibles.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-3 py-6 text-center">
                    {productos.length === 0
                      ? 'Todavía no hay artículos en el inventario.'
                      : 'No hay artículos en esta categoría.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-sm text-gray-500">Haz clic en un artículo para ver su detalle y agregarlo al carrito.</p>
      </EstadoInventario>
    </section>
  )
}

export default ListadoArticulos

import { Link } from 'react-router-dom'
import { useInventario } from '../hooks/useInventario.js'
import { formatearPrecio } from '../utils/formato.js'

function ListadoArticulos() {
  const { productos, cargando, error, reintentar } = useInventario()

  return (
    <section aria-labelledby="titulo-listado">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 id="titulo-listado" className="text-2xl">Listado de artículos</h2>
        <Link to="/agregar-articulo" className="btn-marca">Agregar artículo</Link>
      </div>

      {cargando && <p role="status">Cargando artículos...</p>}

      {error && (
        <div
          className="flex items-center justify-between rounded-md border border-red-300 bg-red-50 p-3 text-red-800"
          role="alert"
        >
          <span>{error}</span>
          <button type="button" className="btn-paso border-red-400 text-red-800" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && (
        <>
          <p className="mb-2 text-gray-600" id="total-articulos">
            {productos.length} {productos.length === 1 ? 'artículo' : 'artículos'} en el inventario
          </p>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <table className="w-full text-left text-sm sm:text-base" aria-describedby="total-articulos">
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
                {productos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="hidden px-2 py-2 text-gray-500 sm:table-cell sm:px-3">{p.id}</td>
                    <td className="px-2 py-2 sm:px-3">{p.nombre}</td>
                    <td className="px-2 py-2 sm:px-3">{p.marca}</td>
                    <td className="px-2 py-2 sm:px-3">{p.tipo}</td>
                    <td className="hidden px-2 py-2 text-right md:table-cell sm:px-3">{formatearPrecio(p.precio)}</td>
                    <td className="px-2 py-2 sm:px-3 text-right">{p.stock}</td>
                  </tr>
                ))}
                {productos.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-3 py-6 text-center">Todavía no hay artículos en el inventario.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}

export default ListadoArticulos

import { useState } from 'react'
import { useInventario } from '../hooks/useInventario.js'
import { formatearPrecio, normalizar } from '../utils/formato.js'
import EstadoInventario from '../components/EstadoInventario.jsx'
import Boton from '../components/ui/Boton.jsx'
import InsigniaStock from '../components/ui/InsigniaStock.jsx'
import TarjetaDato from '../components/ui/TarjetaDato.jsx'

function Home() {
  const { productos, cargando, error, cambiarStock, reintentar } = useInventario()
  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState('Todos')

  const tipos = ['Todos', ...new Set(productos.map((p) => p.tipo))]

  const visibles = productos.filter((p) => {
    const coincideTexto = normalizar(p.nombre).includes(normalizar(busqueda))
    const coincideTipo = tipo === 'Todos' || p.tipo === tipo
    return coincideTexto && coincideTipo
  })

  const totalUnidades = productos.reduce((acc, p) => acc + p.stock, 0)
  const stockBajo = productos.filter((p) => p.stock > 0 && p.stock <= 10).length
  const sinStock = productos.filter((p) => p.stock === 0).length

  return (
    <section aria-labelledby="titulo-inventario">
      <h2 id="titulo-inventario" className="mb-4 text-2xl">Inventario</h2>

      <EstadoInventario cargando={cargando} error={error} reintentar={reintentar}>
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          <div className="col-span-2 md:col-span-1">
            <TarjetaDato titulo="Unidades en bodega" valor={totalUnidades} />
          </div>
          <TarjetaDato titulo="Stock bajo" valor={stockBajo} clase="text-amber-700" />
          <TarjetaDato titulo="Sin stock" valor={sinStock} clase="text-red-700" />
        </div>

        <form className="mb-4 grid gap-2 md:grid-cols-3" onSubmit={(e) => e.preventDefault()} role="search">
          <div className="md:col-span-2">
            <label htmlFor="busqueda" className="sr-only">Buscar producto</label>
            <input
              id="busqueda"
              type="search"
              className="campo"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="tipo" className="sr-only">Tipo de producto</label>
            <select id="tipo" className="campo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
              {tipos.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </form>

        <div className="tabla-contenedor">
          <table className="tabla">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th scope="col" className="px-1.5 py-2 sm:px-3">Producto</th>
                <th scope="col" className="hidden px-1.5 py-2 sm:px-3 md:table-cell">Tipo</th>
                <th scope="col" className="px-1.5 py-2 sm:px-3 text-right">Precio</th>
                <th scope="col" className="px-1.5 py-2 sm:px-3 text-center">Stock</th>
                <th scope="col" className="px-1.5 py-2 sm:px-3">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibles.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-1.5 py-2 sm:px-3">
                    {p.nombre}
                    <span className="block text-xs text-gray-500">{p.marca}</span>
                  </td>
                  <td className="hidden px-1.5 py-2 sm:px-3 md:table-cell">{p.tipo}</td>
                  <td className="px-1.5 py-2 sm:px-3 text-right">{formatearPrecio(p.precio)}</td>
                  <td className="whitespace-nowrap px-1.5 py-2 sm:px-3 text-center">
                    <Boton
                      variante="paso"
                      className="px-1.5 sm:px-2"
                      aria-label={`Restar una unidad de ${p.nombre}`}
                      onClick={() => cambiarStock(p.id, -1)}
                    >
                      -
                    </Boton>
                    <span className="stock mx-1 sm:mx-2">{p.stock}</span>
                    <Boton
                      variante="paso"
                      className="px-1.5 sm:px-2"
                      aria-label={`Sumar una unidad de ${p.nombre}`}
                      onClick={() => cambiarStock(p.id, 1)}
                    >
                      +
                    </Boton>
                  </td>
                  <td className="px-1.5 py-2 sm:px-3">
                    <InsigniaStock stock={p.stock} />
                  </td>
                </tr>
              ))}
              {visibles.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-3 py-6 text-center">No hay productos que coincidan con la búsqueda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </EstadoInventario>
    </section>
  )
}

export default Home

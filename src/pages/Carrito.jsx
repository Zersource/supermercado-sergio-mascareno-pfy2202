import { Link } from 'react-router-dom'
import { useInventario } from '../hooks/useInventario.js'
import { useCarrito } from '../hooks/useCarrito.js'
import { formatearPrecio } from '../utils/formato.js'
import EstadoInventario from '../components/EstadoInventario.jsx'
import Boton from '../components/ui/Boton.jsx'
import SelectorCantidad from '../components/ui/SelectorCantidad.jsx'
import TarjetaDato from '../components/ui/TarjetaDato.jsx'

function Carrito() {
  const { cargando, error, reintentar, cambiarCantidad, quitarDelCarrito } = useInventario()
  const { lineas, unidades, total } = useCarrito()

  return (
    <section aria-labelledby="titulo-carrito">
      <h2 id="titulo-carrito" className="mb-4 text-2xl">Carrito de compras</h2>

      <EstadoInventario cargando={cargando} error={error} reintentar={reintentar} textoCarga="Cargando carrito...">
        {lineas.length === 0 ? (
          <div className="tarjeta py-8 text-center">
            <p className="mb-4 text-lg">Tu carrito está vacío.</p>
            <Boton to="/articulos">Ver listado de artículos</Boton>
          </div>
        ) : (
          <>
            <div className="mb-6 grid grid-cols-2 gap-3">
              <TarjetaDato titulo="Unidades" valor={unidades} />
              <TarjetaDato titulo="Total a pagar" valor={formatearPrecio(total)} clase="total-pagar text-marca" />
            </div>

            {/* Lista de tarjetas (no tabla): se adapta a cualquier ancho sin scroll horizontal */}
            <ul className="space-y-3">
              {lineas.map(({ producto, cantidad, subtotal }) => (
                <li
                  key={producto.id}
                  className="linea-carrito tarjeta flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <Link
                      to={`/articulos/${producto.id}`}
                      className="font-bold text-marca underline-offset-2 hover:underline"
                    >
                      {producto.nombre}
                    </Link>
                    <span className="block text-sm text-gray-500">
                      {producto.marca} · {formatearPrecio(producto.precio)} c/u · quedan {producto.stock} disponibles
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end sm:gap-5">
                    <SelectorCantidad
                      valor={cantidad}
                      max={cantidad + producto.stock}
                      etiqueta={producto.nombre}
                      onDisminuir={() => cambiarCantidad(producto.id, -1)}
                      onAumentar={() => cambiarCantidad(producto.id, 1)}
                    />
                    <span className="subtotal min-w-[4.5rem] text-right font-bold">{formatearPrecio(subtotal)}</span>
                    <Boton
                      variante="peligro"
                      aria-label={`Quitar ${producto.nombre} del carrito`}
                      onClick={() => quitarDelCarrito(producto.id)}
                    >
                      Quitar
                    </Boton>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-sm text-gray-500">
              Cada unidad que agregas al carrito se descuenta del inventario; al bajar la cantidad o quitar el artículo, vuelve al stock.
            </p>
          </>
        )}
      </EstadoInventario>
    </section>
  )
}

export default Carrito

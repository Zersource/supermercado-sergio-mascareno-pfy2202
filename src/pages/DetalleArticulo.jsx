import { useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useInventario } from '../hooks/useInventario.js'
import { useCarrito } from '../hooks/useCarrito.js'
import { formatearPrecio } from '../utils/formato.js'
import EstadoInventario from '../components/EstadoInventario.jsx'
import Boton from '../components/ui/Boton.jsx'
import InsigniaStock from '../components/ui/InsigniaStock.jsx'
import SelectorCantidad from '../components/ui/SelectorCantidad.jsx'

function DetalleArticulo() {
  const { id } = useParams() // parametro dinamico de la ruta /articulos/:id
  const { state } = useLocation()
  const { productos, cargando, error, reintentar, agregarAlCarrito } = useInventario()
  const { cantidadDe } = useCarrito()
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(null)

  // Vuelve al listado con el mismo filtro que tenia (si venia de ahi)
  const rutaListado = state?.volverA ?? '/articulos'
  const producto = productos.find((p) => p.id === Number(id))

  // La cantidad a agregar nunca supera el stock disponible
  const maximo = producto ? producto.stock : 0
  const cantidadValida = Math.min(Math.max(cantidad, 1), Math.max(maximo, 1))

  function manejarAgregar() {
    agregarAlCarrito(producto.id, cantidadValida)
    setAgregado({ nombre: producto.nombre, cantidad: cantidadValida })
    setCantidad(1)
  }

  const enCarrito = producto ? cantidadDe(producto.id) : 0

  return (
    <div className="mx-auto max-w-xl">
      <p className="mb-3">
        <Link to={rutaListado} className="font-bold text-marca underline-offset-2 hover:underline">
          ← Volver al listado
        </Link>
      </p>

      <EstadoInventario cargando={cargando} error={error} reintentar={reintentar} textoCarga="Cargando artículo...">
        {!producto ? (
          <div className="tarjeta text-center">
            <h2 id="titulo-detalle" className="mb-2 text-2xl">Artículo no encontrado</h2>
            <p className="mb-4">No existe un artículo con el código «{id}».</p>
            <Boton to="/articulos">Ir al listado</Boton>
          </div>
        ) : (
          <article className="tarjeta" aria-labelledby="titulo-detalle">
            <p className="text-sm font-bold uppercase tracking-wide text-gray-500">{producto.tipo}</p>
            <h2 id="titulo-detalle" className="mb-1 text-2xl">{producto.nombre}</h2>
            <p className="mb-4 text-gray-600">Marca: {producto.marca}</p>

            <dl className="mb-4 grid grid-cols-2 gap-3">
              <div>
                <dt className="text-sm text-gray-500">Precio</dt>
                <dd className="precio text-2xl font-bold text-marca">{formatearPrecio(producto.precio)}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Disponibles</dt>
                <dd>
                  <span className="stock-detalle mr-2 text-2xl font-bold">{producto.stock}</span>
                  <InsigniaStock stock={producto.stock} />
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Código</dt>
                <dd>N° {producto.id}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">En tu carrito</dt>
                <dd className="en-carrito">{enCarrito} {enCarrito === 1 ? 'unidad' : 'unidades'}</dd>
              </div>
            </dl>

            {agregado && (
              <div className="aviso-exito mb-4" role="status">
                Agregaste {agregado.cantidad} × «{agregado.nombre}» al carrito.{' '}
                <Link to="/carrito" className="font-bold underline">Ver carrito</Link>
              </div>
            )}

            {producto.stock === 0 ? (
              <p className="rounded-md bg-red-50 p-3 font-bold text-red-800">
                Sin stock: por ahora no se puede agregar al carrito.
              </p>
            ) : (
              <div className="flex flex-wrap items-center gap-4">
                <SelectorCantidad
                  valor={cantidadValida}
                  max={maximo}
                  etiqueta={producto.nombre}
                  onDisminuir={() => setCantidad(cantidadValida - 1)}
                  onAumentar={() => setCantidad(cantidadValida + 1)}
                />
                <Boton onClick={manejarAgregar}>Agregar al carrito</Boton>
              </div>
            )}
          </article>
        )}
      </EstadoInventario>
    </div>
  )
}

export default DetalleArticulo

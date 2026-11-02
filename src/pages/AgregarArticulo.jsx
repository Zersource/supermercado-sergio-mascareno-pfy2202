import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useInventario } from '../hooks/useInventario.js'
import { TIPOS_PRODUCTO } from '../utils/tipos.js'
import { validarArticulo, hayErrores } from '../utils/validaciones.js'

const vacio = { nombre: '', marca: '', tipo: '', precio: '', stock: '' }
const sinErrores = { nombre: '', marca: '', tipo: '', precio: '', stock: '' }

function AgregarArticulo() {
  const { productos, cargando, error, agregarArticulo, reintentar } = useInventario()
  const [datos, setDatos] = useState(vacio)
  const [errores, setErrores] = useState(sinErrores)
  const [agregado, setAgregado] = useState('')

  function manejarCambio(e) {
    const { name, value } = e.target
    setDatos((prev) => ({ ...prev, [name]: value }))
    setAgregado('')
  }

  function manejarEnvio(e) {
    e.preventDefault()
    const resultado = validarArticulo(datos, productos)
    setErrores(resultado)
    if (hayErrores(resultado)) {
      setAgregado('')
      return
    }
    agregarArticulo({
      nombre: datos.nombre.trim(),
      marca: datos.marca.trim(),
      tipo: datos.tipo,
      precio: Number(datos.precio),
      stock: Number(datos.stock),
    })
    setAgregado(datos.nombre.trim())
    setDatos(vacio)
    setErrores(sinErrores)
  }

  // Clase del campo segun tenga error o no
  const clase = (nombre) => 'campo' + (errores[nombre] ? ' campo-error' : '')

  return (
    <section aria-labelledby="titulo-agregar" className="mx-auto max-w-xl">
      <h2 id="titulo-agregar" className="mb-4 text-2xl">Agregar artículo</h2>

      {cargando && <p role="status">Cargando inventario...</p>}

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

      {agregado && (
        <div className="mb-4 rounded-md border border-green-300 bg-green-50 p-3 text-green-800" role="status">
          «{agregado}» se agregó al inventario.{' '}
          <Link to="/articulos" className="font-bold underline">Ver listado</Link>
        </div>
      )}

      {!cargando && !error && (
        <form onSubmit={manejarEnvio} noValidate className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
          <div>
            <label htmlFor="nombre" className="mb-1 block font-bold">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              className={clase('nombre')}
              value={datos.nombre}
              onChange={manejarCambio}
              aria-invalid={errores.nombre ? 'true' : 'false'}
              aria-describedby="error-nombre"
            />
            <p id="error-nombre" className="mt-1 text-sm text-red-700">{errores.nombre}</p>
          </div>

          <div>
            <label htmlFor="marca" className="mb-1 block font-bold">Marca</label>
            <input
              id="marca"
              name="marca"
              type="text"
              className={clase('marca')}
              value={datos.marca}
              onChange={manejarCambio}
              aria-invalid={errores.marca ? 'true' : 'false'}
              aria-describedby="error-marca"
            />
            <p id="error-marca" className="mt-1 text-sm text-red-700">{errores.marca}</p>
          </div>

          <div>
            <label htmlFor="tipo-producto" className="mb-1 block font-bold">Tipo de producto</label>
            <select
              id="tipo-producto"
              name="tipo"
              className={clase('tipo')}
              value={datos.tipo}
              onChange={manejarCambio}
              aria-invalid={errores.tipo ? 'true' : 'false'}
              aria-describedby="error-tipo"
            >
              <option value="">Selecciona un tipo</option>
              {TIPOS_PRODUCTO.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <p id="error-tipo" className="mt-1 text-sm text-red-700">{errores.tipo}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="precio" className="mb-1 block font-bold">Precio (CLP)</label>
              <input
                id="precio"
                name="precio"
                type="number"
                min="1"
                step="1"
                inputMode="numeric"
                className={clase('precio')}
                value={datos.precio}
                onChange={manejarCambio}
                aria-invalid={errores.precio ? 'true' : 'false'}
                aria-describedby="error-precio"
              />
              <p id="error-precio" className="mt-1 text-sm text-red-700">{errores.precio}</p>
            </div>
            <div>
              <label htmlFor="stock" className="mb-1 block font-bold">Stock inicial</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                step="1"
                inputMode="numeric"
                className={clase('stock')}
                value={datos.stock}
                onChange={manejarCambio}
                aria-invalid={errores.stock ? 'true' : 'false'}
                aria-describedby="error-stock"
              />
              <p id="error-stock" className="mt-1 text-sm text-red-700">{errores.stock}</p>
            </div>
          </div>

          <button type="submit" className="btn-marca">Agregar al inventario</button>
        </form>
      )}
    </section>
  )
}

export default AgregarArticulo

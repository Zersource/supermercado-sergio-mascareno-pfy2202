import { useState } from 'react'
import Boton from '../components/ui/Boton.jsx'
import { validarContacto, hayErrores } from '../utils/validaciones.js'

const vacio = { nombre: '', email: '', mensaje: '' }

function Contacto() {
  const [datos, setDatos] = useState(vacio)
  const [errores, setErrores] = useState({ nombre: '', email: '', mensaje: '' })
  const [enviado, setEnviado] = useState(false)

  function manejarCambio(e) {
    const { name, value } = e.target
    setDatos((prev) => ({ ...prev, [name]: value }))
    setEnviado(false)
  }

  function manejarEnvio(e) {
    e.preventDefault()
    const resultado = validarContacto(datos)
    setErrores(resultado)
    if (hayErrores(resultado)) {
      setEnviado(false)
      return
    }
    setEnviado(true)
    setDatos(vacio)
  }

  const clase = (nombre) => 'campo' + (errores[nombre] ? ' campo-error' : '')

  return (
    <section aria-labelledby="titulo-contacto" className="mx-auto max-w-xl">
      <h2 id="titulo-contacto" className="mb-4 text-2xl">Contáctanos</h2>

      {enviado && (
        <div className="mb-4 rounded-md border border-green-300 bg-green-50 p-3 text-green-800" role="status">
          Gracias por escribirnos. Tu mensaje fue recibido.
        </div>
      )}

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
          <label htmlFor="email" className="mb-1 block font-bold">Correo</label>
          <input
            id="email"
            name="email"
            type="email"
            className={clase('email')}
            value={datos.email}
            onChange={manejarCambio}
            aria-invalid={errores.email ? 'true' : 'false'}
            aria-describedby="error-email"
          />
          <p id="error-email" className="mt-1 text-sm text-red-700">{errores.email}</p>
        </div>

        <div>
          <label htmlFor="mensaje" className="mb-1 block font-bold">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="4"
            className={clase('mensaje')}
            value={datos.mensaje}
            onChange={manejarCambio}
            aria-invalid={errores.mensaje ? 'true' : 'false'}
            aria-describedby="error-mensaje"
          ></textarea>
          <p id="error-mensaje" className="mt-1 text-sm text-red-700">{errores.mensaje}</p>
        </div>

        <Boton type="submit">Enviar mensaje</Boton>
      </form>
    </section>
  )
}

export default Contacto

import { useState } from 'react'
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

  return (
    <section aria-labelledby="titulo-contacto">
      <h2 id="titulo-contacto" className="h3 mb-3">Contáctanos</h2>

      {enviado && (
        <div className="alert alert-success" role="status">
          Gracias por escribirnos. Tu mensaje fue recibido.
        </div>
      )}

      <form onSubmit={manejarEnvio} noValidate className="bg-white border rounded p-3">
        <div className="mb-3">
          <label htmlFor="nombre" className="form-label">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
            value={datos.nombre}
            onChange={manejarCambio}
            aria-describedby="error-nombre"
          />
          <div id="error-nombre" className="invalid-feedback">{errores.nombre}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">Correo</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-control ${errores.email ? 'is-invalid' : ''}`}
            value={datos.email}
            onChange={manejarCambio}
            aria-describedby="error-email"
          />
          <div id="error-email" className="invalid-feedback">{errores.email}</div>
        </div>

        <div className="mb-3">
          <label htmlFor="mensaje" className="form-label">Mensaje</label>
          <textarea
            id="mensaje"
            name="mensaje"
            rows="4"
            className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`}
            value={datos.mensaje}
            onChange={manejarCambio}
            aria-describedby="error-mensaje"
          ></textarea>
          <div id="error-mensaje" className="invalid-feedback">{errores.mensaje}</div>
        </div>

        <button type="submit" className="btn btn-marca">Enviar mensaje</button>
      </form>
    </section>
  )
}

export default Contacto

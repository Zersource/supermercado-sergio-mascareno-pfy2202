// Funciones puras de validacion para el formulario de contacto

export function validarNombre(nombre) {
  const limpio = nombre.trim()
  if (limpio.length === 0) return 'El nombre es obligatorio.'
  if (limpio.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  return ''
}

export function validarEmail(email) {
  const limpio = email.trim()
  if (limpio.length === 0) return 'El correo es obligatorio.'
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!patron.test(limpio)) return 'Ingresa un correo válido (ej: nombre@dominio.cl).'
  return ''
}

export function validarMensaje(mensaje) {
  const limpio = mensaje.trim()
  if (limpio.length === 0) return 'El mensaje es obligatorio.'
  if (limpio.length < 10) return 'El mensaje debe tener al menos 10 caracteres.'
  return ''
}

export function validarContacto({ nombre, email, mensaje }) {
  return {
    nombre: validarNombre(nombre),
    email: validarEmail(email),
    mensaje: validarMensaje(mensaje),
  }
}

export function hayErrores(errores) {
  return Object.values(errores).some((e) => e !== '')
}

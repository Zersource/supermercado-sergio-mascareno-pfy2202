import { TIPOS_PRODUCTO } from './tipos.js'
import { normalizar } from './formato.js'

// Funciones puras de validacion para los formularios (contacto y nuevo articulo)

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

// ---- Formulario de nuevo articulo ----

export function validarNombreArticulo(nombre) {
  const limpio = nombre.trim()
  if (limpio.length === 0) return 'El nombre es obligatorio.'
  if (limpio.length < 3) return 'El nombre debe tener al menos 3 caracteres.'
  return ''
}

export function validarMarca(marca) {
  const limpio = marca.trim()
  if (limpio.length === 0) return 'La marca es obligatoria.'
  if (limpio.length < 2) return 'La marca debe tener al menos 2 caracteres.'
  return ''
}

export function validarTipo(tipo) {
  if (!tipo) return 'Selecciona un tipo de producto.'
  if (!TIPOS_PRODUCTO.includes(tipo)) return 'El tipo de producto no es válido.'
  return ''
}

export function validarPrecio(precio) {
  if (String(precio).trim() === '') return 'El precio es obligatorio.'
  const n = Number(precio)
  if (!Number.isInteger(n) || n < 1) return 'El precio debe ser un número entero mayor a 0.'
  return ''
}

export function validarStock(stock) {
  if (String(stock).trim() === '') return 'El stock es obligatorio.'
  const n = Number(stock)
  if (!Number.isInteger(n) || n < 0) return 'El stock debe ser un número entero, 0 o más.'
  return ''
}

// Valida todos los campos y evita repetir un articulo (mismo nombre y marca)
export function validarArticulo(datos, existentes = []) {
  const errores = {
    nombre: validarNombreArticulo(datos.nombre),
    marca: validarMarca(datos.marca),
    tipo: validarTipo(datos.tipo),
    precio: validarPrecio(datos.precio),
    stock: validarStock(datos.stock),
  }
  if (!errores.nombre && !errores.marca) {
    const repetido = existentes.some(
      (p) =>
        normalizar(p.nombre) === normalizar(datos.nombre.trim()) &&
        normalizar(p.marca) === normalizar(datos.marca.trim()),
    )
    if (repetido) errores.nombre = 'Ya existe un artículo con ese nombre y marca.'
  }
  return errores
}

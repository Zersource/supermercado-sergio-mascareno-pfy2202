// Formato de precio en pesos chilenos
export function formatearPrecio(valor) {
  return '$' + valor.toLocaleString('es-CL')
}

// Quita tildes y pasa a minusculas para comparar en busquedas
export function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

// Clasificacion de stock: sin stock, bajo o normal
export function estadoStock(stock) {
  if (stock === 0) return { etiqueta: 'Sin stock', clase: 'text-bg-danger' }
  if (stock <= 10) return { etiqueta: 'Stock bajo', clase: 'text-bg-warning' }
  return { etiqueta: 'Disponible', clase: 'text-bg-success' }
}

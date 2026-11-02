// Formato de precio en pesos chilenos
export function formatearPrecio(valor) {
  return '$' + valor.toLocaleString('es-CL')
}

// Quita tildes y pasa a minusculas para comparar en busquedas
export function normalizar(texto) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
}

// Clasificacion de stock: sin stock, bajo o normal (clases de Tailwind)
export function estadoStock(stock) {
  if (stock === 0) return { etiqueta: 'Sin stock', clase: 'bg-red-100 text-red-800' }
  if (stock <= 10) return { etiqueta: 'Stock bajo', clase: 'bg-amber-100 text-amber-800' }
  return { etiqueta: 'Disponible', clase: 'bg-green-100 text-green-800' }
}

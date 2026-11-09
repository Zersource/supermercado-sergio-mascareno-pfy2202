// Filtro por categoria del listado de articulos.
// Son funciones puras: reciben el inventario y devuelven una lista NUEVA,
// nunca modifican el arreglo original (los datos del inventario no se pierden).

// Valor del selector que representa "sin filtro"
export const TODAS = 'Todas'

// Devuelve solo los articulos de la categoria elegida (o todos si no hay filtro)
export function filtrarPorCategoria(productos, categoria) {
  if (!categoria || categoria === TODAS) return [...productos]
  return productos.filter((p) => p.tipo === categoria)
}

// Cantidad de articulos por categoria, para mostrarla en el selector
export function contarPorCategoria(productos) {
  return productos.reduce((conteo, p) => ({ ...conteo, [p.tipo]: (conteo[p.tipo] ?? 0) + 1 }), {})
}

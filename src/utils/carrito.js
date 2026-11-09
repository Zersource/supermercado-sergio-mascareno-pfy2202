// Calculos del carrito. Funciones puras: el estado guarda solo { id, cantidad }
// y aqui se combina con los datos del inventario (nombre, marca, precio...).

// Une cada linea del carrito con su articulo y calcula el subtotal.
// Se ignoran lineas cuyo articulo ya no exista.
export function calcularLineas(productos, carrito) {
  return carrito.flatMap((linea) => {
    const producto = productos.find((p) => p.id === linea.id)
    if (!producto) return []
    return [{ producto, cantidad: linea.cantidad, subtotal: producto.precio * linea.cantidad }]
  })
}

export function totalUnidades(lineas) {
  return lineas.reduce((acc, l) => acc + l.cantidad, 0)
}

export function totalPrecio(lineas) {
  return lineas.reduce((acc, l) => acc + l.subtotal, 0)
}

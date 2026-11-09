// Reducer del estado global. Es JavaScript puro (sin JSX ni React) para poder
// probarlo de forma aislada con `npm test`.
//
// Forma del estado:
//   productos: [{ id, nombre, marca, tipo, precio, stock }]   inventario (stock = unidades disponibles)
//   carrito:   [{ id, cantidad }]                              unidades que el usuario reservo
//   cargando, error
//
// Invariante: al agregar o quitar unidades del carrito, `stock` y `cantidad`
// cambian en la MISMA accion. Por eso el carrito vive junto al inventario: si
// fueran dos estados separados, podrian quedar desincronizados.

export const estadoInicial = { productos: [], carrito: [], cargando: true, error: '' }

// Tipos de accion del reducer (evita errores de tipeo en los strings)
export const ACTIONS = {
  CARGA_INICIO: 'carga/inicio',
  CARGA_EXITO: 'carga/exito',
  CARGA_ERROR: 'carga/error',
  CAMBIAR_STOCK: 'stock/cambiar',
  AGREGAR_ARTICULO: 'articulo/agregar',
  AGREGAR_AL_CARRITO: 'carrito/agregar',
  CAMBIAR_CANTIDAD: 'carrito/cambiar-cantidad',
  QUITAR_DEL_CARRITO: 'carrito/quitar',
}

// Cambia el stock de un solo producto sin tocar los demas (copia inmutable)
function conStock(productos, id, nuevoStock) {
  return productos.map((p) => (p.id === id ? { ...p, stock: nuevoStock } : p))
}

// Todas las modificaciones del inventario pasan por este reducer.
// Cada accion es un objeto { type, payload }.
export function reductor(estado, accion) {
  switch (accion.type) {
    case ACTIONS.CARGA_INICIO:
      return { ...estado, cargando: true, error: '' }

    case ACTIONS.CARGA_EXITO:
      // Inventario recien cargado: el carrito parte vacio para no desajustar el stock
      return { productos: accion.payload, carrito: [], cargando: false, error: '' }

    case ACTIONS.CARGA_ERROR:
      return { ...estado, cargando: false, error: accion.payload }

    case ACTIONS.CAMBIAR_STOCK:
      return {
        ...estado,
        productos: estado.productos.map((p) =>
          p.id === accion.payload.id
            ? { ...p, stock: Math.max(0, p.stock + accion.payload.delta) }
            : p,
        ),
      }

    case ACTIONS.AGREGAR_ARTICULO: {
      const id = estado.productos.reduce((max, p) => Math.max(max, p.id), 0) + 1
      return { ...estado, productos: [...estado.productos, { id, ...accion.payload }] }
    }

    // Detalle de articulo -> "Agregar al carrito": resta del inventario
    case ACTIONS.AGREGAR_AL_CARRITO: {
      const { id } = accion.payload
      const producto = estado.productos.find((p) => p.id === id)
      if (!producto) return estado
      // Nunca se puede llevar mas de lo que hay disponible
      const cantidad = Math.min(Math.floor(accion.payload.cantidad), producto.stock)
      if (!(cantidad >= 1)) return estado
      const enCarrito = estado.carrito.some((l) => l.id === id)
      return {
        ...estado,
        productos: conStock(estado.productos, id, producto.stock - cantidad),
        carrito: enCarrito
          ? estado.carrito.map((l) => (l.id === id ? { ...l, cantidad: l.cantidad + cantidad } : l))
          : [...estado.carrito, { id, cantidad }],
      }
    }

    // Carrito -> botones + y -: sube o baja la cantidad y ajusta el inventario
    case ACTIONS.CAMBIAR_CANTIDAD: {
      const { id } = accion.payload
      const linea = estado.carrito.find((l) => l.id === id)
      const producto = estado.productos.find((p) => p.id === id)
      if (!linea || !producto) return estado
      // La linea no baja de 1 (para eliminarla se usa QUITAR_DEL_CARRITO)
      // ni sube mas alla del stock disponible
      const delta = Math.max(1 - linea.cantidad, Math.min(Math.trunc(accion.payload.delta), producto.stock))
      if (!delta) return estado
      return {
        ...estado,
        productos: conStock(estado.productos, id, producto.stock - delta),
        carrito: estado.carrito.map((l) => (l.id === id ? { ...l, cantidad: l.cantidad + delta } : l)),
      }
    }

    // Carrito -> "Quitar": devuelve todas las unidades al inventario
    case ACTIONS.QUITAR_DEL_CARRITO: {
      const { id } = accion.payload
      const linea = estado.carrito.find((l) => l.id === id)
      if (!linea) return estado
      const producto = estado.productos.find((p) => p.id === id)
      return {
        ...estado,
        productos: producto ? conStock(estado.productos, id, producto.stock + linea.cantidad) : estado.productos,
        carrito: estado.carrito.filter((l) => l.id !== id),
      }
    }

    default:
      return estado
  }
}

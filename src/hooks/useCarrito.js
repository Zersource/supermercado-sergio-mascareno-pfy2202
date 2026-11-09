import { useMemo } from 'react'
import { useInventario } from './useInventario.js'
import { calcularLineas, totalUnidades, totalPrecio } from '../utils/carrito.js'

// Vista del carrito lista para mostrar: lineas con su articulo, cantidad y subtotal,
// mas los totales. Las acciones (agregar, cambiar, quitar) estan en useInventario.
export function useCarrito() {
  const { productos, carrito } = useInventario()
  return useMemo(() => {
    const lineas = calcularLineas(productos, carrito)
    return {
      lineas,
      unidades: totalUnidades(lineas),
      total: totalPrecio(lineas),
      cantidadDe: (id) => carrito.find((l) => l.id === id)?.cantidad ?? 0,
    }
  }, [productos, carrito])
}

import { createContext, useEffect, useReducer } from 'react'
import { ACTIONS, estadoInicial, reductor } from './inventarioReducer.js'

// Estado global del inventario y del carrito (ver inventarioReducer.js).
// Cada articulo tiene: { id, nombre, marca, tipo, precio, stock }
export const InventarioContext = createContext(null)

export function InventarioProvider({ children }) {
  const [estado, dispatch] = useReducer(reductor, estadoInicial)
  const [intento, reintentarCarga] = useReducer((n) => n + 1, 0)

  // Carga inicial desde public/productos.json (tambien se repite al reintentar)
  useEffect(() => {
    const controlador = new AbortController()
    dispatch({ type: ACTIONS.CARGA_INICIO })
    fetch(`${import.meta.env.BASE_URL}productos.json`, { signal: controlador.signal })
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar el inventario.')
        return res.json()
      })
      .then((productos) => dispatch({ type: ACTIONS.CARGA_EXITO, payload: productos }))
      .catch((err) => {
        if (err.name === 'AbortError') return
        dispatch({ type: ACTIONS.CARGA_ERROR, payload: err.message || 'Error al cargar el inventario.' })
      })
    return () => controlador.abort()
  }, [intento])

  const valor = {
    productos: estado.productos,
    carrito: estado.carrito,
    cargando: estado.cargando,
    error: estado.error,
    cambiarStock: (id, delta) => dispatch({ type: ACTIONS.CAMBIAR_STOCK, payload: { id, delta } }),
    agregarArticulo: (articulo) => dispatch({ type: ACTIONS.AGREGAR_ARTICULO, payload: articulo }),
    agregarAlCarrito: (id, cantidad) =>
      dispatch({ type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id, cantidad } }),
    cambiarCantidad: (id, delta) => dispatch({ type: ACTIONS.CAMBIAR_CANTIDAD, payload: { id, delta } }),
    quitarDelCarrito: (id) => dispatch({ type: ACTIONS.QUITAR_DEL_CARRITO, payload: { id } }),
    reintentar: reintentarCarga,
  }

  return <InventarioContext.Provider value={valor}>{children}</InventarioContext.Provider>
}

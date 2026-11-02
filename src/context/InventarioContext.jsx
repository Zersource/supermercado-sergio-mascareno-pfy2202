import { createContext, useEffect, useReducer } from 'react'

// Estado global del inventario. Cada articulo tiene:
// { id, nombre, marca, tipo, precio, stock }
export const InventarioContext = createContext(null)

const estadoInicial = { productos: [], cargando: true, error: '' }

// Tipos de accion del reducer (evita errores de tipeo en los strings)
export const ACTIONS = {
  CARGA_INICIO: 'carga/inicio',
  CARGA_EXITO: 'carga/exito',
  CARGA_ERROR: 'carga/error',
  CAMBIAR_STOCK: 'stock/cambiar',
  AGREGAR_ARTICULO: 'articulo/agregar',
}

// Todas las modificaciones del inventario pasan por este reducer.
// Cada accion es un objeto { type, payload }.
function reductor(estado, accion) {
  switch (accion.type) {
    case ACTIONS.CARGA_INICIO:
      return { ...estado, cargando: true, error: '' }
    case ACTIONS.CARGA_EXITO:
      return { productos: accion.payload, cargando: false, error: '' }
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
    default:
      return estado
  }
}

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
    cargando: estado.cargando,
    error: estado.error,
    cambiarStock: (id, delta) => dispatch({ type: ACTIONS.CAMBIAR_STOCK, payload: { id, delta } }),
    agregarArticulo: (articulo) => dispatch({ type: ACTIONS.AGREGAR_ARTICULO, payload: articulo }),
    reintentar: reintentarCarga,
  }

  return <InventarioContext.Provider value={valor}>{children}</InventarioContext.Provider>
}

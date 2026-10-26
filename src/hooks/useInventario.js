import { useEffect, useState } from 'react'

// Carga el inventario una sola vez y lo mantiene en el estado, para que los
// cambios de stock sobrevivan a la navegacion entre rutas.
export function useInventario() {
  const [productos, setProductos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)

  useEffect(() => {
    const controlador = new AbortController()
    setCargando(true)
    setError('')
    fetch(`${import.meta.env.BASE_URL}productos.json`, { signal: controlador.signal })
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar el inventario.')
        return res.json()
      })
      .then((datos) => {
        setProductos(datos)
        setCargando(false)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setError(err.message || 'Error al cargar el inventario.')
        setCargando(false)
      })
    return () => controlador.abort()
  }, [intento])

  function cambiarStock(id, delta) {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)),
    )
  }

  function reintentar() {
    setIntento((n) => n + 1)
  }

  return { productos, cargando, error, cambiarStock, reintentar }
}

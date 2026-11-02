import { useContext } from 'react'
import { InventarioContext } from '../context/InventarioContext.jsx'

// Acceso al estado global del inventario desde cualquier componente
export function useInventario() {
  const contexto = useContext(InventarioContext)
  if (!contexto) {
    throw new Error('useInventario debe usarse dentro de InventarioProvider')
  }
  return contexto
}

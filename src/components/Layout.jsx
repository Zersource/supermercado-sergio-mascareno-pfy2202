import { Outlet } from 'react-router-dom'
import MenuInferior from './MenuInferior.jsx'
import { useInventario } from '../hooks/useInventario.js'

function Layout() {
  // El inventario vive aqui para compartirlo con las rutas hijas via Outlet context
  const inventario = useInventario()

  return (
    <>
      <header className="bg-success text-white py-3">
        <div className="container">
          <h1 className="h4 mb-0">Supermercado Newen</h1>
          <p className="mb-0 small">Gestión de inventario</p>
        </div>
      </header>
      <main className="container py-4">
        <Outlet context={inventario} />
      </main>
      <MenuInferior />
    </>
  )
}

export default Layout

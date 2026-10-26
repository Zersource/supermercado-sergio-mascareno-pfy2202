import { Outlet } from 'react-router-dom'
import MenuInferior from './MenuInferior.jsx'
import { useInventario } from '../hooks/useInventario.js'

function Layout() {
  // El inventario vive aqui para compartirlo con las rutas hijas via Outlet context
  const inventario = useInventario()

  return (
    <>
      <header className="encabezado-marca py-3">
        <div className="container">
          <h1 className="marca mb-0">Mi Mercado</h1>
          <p className="mb-0 eslogan">Los mejores precios cerca de ti</p>
          <p className="mb-0 small opacity-75">Gestión de inventario</p>
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

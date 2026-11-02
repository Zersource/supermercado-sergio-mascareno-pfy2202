import { Outlet, Link } from 'react-router-dom'
import MenuSuperior from './MenuSuperior.jsx'
import MenuInferior from './MenuInferior.jsx'

function Layout() {
  return (
    <div className="min-h-screen pb-24">
      <header className="border-b-4 border-ambar bg-marca text-white">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <Link to="/" className="block no-underline">
            <span className="block text-3xl font-extrabold leading-tight tracking-wide text-white">Mi Mercado</span>
          </Link>
          <p className="font-bold text-ambar">Los mejores precios cerca de ti</p>
          <p className="text-sm opacity-75">Gestión de inventario</p>
        </div>
        <MenuSuperior />
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
      <MenuInferior />
    </div>
  )
}

export default Layout

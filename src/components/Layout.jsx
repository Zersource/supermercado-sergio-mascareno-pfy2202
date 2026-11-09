import { Suspense } from 'react'
import { Outlet, Link } from 'react-router-dom'
import MenuSuperior from './MenuSuperior.jsx'
import MenuInferior from './MenuInferior.jsx'

function Layout() {
  return (
    <div className="min-h-screen pb-24">
      <header className="border-b-4 border-ambar bg-marca text-white">
        <div className="mx-auto max-w-5xl px-4 py-3">
          <h1 className="text-3xl leading-tight tracking-wide">
            <Link to="/" className="block text-white no-underline">Mi Mercado</Link>
          </h1>
          <p className="font-bold text-ambar">Los mejores precios cerca de ti</p>
          <p className="text-sm opacity-75">Gestión de inventario</p>
        </div>
        <MenuSuperior />
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        {/* Mientras se descarga el codigo de la pagina (React.lazy) se ve este aviso */}
        <Suspense fallback={<p className="py-12 text-center" role="status">Cargando página...</p>}>
          <Outlet />
        </Suspense>
      </main>
      <MenuInferior />
    </div>
  )
}

export default Layout

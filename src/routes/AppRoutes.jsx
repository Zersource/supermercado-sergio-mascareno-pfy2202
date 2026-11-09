import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout.jsx'

// Todas las rutas del sitio estan en este archivo. Cada pagina se importa con
// React.lazy: su codigo se descarga solo cuando el usuario entra a esa ruta.
// El <Suspense> que muestra el mensaje de carga esta en Layout, alrededor del <Outlet />.
const Home = lazy(() => import('../pages/Home.jsx'))
const AgregarArticulo = lazy(() => import('../pages/AgregarArticulo.jsx'))
const ListadoArticulos = lazy(() => import('../pages/ListadoArticulos.jsx'))
const DetalleArticulo = lazy(() => import('../pages/DetalleArticulo.jsx'))
const Carrito = lazy(() => import('../pages/Carrito.jsx'))
const PreguntasFrecuentes = lazy(() => import('../pages/PreguntasFrecuentes.jsx'))
const Contacto = lazy(() => import('../pages/Contacto.jsx'))
const NoEncontrada = lazy(() => import('../pages/NoEncontrada.jsx'))

function AppRoutes() {
  return (
    <Routes>
      {/* Layout comun (encabezado, menus) para todas las paginas */}
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="agregar-articulo" element={<AgregarArticulo />} />
        {/* Rutas anidadas: /articulos (listado) y /articulos/:id (detalle con parametro) */}
        <Route path="articulos">
          <Route index element={<ListadoArticulos />} />
          <Route path=":id" element={<DetalleArticulo />} />
        </Route>
        <Route path="carrito" element={<Carrito />} />
        <Route path="preguntas-frecuentes" element={<PreguntasFrecuentes />} />
        <Route path="contactanos" element={<Contacto />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes

import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import AgregarArticulo from './pages/AgregarArticulo.jsx'
import ListadoArticulos from './pages/ListadoArticulos.jsx'
import PreguntasFrecuentes from './pages/PreguntasFrecuentes.jsx'
import Contacto from './pages/Contacto.jsx'
import NoEncontrada from './pages/NoEncontrada.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="agregar-articulo" element={<AgregarArticulo />} />
        <Route path="articulos" element={<ListadoArticulos />} />
        <Route path="preguntas-frecuentes" element={<PreguntasFrecuentes />} />
        <Route path="contactanos" element={<Contacto />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  )
}

export default App

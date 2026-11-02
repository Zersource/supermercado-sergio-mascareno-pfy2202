import { Link } from 'react-router-dom'

function NoEncontrada() {
  return (
    <section className="py-12 text-center" aria-labelledby="titulo-404">
      <h2 id="titulo-404" className="mb-2 text-2xl">Página no encontrada</h2>
      <p className="mb-4">La ruta que buscas no existe.</p>
      <Link to="/" className="btn-marca">Volver al inicio</Link>
    </section>
  )
}

export default NoEncontrada

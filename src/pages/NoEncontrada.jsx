import { Link } from 'react-router-dom'

function NoEncontrada() {
  return (
    <section className="text-center py-5" aria-labelledby="titulo-404">
      <h2 id="titulo-404" className="h3">Página no encontrada</h2>
      <p>La ruta que buscas no existe.</p>
      <Link to="/" className="btn btn-marca">Volver al inicio</Link>
    </section>
  )
}

export default NoEncontrada

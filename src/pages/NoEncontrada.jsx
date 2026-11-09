import Boton from '../components/ui/Boton.jsx'

function NoEncontrada() {
  return (
    <section className="py-12 text-center" aria-labelledby="titulo-404">
      <h2 id="titulo-404" className="mb-2 text-2xl">Página no encontrada</h2>
      <p className="mb-4">La ruta que buscas no existe.</p>
      <Boton to="/">Volver al inicio</Boton>
    </section>
  )
}

export default NoEncontrada

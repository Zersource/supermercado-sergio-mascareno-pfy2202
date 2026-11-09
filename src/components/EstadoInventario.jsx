import Boton from './ui/Boton.jsx'

// Muestra "cargando" o el error (con boton Reintentar) mientras el inventario
// no esta listo, y renderiza `children` cuando ya hay datos. Lo usan todas las
// paginas que dependen del inventario, para no repetir este bloque.
function EstadoInventario({ cargando, error, reintentar, textoCarga = 'Cargando inventario...', children }) {
  if (cargando) {
    return (
      <div className="py-12 text-center" role="status">
        <div
          className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-marca border-t-transparent"
          aria-hidden="true"
        ></div>
        <p className="mt-2">{textoCarga}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alerta-error" role="alert">
        <span>{error}</span>
        <Boton variante="paso" className="border-red-400 text-red-800" onClick={reintentar}>
          Reintentar
        </Boton>
      </div>
    )
  }

  return children
}

export default EstadoInventario

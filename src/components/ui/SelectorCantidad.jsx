import Boton from './Boton.jsx'

// Control "- cantidad +" usado en el detalle del articulo y en el carrito.
// Es un componente controlado: el padre decide que pasa al subir o bajar.
function SelectorCantidad({ valor, min = 1, max, onDisminuir, onAumentar, etiqueta }) {
  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={`Cantidad de ${etiqueta}`}>
      <Boton
        variante="paso"
        className="px-2.5 py-1"
        aria-label={`Disminuir cantidad de ${etiqueta}`}
        disabled={valor <= min}
        onClick={onDisminuir}
      >
        -
      </Boton>
      <span className="cantidad min-w-[2ch] text-center font-bold" aria-live="polite">{valor}</span>
      <Boton
        variante="paso"
        className="px-2.5 py-1"
        aria-label={`Aumentar cantidad de ${etiqueta}`}
        disabled={valor >= max}
        onClick={onAumentar}
      >
        +
      </Boton>
    </div>
  )
}

export default SelectorCantidad

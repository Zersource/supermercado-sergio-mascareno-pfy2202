import { estadoStock } from '../../utils/formato.js'

// Etiqueta de color segun el stock: Sin stock, Stock bajo o Disponible
function InsigniaStock({ stock }) {
  const estado = estadoStock(stock)
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold ${estado.clase}`}>
      {estado.etiqueta}
    </span>
  )
}

export default InsigniaStock

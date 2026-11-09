// Tarjeta con un titulo y un valor grande (resumen del inicio y del carrito)
function TarjetaDato({ titulo, valor, clase = '' }) {
  return (
    <div className="tarjeta text-center">
      <p className="mb-1 text-gray-500">{titulo}</p>
      <p className={`text-3xl font-bold sm:text-4xl ${clase}`}>{valor}</p>
    </div>
  )
}

export default TarjetaDato

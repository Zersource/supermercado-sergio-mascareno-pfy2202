import { useState } from 'react'

const preguntas = [
  {
    id: 'p1',
    pregunta: '¿Cómo se actualiza el stock de un producto?',
    respuesta:
      'En la página de inicio, cada producto tiene botones + y - en la columna Stock. Cada clic suma o resta una unidad y el estado del producto se actualiza al instante.',
  },
  {
    id: 'p2',
    pregunta: '¿Cuándo un producto aparece con stock bajo?',
    respuesta:
      'Cuando quedan 10 unidades o menos. Si llega a 0, el producto se marca como sin stock y se cuenta aparte en el resumen superior.',
  },
  {
    id: 'p3',
    pregunta: '¿Puedo buscar o filtrar productos?',
    respuesta:
      'Sí. Usa el buscador por nombre (ignora tildes y mayúsculas) y el selector de tipo de producto. Ambos filtros funcionan al mismo tiempo.',
  },
  {
    id: 'p4',
    pregunta: '¿Cómo agrego un artículo nuevo?',
    respuesta:
      'Entra a Agregar artículo en el menú superior, completa nombre, marca, tipo de producto, precio y stock inicial, y presiona Agregar al inventario. El artículo aparece de inmediato en el inicio y en el Listado de artículos.',
  },
  {
    id: 'p5',
    pregunta: '¿Los cambios se guardan?',
    respuesta:
      'En esta versión los cambios viven en el estado global de la aplicación: se mantienen mientras navegas entre páginas, pero se reinician al recargar el navegador. La persistencia queda para una etapa posterior.',
  },
  {
    id: 'p6',
    pregunta: '¿Cómo me comunico con el equipo?',
    respuesta:
      'Desde la página Contáctanos, en el menú inferior, puedes enviar un mensaje con tu nombre y correo.',
  },
]

function PreguntasFrecuentes() {
  // Solo una respuesta abierta a la vez; la primera parte abierta
  const [abierta, setAbierta] = useState('p1')

  return (
    <section aria-labelledby="titulo-faq">
      <h2 id="titulo-faq" className="mb-4 text-2xl">Preguntas frecuentes</h2>
      <div className="divide-y divide-gray-200 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {preguntas.map((p) => {
          const estaAbierta = abierta === p.id
          return (
            <div key={p.id}>
              <h3 className="text-base">
                <button
                  type="button"
                  className={
                    'acordeon-boton flex w-full items-center justify-between px-4 py-3 text-left font-bold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-marca/40 ' +
                    (estaAbierta ? 'bg-red-50 text-marca' : '')
                  }
                  aria-expanded={estaAbierta}
                  aria-controls={`respuesta-${p.id}`}
                  id={`pregunta-${p.id}`}
                  onClick={() => setAbierta(estaAbierta ? '' : p.id)}
                >
                  {p.pregunta}
                  <span aria-hidden="true" className="ml-3">{estaAbierta ? '−' : '+'}</span>
                </button>
              </h3>
              <div
                id={`respuesta-${p.id}`}
                role="region"
                aria-labelledby={`pregunta-${p.id}`}
                hidden={!estaAbierta}
                className="px-4 py-3 text-gray-700"
              >
                {p.respuesta}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default PreguntasFrecuentes

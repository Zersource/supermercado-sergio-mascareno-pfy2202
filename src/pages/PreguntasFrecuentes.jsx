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
      'Sí. Usa el buscador por nombre (ignora tildes y mayúsculas) y el selector de categoría. Ambos filtros funcionan al mismo tiempo.',
  },
  {
    id: 'p4',
    pregunta: '¿Los cambios de stock se guardan?',
    respuesta:
      'En esta versión los cambios viven en el estado de la aplicación: se mantienen mientras navegas entre páginas, pero se reinician al recargar el navegador. La persistencia queda para una etapa posterior.',
  },
  {
    id: 'p5',
    pregunta: '¿Cómo me comunico con el equipo?',
    respuesta:
      'Desde la página Contáctanos, en el menú inferior, puedes enviar un mensaje con tu nombre y correo.',
  },
]

function PreguntasFrecuentes() {
  return (
    <section aria-labelledby="titulo-faq">
      <h2 id="titulo-faq" className="h3 mb-3">Preguntas frecuentes</h2>
      <div className="accordion" id="faq">
        {preguntas.map((p, i) => (
          <div className="accordion-item" key={p.id}>
            <h3 className="accordion-header">
              <button
                className={`accordion-button ${i === 0 ? '' : 'collapsed'}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#${p.id}`}
                aria-expanded={i === 0}
                aria-controls={p.id}
              >
                {p.pregunta}
              </button>
            </h3>
            <div id={p.id} className={`accordion-collapse collapse ${i === 0 ? 'show' : ''}`} data-bs-parent="#faq">
              <div className="accordion-body">{p.respuesta}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default PreguntasFrecuentes

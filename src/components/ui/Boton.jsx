import { Link } from 'react-router-dom'

// Boton reutilizable con variantes de Tailwind (definidas con @apply en index.css).
// Si recibe `to`, se dibuja como enlace de React Router con el mismo estilo.
const VARIANTES = {
  primario: 'btn-marca',
  secundario: 'btn-secundario',
  peligro: 'btn-peligro',
  paso: 'btn-paso',
}

function Boton({ variante = 'primario', to, className = '', type = 'button', ...resto }) {
  const clase = `${VARIANTES[variante]} ${className}`.trim()
  if (to) {
    return <Link to={to} className={clase} {...resto} />
  }
  return <button type={type} className={clase} {...resto} />
}

export default Boton

import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { formatearPrecio, normalizar, estadoStock } from '../utils/formato.js'

function Home() {
  const { productos, cargando, error, cambiarStock, reintentar } = useOutletContext()
  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('Todas')

  const categorias = ['Todas', ...new Set(productos.map((p) => p.categoria))]

  const visibles = productos.filter((p) => {
    const coincideTexto = normalizar(p.nombre).includes(normalizar(busqueda))
    const coincideCategoria = categoria === 'Todas' || p.categoria === categoria
    return coincideTexto && coincideCategoria
  })

  const totalUnidades = productos.reduce((acc, p) => acc + p.stock, 0)
  const stockBajo = productos.filter((p) => p.stock > 0 && p.stock <= 10).length
  const sinStock = productos.filter((p) => p.stock === 0).length

  return (
    <section aria-labelledby="titulo-inventario">
      <h2 id="titulo-inventario" className="h3 mb-3">Inventario</h2>

      {cargando && (
        <div className="text-center py-5" role="status">
          <div className="spinner-border text-success" aria-hidden="true"></div>
          <p className="mt-2 mb-0">Cargando inventario...</p>
        </div>
      )}

      {error && (
        <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
          <span>{error}</span>
          <button type="button" className="btn btn-outline-danger btn-sm" onClick={reintentar}>
            Reintentar
          </button>
        </div>
      )}

      {!cargando && !error && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <p className="text-body-secondary mb-1">Unidades en bodega</p>
                  <p className="display-6 mb-0">{totalUnidades}</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <p className="text-body-secondary mb-1">Stock bajo</p>
                  <p className="display-6 mb-0 text-warning-emphasis">{stockBajo}</p>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-4">
              <div className="card h-100 text-center">
                <div className="card-body">
                  <p className="text-body-secondary mb-1">Sin stock</p>
                  <p className="display-6 mb-0 text-danger">{sinStock}</p>
                </div>
              </div>
            </div>
          </div>

          <form className="row g-2 mb-3" onSubmit={(e) => e.preventDefault()} role="search">
            <div className="col-12 col-md-8">
              <label htmlFor="busqueda" className="form-label visually-hidden">Buscar producto</label>
              <input
                id="busqueda"
                type="search"
                className="form-control"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="col-12 col-md-4">
              <label htmlFor="categoria" className="form-label visually-hidden">Categoría</label>
              <select
                id="categoria"
                className="form-select"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                {categorias.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </form>

          <div className="table-responsive bg-white rounded border">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col">Producto</th>
                  <th scope="col" className="d-none d-md-table-cell">Categoría</th>
                  <th scope="col" className="text-end">Precio</th>
                  <th scope="col" className="text-center">Stock</th>
                  <th scope="col">Estado</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((p) => {
                  const estado = estadoStock(p.stock)
                  return (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td className="d-none d-md-table-cell">{p.categoria}</td>
                      <td className="text-end">{formatearPrecio(p.precio)}</td>
                      <td className="text-center text-nowrap">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          aria-label={`Restar una unidad de ${p.nombre}`}
                          onClick={() => cambiarStock(p.id, -1)}
                        >
                          -
                        </button>
                        <span className="mx-2">{p.stock}</span>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          aria-label={`Sumar una unidad de ${p.nombre}`}
                          onClick={() => cambiarStock(p.id, 1)}
                        >
                          +
                        </button>
                      </td>
                      <td><span className={`badge ${estado.clase}`}>{estado.etiqueta}</span></td>
                    </tr>
                  )
                })}
                {visibles.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">No hay productos que coincidan con la búsqueda.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  )
}

export default Home

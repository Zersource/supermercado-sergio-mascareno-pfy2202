// Pruebas unitarias del reducer, del filtro y de los calculos del carrito.
// Se ejecutan con: npm test   (usa el runner integrado de Node, sin dependencias)
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ACTIONS, estadoInicial, reductor } from '../src/context/inventarioReducer.js'
import { TODAS, filtrarPorCategoria, contarPorCategoria } from '../src/utils/filtros.js'
import { calcularLineas, totalUnidades, totalPrecio } from '../src/utils/carrito.js'

const datos = [
  { id: 1, nombre: 'Arroz', marca: 'A', tipo: 'Despensa', precio: 2000, stock: 10 },
  { id: 2, nombre: 'Leche', marca: 'B', tipo: 'Lácteos', precio: 1000, stock: 3 },
  { id: 3, nombre: 'Pera', marca: 'C', tipo: 'Frutas y verduras', precio: 3000, stock: 0 },
]
const cargado = () => reductor(estadoInicial, { type: ACTIONS.CARGA_EXITO, payload: structuredClone(datos) })
const stockDe = (estado, id) => estado.productos.find((p) => p.id === id).stock
const cantidadDe = (estado, id) => estado.carrito.find((l) => l.id === id)?.cantidad ?? 0
// Invariante: stock + unidades en carrito = stock original de cada articulo
const sumaTotal = (estado, id) => stockDe(estado, id) + cantidadDe(estado, id)

test('carga: deja el carrito vacio y el inventario cargado', () => {
  const e = cargado()
  assert.equal(e.productos.length, 3)
  assert.deepEqual(e.carrito, [])
  assert.equal(e.cargando, false)
})

test('agregar al carrito resta del inventario', () => {
  const e = reductor(cargado(), { type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id: 1, cantidad: 4 } })
  assert.equal(stockDe(e, 1), 6)
  assert.deepEqual(e.carrito, [{ id: 1, cantidad: 4 }])
})

test('agregar el mismo articulo dos veces suma en la misma linea', () => {
  let e = cargado()
  e = reductor(e, { type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id: 1, cantidad: 2 } })
  e = reductor(e, { type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id: 1, cantidad: 3 } })
  assert.equal(e.carrito.length, 1)
  assert.equal(cantidadDe(e, 1), 5)
  assert.equal(stockDe(e, 1), 5)
})

test('no se puede llevar mas que el stock ni agregar un articulo sin stock', () => {
  let e = reductor(cargado(), { type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id: 2, cantidad: 99 } })
  assert.equal(cantidadDe(e, 2), 3, 'se limita al stock disponible')
  assert.equal(stockDe(e, 2), 0)
  const antes = e
  e = reductor(e, { type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id: 2, cantidad: 1 } })
  assert.equal(e, antes, 'sin stock no cambia nada')
  e = reductor(e, { type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id: 3, cantidad: 1 } })
  assert.equal(cantidadDe(e, 3), 0)
})

test('cantidades invalidas (0, negativas, NaN) no cambian el estado', () => {
  const base = cargado()
  for (const cantidad of [0, -2, NaN, undefined]) {
    assert.equal(reductor(base, { type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id: 1, cantidad } }), base)
  }
})

test('carrito: aumentar y disminuir cantidad actualiza el inventario general', () => {
  let e = reductor(cargado(), { type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id: 1, cantidad: 2 } })
  e = reductor(e, { type: ACTIONS.CAMBIAR_CANTIDAD, payload: { id: 1, delta: 1 } })
  assert.equal(cantidadDe(e, 1), 3)
  assert.equal(stockDe(e, 1), 7)
  e = reductor(e, { type: ACTIONS.CAMBIAR_CANTIDAD, payload: { id: 1, delta: -1 } })
  e = reductor(e, { type: ACTIONS.CAMBIAR_CANTIDAD, payload: { id: 1, delta: -1 } })
  assert.equal(cantidadDe(e, 1), 1)
  assert.equal(stockDe(e, 1), 9)
})

test('carrito: no baja de 1 ni sube mas alla del stock', () => {
  let e = reductor(cargado(), { type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id: 2, cantidad: 1 } })
  e = reductor(e, { type: ACTIONS.CAMBIAR_CANTIDAD, payload: { id: 2, delta: -1 } })
  assert.equal(cantidadDe(e, 2), 1, 'se queda en 1')
  assert.equal(stockDe(e, 2), 2)
  e = reductor(e, { type: ACTIONS.CAMBIAR_CANTIDAD, payload: { id: 2, delta: 10 } })
  assert.equal(cantidadDe(e, 2), 3, 'sube solo hasta agotar el stock')
  assert.equal(stockDe(e, 2), 0)
  const antes = e
  assert.equal(reductor(e, { type: ACTIONS.CAMBIAR_CANTIDAD, payload: { id: 2, delta: 1 } }), antes)
})

test('quitar del carrito devuelve todas las unidades al inventario', () => {
  let e = reductor(cargado(), { type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id: 1, cantidad: 6 } })
  e = reductor(e, { type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id: 2, cantidad: 1 } })
  e = reductor(e, { type: ACTIONS.QUITAR_DEL_CARRITO, payload: { id: 1 } })
  assert.equal(stockDe(e, 1), 10)
  assert.deepEqual(e.carrito, [{ id: 2, cantidad: 1 }])
})

test('acciones sobre articulos que no existen o no estan en el carrito se ignoran', () => {
  const base = cargado()
  assert.equal(reductor(base, { type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id: 99, cantidad: 1 } }), base)
  assert.equal(reductor(base, { type: ACTIONS.CAMBIAR_CANTIDAD, payload: { id: 1, delta: 1 } }), base)
  assert.equal(reductor(base, { type: ACTIONS.QUITAR_DEL_CARRITO, payload: { id: 1 } }), base)
})

test('invariante: stock + carrito se mantiene constante en cualquier secuencia de acciones', () => {
  let e = cargado()
  const acciones = [
    [ACTIONS.AGREGAR_AL_CARRITO, { id: 1, cantidad: 3 }],
    [ACTIONS.AGREGAR_AL_CARRITO, { id: 2, cantidad: 2 }],
    [ACTIONS.CAMBIAR_CANTIDAD, { id: 1, delta: 5 }],
    [ACTIONS.CAMBIAR_CANTIDAD, { id: 2, delta: -4 }],
    [ACTIONS.CAMBIAR_CANTIDAD, { id: 1, delta: 50 }],
    [ACTIONS.QUITAR_DEL_CARRITO, { id: 2 }],
    [ACTIONS.AGREGAR_AL_CARRITO, { id: 2, cantidad: 7 }],
    [ACTIONS.CAMBIAR_CANTIDAD, { id: 1, delta: -3 }],
  ]
  for (const [type, payload] of acciones) {
    e = reductor(e, { type, payload })
    assert.equal(sumaTotal(e, 1), 10)
    assert.equal(sumaTotal(e, 2), 3)
    assert.ok(e.productos.every((p) => p.stock >= 0))
  }
})

test('el reducer no muta el estado anterior', () => {
  const antes = cargado()
  const copia = structuredClone(antes)
  reductor(antes, { type: ACTIONS.AGREGAR_AL_CARRITO, payload: { id: 1, cantidad: 2 } })
  assert.deepEqual(antes, copia)
})

test('agregar articulo nuevo sigue funcionando y recibe id correlativo', () => {
  const e = reductor(cargado(), {
    type: ACTIONS.AGREGAR_ARTICULO,
    payload: { nombre: 'Te', marca: 'D', tipo: 'Despensa', precio: 500, stock: 8 },
  })
  assert.equal(e.productos.at(-1).id, 4)
})

// ---- Filtro por categoria ----

test('filtro: devuelve solo la categoria elegida', () => {
  assert.deepEqual(filtrarPorCategoria(datos, 'Lácteos').map((p) => p.id), [2])
  assert.deepEqual(filtrarPorCategoria(datos, 'Bebidas'), [])
})

test('filtro: "Todas" devuelve todo el inventario', () => {
  assert.equal(filtrarPorCategoria(datos, TODAS).length, 3)
  assert.equal(filtrarPorCategoria(datos, undefined).length, 3)
})

test('filtro: no modifica ni pierde los datos originales', () => {
  const original = structuredClone(datos)
  const filtrados = filtrarPorCategoria(datos, 'Despensa')
  assert.deepEqual(datos, original)
  assert.notEqual(filtrados, datos)
  assert.equal(filtrarPorCategoria(datos, TODAS).length, datos.length)
  assert.notEqual(filtrarPorCategoria(datos, TODAS), datos, 'incluso sin filtro entrega una copia')
})

test('filtro: contarPorCategoria', () => {
  assert.deepEqual(contarPorCategoria(datos), { Despensa: 1, 'Lácteos': 1, 'Frutas y verduras': 1 })
})

// ---- Calculos del carrito ----

test('carrito: lineas, unidades y total', () => {
  const carrito = [{ id: 1, cantidad: 2 }, { id: 2, cantidad: 3 }, { id: 99, cantidad: 5 }]
  const lineas = calcularLineas(datos, carrito)
  assert.equal(lineas.length, 2, 'ignora articulos inexistentes')
  assert.equal(lineas[0].subtotal, 4000)
  assert.equal(totalUnidades(lineas), 5)
  assert.equal(totalPrecio(lineas), 4000 + 3000)
})

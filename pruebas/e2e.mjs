// Pruebas de extremo a extremo (navegador real con Playwright).
// Uso: npm run build && npm run test:e2e
let chromium
try { ({ chromium } = await import('playwright')) } catch {
  const { createRequire } = await import('node:module')
  const { execSync } = await import('node:child_process')
  ;({ chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright'))
}
import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'

const srv = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 2500))

let ok = 0, fail = 0
const check = (cond, msg) => { cond ? ok++ : fail++; console.log((cond ? 'OK   ' : 'FALLA') + ' ' + msg) }

const NAV_SUP = 'nav[aria-label="Menú de artículos"]'
const NAV_INF = 'nav[aria-label="Menú inferior"]'
const num = (txt) => Number(String(txt).replace(/[^\d-]/g, ''))

const browser = await chromium.launch()
const base = 'http://localhost:4173/'
const volcarHtml = process.env.VOLCAR_HTML // carpeta donde guardar el HTML renderizado (para vnu.jar)
if (volcarHtml) mkdirSync(volcarHtml, { recursive: true })

for (const [nombre, w, h] of [['360', 360, 780], ['390', 390, 844], ['768', 768, 1024], ['desktop', 1366, 800]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  const errores = []
  const pedidos = []
  page.on('pageerror', (e) => errores.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()))
  page.on('request', (r) => pedidos.push(r.url()))
  const filas = () => page.locator('tbody tr')
  const stockEnListado = async (id) =>
    num(await page.locator('tbody tr', { has: page.locator(`a[href$="/articulos/${id}"]`) }).locator('td').last().innerText())

  await page.goto(base)
  await page.waitForSelector('table')

  if (nombre === '390') {
    // ---- Tailwind aplicado
    const fondo = await page.evaluate(() => getComputedStyle(document.querySelector('header')).backgroundColor)
    check(fondo === 'rgb(200, 32, 31)', 'Tailwind aplica el color de marca en el encabezado (' + fondo + ')')

    // ---- Lazy loading: el codigo de cada pagina se descarga al visitarla
    check(!pedidos.some((u) => /\/Carrito-/.test(u)), 'Lazy loading: Carrito no se descarga al abrir el inicio')
    check(!pedidos.some((u) => /\/DetalleArticulo-/.test(u)), 'Lazy loading: DetalleArticulo no se descarga al abrir el inicio')

    // ---- Home (S1)
    check((await filas().count()) === 14, 'Home carga 14 productos')
    await page.fill('#busqueda', 'LECHE')
    check((await filas().count()) === 1, 'Busqueda filtra')
    await page.fill('#busqueda', '')
    await page.selectOption('#tipo', 'Lácteos')
    check((await filas().count()) === 3, 'Filtro por tipo de producto del inicio')
    await page.selectOption('#tipo', 'Todos')
    await page.getByLabel('Sumar una unidad de Arroz integral 1 kg').click()
    check((await filas().first().locator('span.stock').innerText()) === '96', 'Boton + suma stock (inicio)')

    // ---- Menu superior (S2 + carrito)
    check((await page.locator(NAV_SUP + ' a').count()) === 3, 'Menu superior tiene 3 enlaces')
    check((await page.locator('.insignia-carrito').innerText()) === '0', 'Insignia del carrito parte en 0')

    // ---- Carrito vacio
    await page.click(NAV_SUP + ' >> text=Carrito')
    check(page.url().endsWith('#/carrito'), 'Menu superior navega al carrito')
    await page.getByText('Tu carrito está vacío.').waitFor()
    check(await page.getByText('Tu carrito está vacío.').isVisible(), 'Carrito vacio muestra mensaje')
    check(pedidos.some((u) => /\/Carrito-/.test(u)), 'Lazy loading: Carrito se descarga al visitarlo')

    // ---- Listado (S2) + filtro por categoria (S3)
    await page.click(NAV_SUP + ' >> text=Listado de artículos')
    check(page.url().endsWith('#/articulos'), 'Menu superior navega al listado sin recargar')
    await page.waitForSelector('table')
    check((await filas().count()) === 14, 'Listado muestra 14 articulos')
    const cab = (await page.locator('thead th').allInnerTexts()).join('|')
    check(/Nombre/.test(cab) && /Marca/.test(cab) && /Tipo de producto/.test(cab), 'Listado muestra nombre, marca y tipo (' + cab + ')')
    check((await page.locator('tbody tr').first().locator('td').nth(2).innerText()) === 'Tucapel', 'Marca cargada desde el JSON')
    check((await stockEnListado(1)) === 96, 'Stock modificado en el inicio llega al listado (estado global)')
    check((await page.locator('#total-articulos').innerText()).includes('Mostrando 14 de 14'), 'Contador inicial: Mostrando 14 de 14')

    const opciones = await page.locator('#categoria option').allInnerTexts()
    check(opciones.length === 8 && opciones[0].startsWith('Todas las categorías (14)'), 'Selector de categoria: Todas + 7 categorias (' + opciones.length + ')')

    await page.selectOption('#categoria', 'Lácteos')
    check((await filas().count()) === 3, 'Filtro Lacteos muestra 3 articulos')
    const tiposVisibles = [...new Set(await filas().locator('td:nth-child(4)').allInnerTexts())]
    check(tiposVisibles.length === 1 && tiposVisibles[0] === 'Lácteos', 'Todas las filas son de la categoria Lacteos')
    check((await page.locator('#total-articulos').innerText()).includes('Mostrando 3 de 14'), 'Contador: Mostrando 3 de 14')
    check(page.url().includes('categoria='), 'La categoria queda en la URL')
    await page.selectOption('#categoria', 'Despensa')
    check((await filas().count()) === 4, 'Cambiar de categoria actualiza la tabla (Despensa = 4)')
    await page.selectOption('#categoria', 'Panadería')
    check((await filas().count()) === 1 && (await filas().first().innerText()).includes('No hay artículos en esta categoría'), 'Categoria sin articulos muestra aviso')
    await page.selectOption('#categoria', 'Todas')
    check((await filas().count()) === 14, 'Volver a "Todas" recupera los 14 articulos (datos originales intactos)')
    check((await stockEnListado(1)) === 96, 'El filtro no altera los datos (stock sigue en 96)')

    // Quitar filtro
    await page.selectOption('#categoria', 'Limpieza')
    await page.click('text=Quitar filtro')
    check((await filas().count()) === 14, 'Boton "Quitar filtro" restaura la lista')

    // Categoria invalida en la URL se ignora
    await page.goto(base + '#/articulos?categoria=Inventada')
    check((await filas().count()) === 14, 'Categoria invalida en la URL se ignora')

    // ---- Detalle: clic en la fila, filtro persistente al volver
    await page.selectOption('#categoria', 'Lácteos')
    await filas().nth(0).locator('td').nth(2).click() // clic en la celda Marca (no en el enlace)
    check(/#\/articulos\/4$/.test(page.url()), 'Clic en la fila abre el detalle (#/articulos/4)')
    check((await page.locator('#titulo-detalle').innerText()) === 'Leche vegetal 1 L', 'Detalle muestra el nombre del articulo')
    const detalleTxt = await page.locator('article').innerText()
    check(detalleTxt.includes('Mi Mercado') && detalleTxt.toLowerCase().includes('lácteos') && detalleTxt.includes('$2.000') && detalleTxt.includes('48'), 'Detalle muestra marca, tipo, precio y stock (' + detalleTxt.replace(/\s+/g, ' ') + ')')
    await page.click('text=← Volver al listado')
    check(page.url().includes('categoria=') && (await filas().count()) === 3, 'Volver al listado mantiene el filtro de categoria')
    await page.click('tbody a >> nth=1') // clic en el enlace del nombre
    check(/#\/articulos\/5$/.test(page.url()), 'Clic en el nombre abre el detalle (#/articulos/5)')
    await page.goBack()
    check((await filas().count()) === 3, 'Boton Atras del navegador vuelve al listado filtrado (sin navegar dos veces)')

    // ---- Detalle inexistente y sin stock
    await page.goto(base + '#/articulos/999')
    check((await page.locator('#titulo-detalle').innerText()) === 'Artículo no encontrado', 'Detalle de articulo inexistente muestra aviso')
    await page.goto(base + '#/articulos/abc')
    check((await page.locator('#titulo-detalle').innerText()) === 'Artículo no encontrado', 'Detalle con id no numerico muestra aviso')
    await page.goto(base + '#/articulos/8') // Pera, stock 0
    check((await page.locator('#titulo-detalle').innerText()) === 'Pera kg' && (await page.getByRole('button', { name: 'Agregar al carrito' }).count()) === 0, 'Articulo sin stock no ofrece agregar al carrito')
    check((await page.locator('article').innerText()).includes('Sin stock'), 'Articulo sin stock lo indica')

    // ---- Agregar al carrito resta del inventario
    await page.goto(base + '#/articulos/1') // Arroz, stock 96
    const antes = num(await page.locator('.stock-detalle').innerText())
    await page.getByRole('button', { name: /Aumentar cantidad/ }).click()
    await page.getByRole('button', { name: /Aumentar cantidad/ }).click()
    check((await page.locator('.cantidad').innerText()) === '3', 'Selector de cantidad sube a 3')
    await page.getByRole('button', { name: 'Agregar al carrito' }).click()
    check(num(await page.locator('.stock-detalle').innerText()) === antes - 3, `Agregar 3 al carrito resta del inventario (${antes} -> ${antes - 3})`)
    check((await page.locator('.en-carrito').innerText()).startsWith('3 unidades'), 'Detalle muestra "En tu carrito: 3 unidades"')
    check((await page.locator('[role=status]').innerText()).includes('Agregaste 3'), 'Confirmacion al agregar')
    check((await page.locator('.cantidad').innerText()) === '1', 'Selector vuelve a 1 despues de agregar')
    check((await page.locator('.insignia-carrito').innerText()) === '3', 'Insignia del menu muestra 3 unidades')

    // Cantidad maxima = stock (Aceite: 6)
    await page.goto(base + '#/articulos/3')
    for (let i = 0; i < 10; i++) {
      if (await page.getByRole('button', { name: /Aumentar cantidad/ }).isEnabled()) await page.getByRole('button', { name: /Aumentar cantidad/ }).click()
    }
    check((await page.locator('.cantidad').innerText()) === '6' && (await page.getByRole('button', { name: /Aumentar cantidad/ }).isDisabled()), 'No se puede elegir mas que el stock disponible (6)')
    check(await page.getByRole('button', { name: /Disminuir cantidad/ }).isEnabled(), 'Boton - habilitado sobre 1')
    for (let i = 0; i < 10; i++) {
      if (await page.getByRole('button', { name: /Disminuir cantidad/ }).isEnabled()) await page.getByRole('button', { name: /Disminuir cantidad/ }).click()
    }
    check((await page.locator('.cantidad').innerText()) === '1', 'La cantidad no baja de 1')
    await page.getByRole('button', { name: /Aumentar cantidad/ }).click()
    await page.getByRole('button', { name: 'Agregar al carrito' }).click() // 2 de Aceite
    check(num(await page.locator('.stock-detalle').innerText()) === 4, 'Aceite: stock 6 -> 4 tras agregar 2')

    // Agotar un articulo (Yogurt, stock 9) desde el detalle
    await page.goto(base + '#/articulos/5')
    for (let i = 0; i < 12; i++) {
      if (await page.getByRole('button', { name: /Aumentar cantidad/ }).isEnabled()) await page.getByRole('button', { name: /Aumentar cantidad/ }).click()
    }
    await page.getByRole('button', { name: 'Agregar al carrito' }).click()
    check((await page.locator('.stock-detalle').innerText()) === '0' && (await page.getByRole('button', { name: 'Agregar al carrito' }).count()) === 0, 'Al llevarse todo el stock, el detalle pasa a "Sin stock"')

    // ---- Pantalla del carrito
    await page.click(NAV_SUP + ' >> text=Carrito')
    check((await page.locator('.linea-carrito').count()) === 3, 'Carrito lista los 3 articulos agregados')
    const cantidades = await page.locator('.linea-carrito .cantidad').allInnerTexts()
    check(cantidades.join(',') === '3,2,9', 'Cantidades en el carrito: 3, 2 y 9 (' + cantidades + ')')
    const subs = (await page.locator('.subtotal').allInnerTexts()).map(num)
    check(subs.join(',') === `${3 * 2000},${2 * 3000},${9 * 500}`, 'Subtotales correctos (' + subs + ')')
    const total = subs.reduce((a, b) => a + b, 0)
    check((await page.locator('.total-pagar').innerText()).replace(/\D/g, '') === String(total), 'Total a pagar correcto ($' + total + ')')
    check((await page.locator('.insignia-carrito').innerText()) === '14', 'Insignia del menu muestra 14 unidades')

    // Aumentar desde el carrito resta del inventario
    const filaArroz = page.locator('.linea-carrito', { hasText: 'Arroz integral' })
    await filaArroz.getByRole('button', { name: /Aumentar cantidad/ }).click()
    check((await filaArroz.locator('.cantidad').innerText()) === '4', 'Carrito: + sube la cantidad de Arroz a 4')
    check((await filaArroz.innerText()).includes('quedan 92'), 'Carrito: el inventario de Arroz baja a 92 (96-3-1)')
    // Disminuir devuelve al inventario
    await filaArroz.getByRole('button', { name: /Disminuir cantidad/ }).click()
    await filaArroz.getByRole('button', { name: /Disminuir cantidad/ }).click()
    check((await filaArroz.locator('.cantidad').innerText()) === '2' && (await filaArroz.innerText()).includes('quedan 94'), 'Carrito: - baja a 2 y el inventario sube a 94')
    // No baja de 1
    await filaArroz.getByRole('button', { name: /Disminuir cantidad/ }).click()
    check((await filaArroz.getByRole('button', { name: /Disminuir cantidad/ }).isDisabled()) && (await filaArroz.locator('.cantidad').innerText()) === '1', 'Carrito: la cantidad no baja de 1')
    // Articulo agotado: + deshabilitado
    const filaYogurt = page.locator('.linea-carrito', { hasText: 'Yogurt' })
    check(await filaYogurt.getByRole('button', { name: /Aumentar cantidad/ }).isDisabled(), 'Carrito: + deshabilitado cuando no queda stock (Yogurt)')
    // Inventario general actualizado en el listado
    await page.click(NAV_SUP + ' >> text=Listado de artículos')
    await page.waitForSelector('table')
    check((await stockEnListado(1)) === 95 && (await stockEnListado(3)) === 4 && (await stockEnListado(5)) === 0, 'Listado refleja el inventario con el carrito (Arroz 95, Aceite 4, Yogurt 0)')
    // ...y en el inicio
    await page.click(NAV_INF + ' >> text=Inicio')
    await page.waitForSelector('table')
    check((await filas().first().locator('span.stock').innerText()) === '95', 'Inicio tambien muestra el stock con el carrito (Arroz 95)')

    // Quitar devuelve todo
    await page.click(NAV_SUP + ' >> text=Carrito')
    await page.locator('.linea-carrito', { hasText: 'Yogurt' }).getByRole('button', { name: /Quitar/ }).click()
    check((await page.locator('.linea-carrito').count()) === 2, 'Quitar elimina la linea del carrito')
    await page.click(NAV_SUP + ' >> text=Listado de artículos')
    check((await stockEnListado(5)) === 9, 'Quitar devuelve las 9 unidades al inventario (Yogurt 9)')
    await page.click(NAV_SUP + ' >> text=Carrito')
    await page.locator('.linea-carrito', { hasText: 'Aceite' }).getByRole('button', { name: /Quitar/ }).click()
    await page.locator('.linea-carrito', { hasText: 'Arroz' }).getByRole('button', { name: /Quitar/ }).click()
    check(await page.getByText('Tu carrito está vacío.').isVisible() && (await page.locator('.insignia-carrito').innerText()) === '0', 'Carrito vuelve a vacio e insignia en 0')
    await page.click(NAV_SUP + ' >> text=Listado de artículos')
    check((await stockEnListado(1)) === 96 && (await stockEnListado(3)) === 6, 'Con el carrito vacio el inventario vuelve a sus valores (Arroz 96, Aceite 6)')

    // ---- Formulario de ingreso (S2)
    await page.click(NAV_SUP + ' >> text=Agregar artículo')
    check(page.url().endsWith('#/agregar-articulo'), 'Menu superior navega al formulario')
    check((await page.locator(NAV_SUP + ' a[aria-current=page]').innerText()).includes('Agregar artículo'), 'NavLink marca la ruta activa en el menu superior')
    await page.click('button[type=submit]')
    check((await page.locator('[aria-invalid=true]').count()) === 5, 'Formulario vacio muestra 5 errores')
    await page.fill('#nombre', 'Arroz integral 1 kg'); await page.fill('#marca', 'tucapel')
    await page.selectOption('#tipo-producto', 'Despensa'); await page.fill('#precio', '2000'); await page.fill('#stock', '5')
    await page.click('button[type=submit]')
    check((await page.locator('#error-nombre').innerText()).includes('Ya existe'), 'Rechaza articulo repetido (nombre + marca)')
    await page.fill('#nombre', 'Galletas de avena 200 g'); await page.fill('#marca', 'Mi Mercado')
    await page.fill('#precio', '-5')
    await page.click('button[type=submit]')
    check((await page.locator('#error-precio').innerText()).length > 0, 'Rechaza precio negativo')
    await page.fill('#precio', '1500')
    await page.click('button[type=submit]')
    check((await page.locator('[role=status]').innerText()).includes('Galletas de avena 200 g'), 'Articulo valido se agrega y muestra confirmacion')
    check((await page.inputValue('#nombre')) === '', 'Formulario se limpia tras agregar')

    // ---- El articulo nuevo aparece en todas partes, tambien en filtro y detalle
    await page.click('text=Ver listado')
    await page.waitForSelector('table')
    check((await filas().count()) === 15, 'Listado ahora tiene 15 articulos')
    await page.selectOption('#categoria', 'Despensa')
    check((await filas().count()) === 5, 'El articulo nuevo entra al filtro de su categoria (Despensa = 5)')
    await filas().last().locator('td').nth(2).click()
    check((await page.locator('#titulo-detalle').innerText()) === 'Galletas de avena 200 g', 'El articulo nuevo tiene detalle (id 15)')
    await page.getByRole('button', { name: 'Agregar al carrito' }).click()
    check(num(await page.locator('.stock-detalle').innerText()) === 4, 'El articulo nuevo se puede agregar al carrito (5 -> 4)')
    await page.click(NAV_INF + ' >> text=Inicio')
    await page.waitForSelector('table')
    check((await filas().count()) === 15, 'Inicio tambien muestra 15 productos')
    await page.fill('#busqueda', 'galletas')
    check((await filas().count()) === 1, 'Busqueda encuentra el articulo nuevo')
    await page.fill('#busqueda', '')

    // ---- Menu inferior, FAQ, contacto, 404 (S1)
    await page.click(NAV_INF + ' >> text=Preguntas frecuentes')
    check(page.url().endsWith('#/preguntas-frecuentes'), 'Navega a FAQ sin recargar')
    check((await page.locator(NAV_INF + ' a[aria-current=page]').innerText()).includes('Preguntas'), 'NavLink marca ruta activa en menu inferior')
    await page.waitForSelector('.acordeon-boton')
    check((await page.locator('.acordeon-boton[aria-expanded=true]').count()) === 1, 'FAQ parte con una respuesta abierta')
    await page.locator('.acordeon-boton[aria-expanded=false]').first().click()
    check((await page.locator('.acordeon-boton[aria-expanded=true]').count()) === 1 && (await page.locator('[role=region]:visible').count()) === 1, 'Acordeon abre una respuesta y cierra la otra')
    await page.click(NAV_INF + ' >> text=/Cont.ctanos/')
    check(page.url().endsWith('#/contactanos'), 'Navega a Contactanos')
    await page.click('button[type=submit]')
    check((await page.locator('[aria-invalid=true]').count()) === 3, 'Contacto: validacion muestra 3 errores')
    await page.fill('#nombre', 'Sergio'); await page.fill('#email', 'sergio@correo.cl'); await page.fill('#mensaje', 'Hola, esto es una prueba.')
    await page.click('button[type=submit]')
    check((await page.locator('[role=status]').count()) === 1, 'Contacto: formulario valido se envia')
    await page.goto(base + '#/ruta-que-no-existe')
    await page.waitForSelector('main h2')
    check((await page.locator('#titulo-404').count()) === 1, 'Ruta invalida muestra 404')
    await page.goto(base + '#/articulos/1/otra-cosa')
    await page.waitForSelector('main h2')
    check((await page.locator('#titulo-404').count()) === 1, 'Subruta invalida de articulos muestra 404')
    await page.goto(base + '#/carrito')
    await page.reload()
    await page.waitForSelector('main h2')
    check((await page.locator('#titulo-carrito').count()) === 1, 'Recarga en #/carrito funciona (HashRouter)')
    await page.goto(base + '#/articulos/2')
    await page.reload()
    check((await page.locator('#titulo-detalle').innerText()) === 'Fideos tallarín 400 g', 'Recarga directa en un detalle carga el inventario y lo muestra')
  }

  // ---- Diseno responsive en todas las pantallas, en todos los anchos
  // Ojo: ir a base + '' (sin #) recarga la pagina y borra el estado, por eso el
  // inicio se revisa primero y recien despues se llena el carrito.
  await page.goto(base)
  await page.reload()
  await page.waitForSelector('table')
  const rutas = ['', '#/articulos', '#/articulos?categoria=L%C3%A1cteos', '#/articulos/1', '#/articulos/8', '#/articulos/999', '#/carrito', '#/agregar-articulo', '#/preguntas-frecuentes', '#/contactanos']
  const llenarCarrito = async () => {
    await page.goto(base + '#/articulos/1')
    await page.getByRole('button', { name: 'Agregar al carrito' }).click()
    await page.goto(base + '#/articulos/6')
    await page.getByRole('button', { name: /Aumentar cantidad/ }).click()
    await page.getByRole('button', { name: 'Agregar al carrito' }).click()
    await page.goto(base + '#/articulos/3')
    await page.getByRole('button', { name: 'Agregar al carrito' }).click()
  }
  for (const ruta of rutas) {
    if (ruta === '#/articulos') await llenarCarrito() // el inicio ('') ya se reviso: desde aqui hay articulos en el carrito
    await page.goto(base + ruta)
    await page.waitForSelector('main h2')
    const hayDesborde = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
    check(!hayDesborde, `Sin scroll horizontal en ${nombre} (${ruta || '#/'})`)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    const tapa = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Menú inferior"]').getBoundingClientRect()
      const main = document.querySelector('main').getBoundingClientRect()
      return main.bottom > nav.top + 1
    })
    check(!tapa, `Menu inferior no tapa contenido en ${nombre} (${ruta || '#/'})`)
    if (volcarHtml && nombre === '390') {
      const html = '<!DOCTYPE html>\n' + (await page.evaluate(() => document.documentElement.outerHTML))
      writeFileSync(`${volcarHtml}/${(ruta || 'inicio').replace(/[^\w]+/g, '_')}.html`, html)
    }
  }
  // El menu superior cabe en el ancho (3 enlaces + insignia)
  const menuCabe = await page.evaluate(() => {
    const nav = document.querySelector('nav[aria-label="Menú de artículos"] ul')
    return nav.scrollWidth <= nav.clientWidth
  })
  check(menuCabe, `Menu superior cabe en ${nombre}`)
  check(errores.length === 0, `Sin errores de consola en ${nombre} ${errores.join('|')}`)

  mkdirSync('pruebas', { recursive: true })
  for (const [archivo, ruta] of [['listado', '#/articulos?categoria=L%C3%A1cteos'], ['detalle', '#/articulos/1'], ['carrito', '#/carrito'], ['agregar', '#/agregar-articulo']]) {
    await page.goto(base + ruta)
    await page.waitForSelector('main h2')
    await page.screenshot({ path: `pruebas/captura-${archivo}-${nombre}.png`, fullPage: false })
  }
  await page.close()
}
await browser.close()
srv.kill()
console.log(`\n${ok} OK, ${fail} fallas`)
process.exit(fail ? 1 : 0)

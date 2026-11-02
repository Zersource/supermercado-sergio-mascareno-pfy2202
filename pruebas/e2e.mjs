let chromium
try { ({ chromium } = await import('playwright')) } catch {
  const { createRequire } = await import('node:module')
  const { execSync } = await import('node:child_process')
  ;({ chromium } = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright'))
}
import { spawn } from 'node:child_process'

const srv = spawn('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 2500))

let ok = 0, fail = 0
const check = (cond, msg) => { cond ? ok++ : fail++; console.log((cond ? 'OK   ' : 'FALLA') + ' ' + msg) }

const NAV_SUP = 'nav[aria-label="Menú de artículos"]'
const NAV_INF = 'nav[aria-label="Menú inferior"]'

const browser = await chromium.launch()
const base = 'http://localhost:4173/'
for (const [nombre, w, h] of [['390', 390, 844], ['768', 768, 1024], ['desktop', 1366, 800]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } })
  const errores = []
  page.on('pageerror', (e) => errores.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errores.push(m.text()))
  await page.goto(base)
  await page.waitForSelector('table')
  if (nombre === '390') {
    // ---- Tailwind aplicado
    const fondo = await page.evaluate(() => getComputedStyle(document.querySelector('header')).backgroundColor)
    check(fondo === 'rgb(200, 32, 31)', 'Tailwind aplica el color de marca en el encabezado (' + fondo + ')')

    // ---- Home (S1)
    check((await page.locator('tbody tr').count()) === 14, 'Home carga 14 productos')
    await page.fill('#busqueda', 'LECHE')
    check((await page.locator('tbody tr').count()) === 1, 'Busqueda filtra')
    await page.fill('#busqueda', '')
    await page.selectOption('#tipo', 'Lácteos')
    check((await page.locator('tbody tr').count()) === 3, 'Filtro por tipo de producto')
    await page.selectOption('#tipo', 'Todos')
    await page.getByLabel('Sumar una unidad de Arroz integral 1 kg').click()
    check((await page.locator('tbody tr').first().locator('span.stock').innerText()) === '96', 'Boton + suma stock')

    // ---- Menu superior nuevo y estado global
    check((await page.locator(NAV_SUP + ' a').count()) === 2, 'Menu superior tiene 2 enlaces')
    await page.click(NAV_SUP + ' >> text=Listado de artículos')
    check(page.url().endsWith('#/articulos'), 'Menu superior navega al listado sin recargar')
    await page.waitForSelector('table')
    check((await page.locator('tbody tr').count()) === 14, 'Listado muestra 14 articulos')
    const cab = (await page.locator('thead th').allInnerTexts()).join('|')
    check(/Nombre/.test(cab) && /Marca/.test(cab) && /Tipo de producto/.test(cab), 'Listado muestra nombre, marca y tipo (' + cab + ')')
    check((await page.locator('tbody tr').first().locator('td').nth(2).innerText()) === 'Tucapel', 'Marca cargada desde el JSON')
    check((await page.locator('tbody tr').first().locator('td').last().innerText()) === '96', 'Stock modificado en Home llega al Listado (estado global)')

    // ---- Formulario de ingreso
    await page.click(NAV_SUP + ' >> text=Agregar artículo')
    check(page.url().endsWith('#/agregar-articulo'), 'Menu superior navega al formulario')
    check((await page.locator(NAV_SUP + ' a[aria-current=page]').innerText()) === 'Agregar artículo', 'NavLink marca la ruta activa en el menu superior')
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

    // ---- El articulo nuevo aparece en todas partes
    await page.click('text=Ver listado')
    await page.waitForSelector('table')
    check((await page.locator('tbody tr').count()) === 15, 'Listado ahora tiene 15 articulos')
    const ultima = (await page.locator('tbody tr').last().locator('td').allInnerTexts()).join('|')
    check(ultima.includes('Galletas de avena 200 g') && ultima.includes('Mi Mercado') && ultima.includes('Despensa'), 'Ultima fila es el articulo nuevo (' + ultima + ')')
    await page.click(NAV_INF + ' >> text=Inicio')
    await page.waitForSelector('table')
    check((await page.locator('tbody tr').count()) === 15, 'Home tambien muestra 15 productos')
    await page.fill('#busqueda', 'galletas')
    check((await page.locator('tbody tr').count()) === 1, 'Busqueda encuentra el articulo nuevo')
    await page.fill('#busqueda', '')

    // ---- Menu inferior, FAQ, contacto, 404 (S1)
    await page.click(NAV_INF + ' >> text=Preguntas frecuentes')
    check(page.url().endsWith('#/preguntas-frecuentes'), 'Navega a FAQ sin recargar')
    check((await page.locator(NAV_INF + ' a[aria-current=page]').innerText()).includes('Preguntas'), 'NavLink marca ruta activa en menu inferior')
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
    check((await page.locator('#titulo-404').count()) === 1, 'Ruta invalida muestra 404')
    await page.goto(base + '#/agregar-articulo')
    await page.reload()
    check((await page.locator('#titulo-agregar').count()) === 1, 'Recarga en subruta funciona (HashRouter)')
  }
  await page.goto(base)
  await page.waitForSelector('table')
  for (const ruta of ['', '#/articulos', '#/agregar-articulo', '#/preguntas-frecuentes', '#/contactanos']) {
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
  }
  check(errores.length === 0, `Sin errores de consola en ${nombre} ${errores.join('|')}`)
  await page.goto(base + '#/agregar-articulo')
  await page.screenshot({ path: `pruebas/captura-agregar-${nombre}.png`, fullPage: false })
  await page.goto(base + '#/articulos')
  await page.waitForSelector('table')
  await page.screenshot({ path: `pruebas/captura-listado-${nombre}.png`, fullPage: false })
  await page.close()
}
await browser.close()
srv.kill()
console.log(`\n${ok} OK, ${fail} fallas`)
process.exit(fail ? 1 : 0)

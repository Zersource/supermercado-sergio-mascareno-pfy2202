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
    check((await page.locator('tbody tr').count()) === 14, 'Home carga 14 productos')
    await page.fill('#busqueda', 'LECHE')
    check((await page.locator('tbody tr').count()) === 1, 'Busqueda filtra')
    await page.fill('#busqueda', '')
    await page.selectOption('#categoria', 'L\u00e1cteos')
    check((await page.locator('tbody tr').count()) === 3, 'Filtro por categoria')
    await page.selectOption('#categoria', 'Todas')
    const antes = await page.locator('tbody tr').first().locator('td').nth(2).innerText()
    await page.getByLabel('Sumar una unidad de Arroz integral 1 kg').click()
    const despues = await page.locator('tbody tr').first().locator('span.mx-2').innerText()
    check(despues === '96', 'Boton + suma stock (95 -> ' + despues + ')')
    await page.click('text=Preguntas frecuentes')
    await page.click('nav >> text=Inicio')
    await page.waitForSelector('table')
    check((await page.locator('tbody tr').first().locator('span.mx-2').innerText()) === '96', 'Stock se conserva al volver de otra ruta')
    await page.click('text=Preguntas frecuentes')
    check(page.url().endsWith('#/preguntas-frecuentes'), 'Navega a FAQ sin recargar')
    check((await page.locator('nav a.activo').innerText()).includes('Preguntas'), 'NavLink marca ruta activa')
    await page.click('.accordion-button.collapsed >> nth=0')
    await page.waitForTimeout(500)
    check((await page.locator('.accordion-collapse.show').count()) === 1, 'Acordeon abre una respuesta')
    await page.click('nav >> text=/Cont.ctanos/')
    check(page.url().endsWith('#/contactanos'), 'Navega a Contactanos')
    await page.click('button[type=submit]')
    check((await page.locator('.is-invalid').count()) === 3, 'Validacion muestra 3 errores')
    await page.fill('#nombre', 'Sergio'); await page.fill('#email', 'sergio@correo.cl'); await page.fill('#mensaje', 'Hola, esto es una prueba.')
    await page.click('button[type=submit]')
    check((await page.locator('.alert-success').count()) === 1, 'Formulario valido se envia')
    await page.goto(base + '#/ruta-que-no-existe')
    check((await page.locator('#titulo-404').count()) === 1, 'Ruta invalida muestra 404')
    await page.goto(base + '#/contactanos')
    await page.reload()
    check((await page.locator('#titulo-contacto').count()) === 1, 'Recarga en subruta funciona (HashRouter)')
  }
  await page.goto(base)
  await page.waitForSelector('table')
  const hayDesborde = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  check(!hayDesborde, `Sin scroll horizontal en ${nombre}`)
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  const tapa = await page.evaluate(() => {
    const nav = document.querySelector('nav.menu-inferior').getBoundingClientRect()
    const ult = document.querySelector('main').getBoundingClientRect()
    return ult.bottom > nav.top + 1
  })
  check(!tapa, `Menu inferior no tapa contenido en ${nombre}`)
  check(errores.length === 0, `Sin errores de consola en ${nombre} ${errores.join('|')}`)
  await page.screenshot({ path: `pruebas/captura-${nombre}.png`, fullPage: false })
  await page.close()
}
await browser.close()
srv.kill()
console.log(`\n${ok} OK, ${fail} fallas`)
process.exit(fail ? 1 : 0)

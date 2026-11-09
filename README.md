# Mi Mercado - Gestión de inventario

Actividad sumativa S3 - "Desarrollando sitios web con React avanzado", Desarrollo Frontend II (PFY2202), Duoc UC.
Autor: Sergio Mascareno.

## Enlaces

- Repositorio: https://github.com/Zersource/supermercado-sergio-mascareno-pfy2202
- Sitio publicado (rama `gh-pages`): https://zersource.github.io/supermercado-sergio-mascareno-pfy2202/

## Descripción

Sitio de gestión de inventario de un supermercado, hecho con React 19, Vite, React Router 6 y Tailwind CSS 3.
Continúa la actividad formativa 2 (menú superior, formulario para agregar artículos y listado en tabla) y suma
tres funcionalidades:

1. **Filtro por categoría** en el listado de artículos.
2. **Detalle de artículo** al hacer clic en uno de la lista, con opción de agregarlo al carrito.
3. **Carrito de compras**: lista lo agregado y permite subir o bajar la cantidad de cada artículo.

Lo que se agrega al carrito se **descuenta del inventario**, y al bajar la cantidad o quitar el artículo las unidades
**vuelven al inventario**.

## Requerimientos de la actividad

| Requerimiento | Dónde está |
|---|---|
| Continuar el sitio de la actividad formativa 2 | Mismo proyecto: inicio, menús, agregar artículo, listado, preguntas frecuentes y contacto se mantienen |
| Filtrar el listado por categoría, sin perder los datos originales | `src/pages/ListadoArticulos.jsx` + `src/utils/filtros.js` |
| Detalle del artículo al hacer clic en la lista | `src/pages/DetalleArticulo.jsx` (ruta `/articulos/:id`) |
| Agregar al carrito restando la cantidad del inventario | Acción `AGREGAR_AL_CARRITO` en `src/context/inventarioReducer.js` |
| Pantalla de carrito con aumentar y disminuir cantidad, actualizando el inventario | `src/pages/Carrito.jsx` + acciones `CAMBIAR_CANTIDAD` y `QUITAR_DEL_CARRITO` |
| Framework de CSS | Tailwind CSS 3: `tailwind.config.js`, `postcss.config.js`, `src/index.css` y clases de utilidad en los componentes |
| Repositorio `supermercado-nombre-apellido-siglaCurso` en GitHub | `supermercado-sergio-mascareno-pfy2202`, con build publicado en `gh-pages` |

## Cómo funciona cada parte

### Filtro por categoría

- El selector **Categoría** del listado muestra "Todas las categorías" y las 7 categorías, cada una con su cantidad de artículos.
- `filtrarPorCategoria(productos, categoria)` (en `src/utils/filtros.js`) es una función pura: devuelve una lista **nueva** y nunca
  modifica el inventario. La lista que se ve es un valor calculado a partir del inventario completo en cada render, por eso
  volver a "Todas" recupera todos los artículos con sus datos intactos.
- La categoría elegida se guarda en la URL (`#/articulos?categoria=Lácteos`) con `useSearchParams`. Así el filtro sigue puesto
  al abrir un detalle y volver con "Volver al listado" o con el botón Atrás del navegador.
- Un contador indica "Mostrando 3 de 14 artículos" y hay un botón "Quitar filtro". Si la categoría no tiene artículos se avisa.

### Detalle del artículo

- Se abre al hacer clic en la fila o en el nombre del artículo (la fila completa es clicable y el nombre es un enlace, para que
  también funcione con teclado).
- Muestra nombre, marca, tipo, precio, stock disponible, código y cuántas unidades hay de ese artículo en el carrito.
- El selector de cantidad no baja de 1 ni sube más allá del stock disponible. Si no queda stock se avisa y no se puede agregar.
- Si el código no existe (`#/articulos/999`) se muestra "Artículo no encontrado".

### Carrito

- Cada línea muestra nombre, marca, precio unitario, unidades que quedan disponibles, selector de cantidad, subtotal y
  botón **Quitar**. Arriba se ven el total de unidades y el total a pagar.
- Con **+** se pasa una unidad más del inventario al carrito (deshabilitado si no queda stock); con **-** se devuelve una
  unidad al inventario (deshabilitado en 1; para eliminar la línea se usa **Quitar**, que devuelve todas las unidades).
- El menú superior muestra una insignia con las unidades que hay en el carrito.

## Estado global

`InventarioProvider` (envuelve la app en `main.jsx`) guarda `productos`, `carrito`, `cargando` y `error`, y se modifica solo
con acciones del reducer (objetos `{ type, payload }` definidos en la constante `ACTIONS`, en `src/context/inventarioReducer.js`).

| Acción | Efecto |
|---|---|
| `CARGA_INICIO`, `CARGA_EXITO`, `CARGA_ERROR` | Carga del inventario desde `public/productos.json` |
| `CAMBIAR_STOCK` | Suma o resta stock (botones + y - del inicio) |
| `AGREGAR_ARTICULO` | Agrega un artículo nuevo con id correlativo |
| `AGREGAR_AL_CARRITO` | Resta `cantidad` del stock y la suma a la línea del carrito (nunca más que el stock) |
| `CAMBIAR_CANTIDAD` | Sube o baja la cantidad de una línea (mínimo 1, máximo el stock disponible) y ajusta el stock |
| `QUITAR_DEL_CARRITO` | Elimina la línea y devuelve sus unidades al stock |

**Por qué el carrito está en el mismo reducer que el inventario:** al agregar o quitar unidades, el stock y la cantidad del carrito
cambian en la misma acción, así que nunca quedan desfasados. Se cumple siempre que `stock + unidades en carrito` es constante
para cada artículo (hay una prueba que lo verifica con una secuencia de acciones). Los estados que no se comparten
(el texto de búsqueda del inicio, la cantidad elegida en el detalle, los datos de los formularios) se mantienen locales con `useState`.

El reducer está en un archivo de JavaScript puro, sin React, para poder probarlo de forma aislada. Los componentes leen el estado con
los hooks `useInventario()` (estado y acciones) y `useCarrito()` (líneas del carrito, unidades y total ya calculados).

## Rutas

Todas las rutas están en un solo archivo, `src/routes/AppRoutes.jsx`. Cada página se carga con `React.lazy` y el mensaje
de carga es un `<Suspense>` dentro de `Layout`, alrededor del `<Outlet />`.

| Ruta | Página |
|---|---|
| `#/` | Inicio (inventario, búsqueda, filtro por tipo y ajuste de stock) |
| `#/agregar-articulo` | Agregar artículo |
| `#/articulos` | Listado de artículos (tabla con filtro por categoría) |
| `#/articulos/:id` | Detalle del artículo (ruta anidada con parámetro dinámico) |
| `#/carrito` | Carrito de compras |
| `#/preguntas-frecuentes` | Preguntas frecuentes |
| `#/contactanos` | Contáctanos |
| cualquier otra | Página no encontrada (404) |

Se usa `HashRouter` para que las rutas funcionen al recargar en GitHub Pages sin configuración de servidor.

## Estilos con Tailwind CSS

- **Tema** en `tailwind.config.js`: colores de marca (`marca`, `marca-oscuro`, `ambar`, `crema`) y tipografía Nunito.
- **Clases reutilizables con `@apply`** en `src/index.css`: `.campo`, `.btn-marca`, `.btn-secundario`, `.btn-peligro`, `.btn-paso`,
  `.tarjeta`, `.tabla-contenedor`, `.tabla`, `.alerta-error` y `.aviso-exito`.
- **Estados** hover, focus y disabled en botones y campos.
- **Responsive**: se revisó en 360, 390, 768 y 1366 px sin scroll horizontal en ninguna pantalla. El carrito se muestra como lista
  de tarjetas en vez de tabla para que quepa en pantallas angostas.
- Solo se incluyen en el CSS final las clases usadas (`content` en la configuración).

## Organización del código

```
src/
  routes/       AppRoutes.jsx (todas las rutas, con React.lazy)
  components/   Layout, MenuSuperior, MenuInferior, EstadoInventario (cargando / error con reintento)
    ui/         Boton, InsigniaStock, SelectorCantidad, TarjetaDato (componentes reutilizables)
  context/      InventarioContext.jsx (provider) e inventarioReducer.js (reducer puro)
  hooks/        useInventario.js, useCarrito.js
  pages/        Home, AgregarArticulo, ListadoArticulos, DetalleArticulo, Carrito,
                PreguntasFrecuentes, Contacto, NoEncontrada
  utils/        filtros.js, carrito.js, formato.js, tipos.js, validaciones.js
public/
  productos.json   datos locales del inventario (nombre, marca, tipo, precio, stock)
pruebas/
  reducer.test.mjs pruebas unitarias del reducer, el filtro y los cálculos del carrito
  e2e.mjs          pruebas de navegador (Playwright)
```

Reutilización: `Boton` (con variantes y modo enlace), `SelectorCantidad` (detalle y carrito), `InsigniaStock` (inicio y detalle),
`TarjetaDato` (inicio y carrito) y `EstadoInventario` (cargando / error en todas las páginas que usan el inventario).

## Instalación y uso

```
npm install
npm run dev        # servidor de desarrollo
npm run build      # build de producción en dist/
npm run preview    # sirve el build
```

## Pruebas

```
npm test           # pruebas unitarias (17), sin dependencias extra
```

Pruebas de navegador (requieren Playwright instalado aparte; recorren el sitio en 360, 390, 768 y 1366 px):

```
npm run build
npm run test:e2e
```

Cubren: filtro por categoría (incluida una categoría vacía y que los datos originales no se pierdan), detalle (clic en la fila, en el
nombre, volver con el filtro puesto, artículo inexistente y sin stock), agregar al carrito restando del inventario, aumentar, disminuir
y quitar desde el carrito con el inventario actualizándose en el listado y en el inicio, formularios, rutas, carga diferida de las páginas
y ausencia de scroll horizontal y de errores de consola. El HTML renderizado de cada pantalla se validó con vnu.jar sin errores.

## Despliegue

El build de `dist/` se publica en la rama `gh-pages` (`vite.config.js` usa `base: './'`, por lo que no depende del nombre del repositorio).

## Nota

Los cambios (stock, artículos nuevos y carrito) viven en el estado de la aplicación: se mantienen al navegar entre páginas y se
reinician al recargar el navegador.

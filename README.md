# Mi Mercado - Gestión de inventario

Actividad formativa S2 - Desarrollo Frontend II (PFY2202), Duoc UC.
Autor: Sergio Mascareno.

Continuación de la actividad formativa 1. Sitio de gestión de inventario para un
supermercado, hecho con React 19, Vite, React Router 6 y Tailwind CSS 3. Se agrega
un menú superior con dos páginas nuevas, un estado global para los artículos
(Context API + `useReducer`) y Tailwind CSS como framework de estilos.

## Requerimientos de la actividad

| Requerimiento | Donde esta |
|---|---|
| Continuar el sitio de la actividad formativa 1 | Mismo proyecto: home, menú inferior, Preguntas frecuentes y Contáctanos se mantienen |
| Nuevo menú que navega a otras dos páginas | `src/components/MenuSuperior.jsx` (Agregar artículo, Listado de artículos) |
| Página para ingresar nuevos artículos | `src/pages/AgregarArticulo.jsx` (formulario con validación) |
| Estado global con lista de artículos (nombre, marca y tipo de producto) | `src/context/InventarioContext.jsx` (`useReducer`) y `src/hooks/useInventario.js` |
| Formulario para agregar artículos | `src/pages/AgregarArticulo.jsx` + `src/utils/validaciones.js` |
| Página que lista en una tabla todos los artículos | `src/pages/ListadoArticulos.jsx` |
| Framework de CSS | Tailwind CSS 3: `tailwind.config.js`, `postcss.config.js`, `src/index.css` y clases de utilidad en los componentes |

## Estado global

Cada artículo tiene `id`, `nombre`, `marca`, `tipo`, `precio` y `stock`. El estado
vive en `InventarioProvider` (envuelve la app en `main.jsx`) y se modifica solo con
acciones del reducer (objetos `{ type, payload }` definidos en la constante `ACTIONS`):

| Acción | Efecto |
|---|---|
| `CARGA_INICIO`, `CARGA_EXITO`, `CARGA_ERROR` | Carga del inventario desde `public/productos.json` |
| `CAMBIAR_STOCK` | Suma o resta stock (botones + y - del inicio) |
| `AGREGAR_ARTICULO` | Agrega un artículo nuevo con id correlativo |

Las tres páginas que muestran artículos (inicio, formulario y listado) leen el mismo
estado con `useInventario()`, por eso un artículo agregado aparece al instante en todas.

## Rutas

| Ruta | Pagina |
|---|---|
| `#/` | Inicio (inventario, búsqueda, filtro por tipo y ajuste de stock) |
| `#/agregar-articulo` | Agregar artículo |
| `#/articulos` | Listado de artículos (tabla) |
| `#/preguntas-frecuentes` | Preguntas frecuentes |
| `#/contactanos` | Contáctanos |
| cualquier otra | Pagina no encontrada (404) |

Se usa `HashRouter` para que las rutas funcionen al recargar en GitHub Pages
sin configuracion de servidor.

## Instalacion y uso

```
npm install
npm run dev       # servidor de desarrollo
npm run build     # build de produccion en dist/
npm run preview   # sirve el build
```

Pruebas de navegacion y funcionalidad (requiere Playwright):

```
npm run build
node pruebas/e2e.mjs
```

## Estructura

```
src/
  components/   Layout.jsx, MenuSuperior.jsx, MenuInferior.jsx
  context/      InventarioContext.jsx (reducer + provider del estado global)
  hooks/        useInventario.js (acceso al contexto)
  pages/        Home, AgregarArticulo, ListadoArticulos, PreguntasFrecuentes, Contacto, NoEncontrada
  utils/        formato.js, tipos.js, validaciones.js
public/
  productos.json   datos locales del inventario (nombre, marca, tipo, precio, stock)
```

## Nota

Los cambios (stock y artículos nuevos) viven en el estado de la aplicación: se
mantienen al navegar entre páginas y se reinician al recargar el navegador.

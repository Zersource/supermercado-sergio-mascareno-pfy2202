# Supermercado Newen - Gestión de inventario

Actividad formativa S1 - Desarrollo Frontend II (PFY2202), Duoc UC.
Autor: Sergio Mascareno.

Sitio de gestion de inventario para un supermercado, hecho con React 19, Vite,
React Router 6 y Bootstrap 5.3.3. Es una SPA con home y dos paginas adicionales,
navegables desde un menu inferior fijo.

## Requerimientos de la actividad

| Requerimiento | Donde esta |
|---|---|
| Sitio de inventario para supermercado (HTML, CSS, JS, React) | Todo el proyecto |
| Pagina principal (home) | `src/pages/Home.jsx` (tabla de inventario, busqueda, filtro, ajuste de stock) |
| Menu inferior con navegacion a dos paginas | `src/components/MenuInferior.jsx` |
| Pagina adicional 1: Preguntas frecuentes | `src/pages/PreguntasFrecuentes.jsx` |
| Pagina adicional 2: Contáctanos | `src/pages/Contacto.jsx` (formulario con validacion) |
| React Router configurado | `src/main.jsx` (HashRouter), `src/App.jsx` (Routes/Route), `Layout` con Outlet, NavLink en el menu |

## Rutas

| Ruta | Pagina |
|---|---|
| `#/` | Inicio (inventario) |
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
  components/   Layout.jsx (comparte el inventario via Outlet context), MenuInferior.jsx
  hooks/        useInventario.js (fetch + estado del inventario)
  pages/        Home.jsx, PreguntasFrecuentes.jsx, Contacto.jsx, NoEncontrada.jsx
  utils/        formato.js, validaciones.js
public/
  productos.json   datos locales del inventario
```

# adulto-storer-react

Proyecto Desarrollo basado en plataforma — tienda e-commerce adulta construida con React + Vite.

## 🚀 Cómo ejecutar el proyecto

### Prerrequisitos

- [Node.js](https://nodejs.org/) **v18 o superior** (incluye npm)
- Verifica tu versión con: `node -v`

### Pasos para correr en local

```bash
# 1. Clona el repositorio
git clone https://github.com/juanseq2/adulto-storer-react.git
cd adulto-storer-react

# 2. Instala las dependencias del frontend
npm install

# 3. Instala las dependencias del backend
npm run backend:install

# 4. Arranca el backend y el frontend
npm run backend:start
npm run dev
```

Luego abre tu navegador en **http://localhost:5173** (Vite muestra la URL exacta en la terminal).

### Backend local en Express

El backend está en `backend/` y expone los siguientes endpoints:

- `GET /products` — lista todos los productos
- `GET /products/:id` — obtiene un producto por ID
- `POST /products` — crea un producto
- `PUT /products/:id` — actualiza un producto
- `DELETE /products/:id` — elimina un producto

### Uso con PostgreSQL

El backend puede usar una base de datos PostgreSQL real cuando se define `DATABASE_URL`.

- Agrega `backend/.env` con la URL de tu base de datos:

```env
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/adult_store_db
PORT=4000
```

- Instala dependencias del backend:

```bash
npm run backend:install
```

- Inicializa la base de datos y carga los productos desde `backend/data/products.json`:

```bash
cd backend
npm run db:init
```

- Inicia el backend:

```bash
npm run backend:start
```

Si no hay `DATABASE_URL`, el backend seguirá funcionando con el archivo local JSON.

### Despliegue en Render

Para desplegar en Render con PostgreSQL:

1. Crea un servicio Web para el backend.
2. Agrega un servicio de PostgreSQL en Render.
3. Copia la variable `DATABASE_URL` del servicio de Postgres a las variables de entorno del servicio Web.
4. Asegúrate de que el frontend use la URL del backend en Render guardando `VITE_API_BASE_URL` en las variables de entorno del frontend o en `.env`.

Si quieres usar este backend local, agrega o actualiza en `.env.local`:

```env
VITE_API_BASE_URL=http://localhost:4000
```

### Scripts disponibles

| Comando           | Descripción                                    |
|-------------------|------------------------------------------------|
| `npm run dev`     | Servidor de desarrollo con hot-reload          |
| `npm run build`   | Genera el build de producción en `/dist`       |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run lint`    | Analiza el código con ESLint                   |

> **Nota:** no se necesita configurar variables de entorno — el proyecto usa datos locales sin backend.

## 🔀 Cómo aplicar los cambios del Pull Request a tu repositorio

Los cambios propuestos por Copilot viven en una rama separada y se integran a tu rama principal (`main`) a través de un **Pull Request (PR)** en GitHub. Hay dos formas de hacerlo:

### Opción 1 — Desde la interfaz de GitHub (recomendado)

1. Ve a tu repositorio en GitHub: [github.com/juanseq2/adulto-storer-react](https://github.com/juanseq2/adulto-storer-react)
2. Haz clic en la pestaña **Pull requests**
3. Abre el PR titulado _"docs: add step-by-step run instructions to README"_ (o el que corresponda)
4. Revisa los cambios en la pestaña **Files changed**
5. Si estás de acuerdo, haz clic en **Merge pull request** → **Confirm merge**
6. ✅ Los cambios ya quedan en tu rama `main`

### Opción 2 — Desde la terminal (git)

```bash
# Asegúrate de estar en tu rama principal
git checkout main

# Descarga los últimos cambios de GitHub
git fetch origin

# Fusiona la rama del PR en tu main
git merge origin/copilot/create-e-commerce-store

# Sube los cambios a GitHub
git push origin main
```

> **Consejo:** Si prefieres conservar el historial lineal, reemplaza `git merge` por `git rebase origin/copilot/create-e-commerce-store`.

---

## Tecnologías

- **React 18** — UI con hooks y Context API
- **React Router DOM v6** — navegación SPA
- **Vite 5** — bundler y servidor de desarrollo
- **CSS Modules** — estilos encapsulados por componente

## Estructura del proyecto

```
src/
├── components/
│   ├── CartItem/       # Ítem del carrito con controles de cantidad
│   ├── Footer/         # Footer con newsletter y enlaces
│   ├── Header/         # Header sticky con nav y carrito
│   ├── Newsletter/     # Formulario de suscripción con validación
│   ├── ProductCard/    # Tarjeta de producto con favoritos
│   ├── Rating/         # Estrellas de valoración
│   └── SearchBar/      # Barra de búsqueda con debounce
├── data/
│   └── products.js     # 22 productos con categorías
├── hooks/
│   ├── useCart.js      # Lógica del carrito (add, remove, update, clear)
│   └── useFavorites.js # Lógica de favoritos (toggle)
├── pages/
│   ├── About/          # Página Sobre Nosotros
│   ├── Cart/           # Carrito con resumen y checkout
│   ├── Contact/        # Formulario de contacto con validación
│   ├── Home/           # Landing con hero, featured y categorías
│   └── Products/       # Catálogo con filtros, búsqueda y orden
├── styles/
│   └── global.css      # Variables CSS y reset global
├── App.jsx             # Rutas, providers de contexto
└── main.jsx            # Entry point
```

## Páginas y rutas

| Ruta              | Página       |
|-------------------|--------------|
| `/`               | Home         |
| `/productos`      | Products     |
| `/sobre-nosotros` | About        |
| `/contacto`       | Contact      |
| `/carrito`        | Cart         |

## Funcionalidades

- 🛒 Carrito con add/remove/update cantidad y vaciar
- ❤️ Favoritos por producto (toggle)
- 🔍 Búsqueda con debounce 300ms
- 🗂️ Filtro por categoría, precio min/max y ordenación
- 📧 Newsletter con validación de email
- 📬 Formulario de contacto con validación completa
- 🚀 Checkout simulado con confirmación
- 📦 Envío gratis a partir de $50
- 📱 Diseño responsive (mobile-first)
- 🍔 Menú hamburguesa en móvil
---

## 🆕 Nuevas Funcionalidades (2026)

### Drag & Drop para Deseados

Sistema de arrastrar y soltar para agregar productos a la lista de deseados:

| Elemento | Descripción |
|----------|-------------|
| **ProductCard** | Las tarjetas de productos son arrastrables (`draggable`) |
| **DropZone** | Botón flotante 📦 en la esquina inferior derecha |
| **Feedback visual** | Cursor `grab`/`grabbing` y cambio de color al pasar sobre el dropzone |

**Cómo usar:**
1. Arrastra cualquier tarjeta de producto
2. Suelta sobre el botón 📦 o en cualquier área de la página de productos
3. El producto se agrega a deseados automáticamente

### Modal de Detalles de Producto

Ventana emergente con información completa del producto:

- **Imagen** — Arrastrable para agregar a favoritos
- **Detalles** — Nombre, descripción, precio, descuento, stock
- **Comentarios** — Sistema de comentarios con calificación por estrellas
- **Favoritos** — Botón para agregar/quitar de deseados

### Sistema de Deseados

| Feature | Descripción |
|---------|-------------|
| **Botón flotante** | 📦 visible en todas las páginas |
| **Lista de deseados** | Click en 📦 para ver modal con productos guardados |
| **Persistencia** | Se guardan en `localStorage` |
| **Eliminar** | Botón 🗑️ para quitar productos |

### Comentarios Persistidos

Los comentarios de productos se almacenan en `localStorage`:

- Cada producto tiene su propia lista de comentarios
- Incluye calificación (1-5 estrellas)
- Fecha de creación
- Persiste entre sesiones del navegador

---

## 📁 Estructura Actualizada

```
src/
├── components/
│   ├── CartItem/       # Ítem del carrito con controles de cantidad
│   ├── DropZone/       # Botón flotante 📦 para drag & drop
│   ├── Footer/         # Footer con newsletter y enlaces
│   ├── Header/         # Header sticky con nav y carrito
│   ├── Newsletter/     # Formulario de suscripción con validación
│   ├── ProductCard/    # Tarjeta de producto con favoritos + drag
│   ├── ProductModal/   # Modal de detalles y comentarios
│   ├── Rating/         # Estrellas de valoración
│   └── SearchBar/      # Barra de búsqueda con debounce
├── data/
│   └── products.js     # 22 productos con categorías
├── hooks/
│   ├── useCart.js            # Lógica del carrito
│   ├── useFavorites.js      # Lógica de favoritos (legacy)
│   └── usePersistentStorage.js # Favoritos + comentarios persistidos
├── pages/
│   ├── About/          # Página Sobre Nosotros
│   ├── Cart/           # Carrito con resumen y checkout
│   ├── Contact/        # Formulario de contacto con validación
│   ├── GiftList/       # Lista de regalos
│   ├── Home/           # Landing con hero, featured y categorías
│   └── Products/       # Catálogo con filtros, búsqueda y orden
├── styles/
│   └── global.css      # Variables CSS y reset global
├── App.jsx             # Rutas, providers de contexto
└── main.jsx            # Entry point
```


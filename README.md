# Adult Store React

Proyecto e-commerce adulto construido con React + Vite y un backend Express local.

## 🚀 Ejecutar el proyecto

### Requisitos

- Node.js 18 o superior
- npm

### Instalación

```bash
git clone https://github.com/juanseq2/adulto-storer-react.git
cd adulto-storer-react
npm install
```

### Correr la aplicación

```bash
npm run dev:full
```

Esto inicia el backend y el frontend en paralelo.

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`

También puedes iniciar los servicios por separado:

```bash
npm run start:backend
npm run dev
```

## 🧩 Backend

El servidor principal está en `server.js` y usa SQLite por defecto.

### Endpoints disponibles

- `GET /products` — lista todos los productos
- `GET /products/:id` — obtiene un producto por ID
- `POST /products` — crea un producto
- `PUT /products/:id` — actualiza un producto
- `DELETE /products/:id` — elimina un producto
- `GET /` — estado del backend

### Base de datos

- Por defecto se usa SQLite con archivo `products.db` en la raíz del proyecto.
- Las tablas `products` y `orders` se crean automáticamente al iniciar el backend.
- Si `products` está vacía, se carga el seed de `src/data/products.js`.

### Uso opcional de PostgreSQL

Si quieres usar PostgreSQL, crea un archivo `.env` en la raíz con:

```env
DATABASE_URL=postgres://usuario:contraseña@localhost:5432/adult_store_db
PORT=4000
```

Luego inicia el backend normalmente con:

```bash
npm run start:backend
```

## 🛠️ Servicios y rutas del frontend

La app consume la API desde `src/services/api.js`.

- `getProducts()` → `GET /products`
- `createProduct()` → `POST /products`
- `updateProductById(id, data)` → `PUT /products/:id`
- `deleteProductById(id)` → `DELETE /products/:id`

## 📁 Estructura principal del proyecto

- `src/` — frontend React
- `server.js` — backend Express con SQLite/PostgreSQL
- `src/services/api.js` — llamadas al backend
- `src/pages/` — páginas de la aplicación
- `src/components/` — componentes UI
- `src/hooks/` — hooks personalizados
- `src/contexts/` — proveedores React
- `src/data/products.js` — datos iniciales para seed
- `public/assets/products/` — imágenes de productos

## 📦 Scripts disponibles

| Comando           | Descripción                                    |
|-------------------|------------------------------------------------|
| `npm run dev`     | Inicia frontend en modo desarrollo             |
| `npm run build`   | Genera build de producción                     |
| `npm run preview` | Previsualiza el build de producción            |
| `npm run lint`    | Ejecuta ESLint                                 |
| `npm run start:backend` | Inicia el backend local                 |
| `npm run dev:full` | Inicia backend y frontend juntos              |
| `npm run backend:install` | Instala dependencias del backend alternativo en `backend/` |
| `npm run backend:start` | Inicia el backend alternativo en `backend/`  |
| `npm run backend:dev` | Inicia el backend alternativo con nodemon    |

## 📝 Notas importantes

- No es necesario configurar variables de entorno para ejecutar el proyecto con SQLite.
- El frontend asume que la API está disponible en `http://localhost:4000`.
- El directorio `backend/` incluye una implementación alternativa de backend que usa `backend/data/products.json` y puede ser útil para pruebas adicionales.

## 🚀 Funcionalidades principales

- Catálogo de productos
- Filtro y búsqueda
- Carrito de compras
- Gestión de productos desde el panel de administración
- Widget flotante de WhatsApp
- Verificación de edad
- Listas de deseos / favoritos

## Tecnologías

- React 18
- Vite
- Express
- SQLite (por defecto)
- PostgreSQL (opcional)
- CSS Modules
- React Router DOM

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
│   ├── FloatingGiftBubble/ # Widget de lista de regalos
│   ├── FloatingWhatsApp/   # Widget flotante para contacto por WhatsApp 💬
│   ├── Footer/         # Footer con newsletter y enlaces
│   ├── Header/         # Header sticky con nav y carrito
│   ├── Newsletter/     # Formulario de suscripción con validación
│   ├── ProductCard/    # Tarjeta de producto con favoritos + drag
│   ├── ProductModal/   # Modal de detalles y comentarios
│   ├── Rating/         # Estrellas de valoración
│   ├── SearchBar/      # Barra de búsqueda con debounce
│   └── SidebarMenu/    # Menú lateral hamburguesa (📱 mobile)
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


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

## 🗄️ Base de Datos

### Estructura y Conexión

El proyecto usa **SQLite** por defecto para almacenar productos y pedidos. La base de datos se crea automáticamente en `products.db` cuando se inicia el backend.

#### Tablas principales:

**1. Tabla `products`**
Almacena los productos disponibles en la tienda:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | ID único (clave primaria) |
| `name` | TEXT | Nombre del producto |
| `description` | TEXT | Descripción detallada |
| `price` | REAL | Precio en USD |
| `category` | TEXT | Categoría (ej: "Accesorios", "Ropa", etc) |
| `image` | TEXT | URL de la imagen |
| `rating` | REAL | Calificación (0-5) |
| `reviews` | INTEGER | Número de comentarios |
| `likes` | INTEGER | Número de "me gusta" |
| `inStock` | INTEGER | 1 si está en stock, 0 si no |
| `stockQuantity` | INTEGER | Cantidad disponible |
| `discount` | INTEGER | Descuento en porcentaje (0-100) |

**Ejemplo:**
```sql
INSERT INTO products 
(name, description, price, category, image, rating, reviews, likes, inStock, stockQuantity, discount)
VALUES 
('Vibrador Rosa', 'Vibrador de silicona suave', 29.99, 'Vibradores', '/assets/products/product-1.jpg', 4.8, 45, 12, 1, 15, 10);
```

**2. Tabla `orders`**
Almacena los pedidos realizados:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | INTEGER | ID único del pedido |
| `customerName` | TEXT | Nombre del cliente |
| `customerEmail` | TEXT | Email del cliente |
| `paymentMethod` | TEXT | Método de pago (Tarjeta, Paypal, etc) |
| `status` | TEXT | Estado del pedido (ej: "ficticio", "procesando", "entregado") |
| `shipping` | REAL | Costo de envío |
| `total` | REAL | Monto total del pedido |
| `items` | TEXT | JSON con los productos del pedido |
| `createdAt` | TEXT | Fecha de creación (ISO 8601) |

**Ejemplo:**
```sql
INSERT INTO orders 
(customerName, customerEmail, paymentMethod, status, shipping, total, items, createdAt)
VALUES 
('Juan Pérez', 'juan@example.com', 'Tarjeta', 'ficticio', 5.50, 35.49, '[{"id":1,"name":"Vibrador Rosa","quantity":1,"price":29.99}]', '2026-05-21T10:30:00Z');
```

### Datos Iniciales

Al iniciar el backend por primera vez, se cargan automáticamente **22 productos** desde `src/data/products.js`:

- Vibradores
- Accesorios
- Lubricantes
- Juguetes eróticos
- Ropa íntima

Estos datos se insertan en la base de datos SQLite si está vacía.

### Conexión con el Backend

El backend (en `server.js`) se conecta a SQLite usando:

```javascript
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = await open({
  filename: 'products.db',
  driver: sqlite3.Database,
});
```

**Endpoints de la BD:**
- `GET /api/products` — obtiene todos los productos
- `GET /api/products/:id` — obtiene un producto
- `POST /api/products` — inserta un producto
- `PUT /api/products/:id` — actualiza un producto
- `DELETE /api/products/:id` — elimina un producto
- `GET /api/orders` — obtiene todos los pedidos
- `POST /api/orders` — crea un pedido (con control de stock)

### Respaldo de Datos

El archivo `products.db` se guarda en la raíz del proyecto. Para hacer backup:

```bash
cp products.db products.backup.db
```

Para restaurar:

```bash
cp products.backup.db products.db
```

## 💬 Menú Hamburguesa (Mobile)

Se agregó un menú lateral que aparece en dispositivos móviles (<768px) con acceso rápido a:

- **Contactar por WhatsApp** — Abre conversación directa con el número +57 323 8151791
- **Ver Deseados** — Scroll automático hacia la caja de deseados

### Scripts disponibles

| Comando           | Descripción                                    |
|-------------------|------------------------------------------------|
| `npm run dev`     | Servidor de desarrollo con hot-reload          |
| `npm run build`   | Genera el build de producción en `/dist`       |
| `npm run preview` | Previsualiza el build de producción localmente |
| `npm run lint`    | Analiza el código con ESLint                   |

> **Nota:** no se necesita configurar variables de entorno — el proyecto usa datos locales sin backend.

## � Widget de WhatsApp

Se ha agregado un widget flotante de WhatsApp en la esquina inferior derecha de la aplicación:

- **Botón flotante:** 💬 con animación de rebote
- **Menú interactivo:** Al hacer clic, muestra un mensaje invitando a contactar
- **Contacto directo:** Abre WhatsApp con el número **+57 323 8151791**
- **Disponible en todas las páginas:** El widget aparece en todo el sitio
- **Responsive:** Se adapta a dispositivos móviles

**Cómo funciona:**
1. Haz clic en el botón 💬 en la esquina inferior derecha
2. Verás el mensaje "¿Necesitas ayuda? Contáctanos por WhatsApp"
3. Haz clic en "Abrir WhatsApp" para enviar un mensaje directo

## �🔀 Cómo aplicar los cambios del Pull Request a tu repositorio

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


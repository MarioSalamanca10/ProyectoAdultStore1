# 🎁 Funcionalidad de Lista de Deseos con Drag & Drop

## ¿Qué se agregó?

Se implementó una **funcionalidad completa de Lista de Deseos con Drag & Drop** que permite a los usuarios crear listas personalizadas de regalos y recibir promociones automáticas. La característica está disponible como:
1. **Widget Flotante (Burbuja)** - Accesible desde todas las páginas
2. **Página Dedicada** - Acceso completo en `/mis-deseos`

## Características principales

### 1. **Widget Flotante (Nueva Adición)** 🎈
- ✅ Burbuja flotante disponible en **todas las ventanas/páginas**
- ✅ Totalmente arrastrable
- ✅ Se expande/contrae con un click
- ✅ Misma estética que la caja principal
- ✅ Badge con cantidad de productos
- ✅ Drag & drop funcional dentro de la burbuja

### 2. **Panel de Listas Personalizadas** (Widget + Página)
- ✅ Crear múltiples listas de deseos con nombres personalizados
- ✅ Editar nombres de listas (en página completa)
- ✅ Eliminar listas
- ✅ Cambiar entre listas activas
- ✅ Selector rápido en widget

### 3. **Caja de Regalos Virtual** 
- 🎁 Interfaz atractiva con caja de regalo 3D
- ✅ Arrastra y suelta productos desde cualquier página
- ✅ Vista previa de artículos agregados
- ✅ Eliminar artículos individuales
- ✅ Cálculo automático de totales

### 4. **Sistema de Promociones Automáticas** 🎉
El sistema calcula automáticamente descuentos según la cantidad de productos:
- **2+ productos**: 5% de descuento
- **4+ productos**: 10% de descuento
- **6+ productos**: 15% de descuento (Pack Completo)
- **Total ≥ $150**: 12% de descuento (Promo Premium)

Las promociones aparecen dinámicamente en ambas interfaces (widget y página).

### 5. **Múltiples Interfaces**

#### **Widget Flotante** (En todas las páginas)
- Ubicado en la esquina inferior derecha
- Completamente arrastrable
- Estados: colapsado/expandido
- Selector de listas
- Crear nuevas listas rápidamente
- Zona de drop compacta
- Resumen de totales
- Botón de agregar al carrito

#### **Página Completa** (En `/mis-deseos`)
- Interfaz más amplia y detallada
- Panel lateral para gestión de listas
- Caja de regalos en grande
- Selector de productos disponibles
- Edición completa de listas

## Cómo usar

### Acceder a la Lista de Deseos
**Opción 1 - Widget Flotante (Recomendado)**:
- El widget está disponible en todas las páginas
- Haz click en la burbuja 🎁 para expandirlo
- Drastrala si deseas moverla

**Opción 2 - Página Completa**:
- Haz clic en **"🎁 Mi Lista de Deseos"** en el menú
- O accede directamente a `/mis-deseos`

### Crear una Lista
1. En el widget o página, escribe el nombre de la lista
2. Presiona Enter o haz click en **"➕ Crear"**
3. La lista aparecerá en el selector

### Agregar Productos (Drag & Drop)
**Desde cualquier página**:
1. Busca el producto que te interesa
2. **Arrastra el producto** a la zona de drop del widget o página
3. El producto se agregará automáticamente a tu lista actual

**En el widget**:
- El área de drop es compacta
- Muestra vista previa de productos agregados
- Resumen instantáneo de totales

### Ver Promociones
- Cuando agregues productos, las promociones disponibles aparecerán automáticamente
- Las promos se muestran como tarjetas con descuentos
- Se actualizan en tiempo real

### Agregar al Carrito
- **Botón rápido**: 🛒 Al Carrito (en widget)
- **Desde página completa**: 🛒 Agregar Todos al Carrito

## Estructura de Archivos

### Archivos Nuevos Creados
```
src/
├── hooks/
│   └── useGiftList.js              # Hook para gestionar listas
├── components/
│   ├── GiftBox/
│   │   ├── GiftBox.jsx             # Componente caja grande
│   │   └── GiftBox.module.css       # Estilos caja
│   └── FloatingGiftBubble/         # ✨ NUEVO
│       ├── FloatingGiftBubble.jsx  # Widget flotante
│       └── FloatingGiftBubble.module.css
└── pages/
    └── GiftList/
        ├── GiftList.jsx            # Página completa
        └── GiftList.module.css      # Estilos página
```

### Archivos Modificados
- `src/App.jsx` - Agregadas rutas y FloatingGiftBubble global
- `src/components/Header/Header.jsx` - Agregado enlace en navegación

## Características Técnicas

### Hook `useGiftList`
Gestiona:
- Creación, edición y eliminación de listas
- Agregar/eliminar productos
- Aplicación de promociones
- Cálculo de totales
- Persistencia en `localStorage`

### Widget Flotante
- **Position: fixed** para estar en todas las páginas
- **z-index: 999** para estar por encima de otros elementos
- **Totalmente draggable** con mouse
- **Estados**: colapsado/expandido
- **Responsivo** para móviles

### Datos Persistentes
Las listas se guardan automáticamente en `localStorage` con clave `gift_lists`

### Drag & Drop Nativo
Implementado usando API nativa de HTML5 Drag & Drop - funciona en:
- Widget flotante
- Página completa
- Todas las páginas del sitio

## Respuesta de Promociones

Las promociones se calculan dinámicamente basadas en:
- **Cantidad de artículos** en la lista
- **Valor total** de los productos

```javascript
Ejemplo:
- 2 productos → 5% descuento
- 4 productos → 10% descuento
- 6 productos → 15% descuento
- Valor > $150 → 12% descuento
```

## Notas Importantes

1. **Múltiples Listas**: Cada usuario puede crear varias listas
2. **Persistencia**: Las listas se guardan en localStorage del navegador
3. **Widget Flotante**: Está disponible **en todas las páginas simultáneamente**
4. **Independencia**: El carrito tradicional funciona independientemente
5. **Responsive**: Diseño completamente adaptable a móviles
6. **Drag & Drop**: Funciona desde cualquier página sin necesidad de estar en `/mis-deseos`

## Próximas Mejoras Sugeridas

- 📤 Compartir listas por URL
- 💾 Exportar listas a PDF
- 🔄 Sincronización con cuenta de usuario
- 📧 Enviar lista por email
- 👥 Listas compartidas con amigos
- 📱 Notificaciones de productos en oferta


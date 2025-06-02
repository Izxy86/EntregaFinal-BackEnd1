# Proyecto Backend - Entrega Final

Este proyecto es la **entrega final del curso de Backend** de Coderhouse. Parte de la base construida en la **entrega 2** (manejo de productos y carritos con archivos JSON) y fue refactorizado completamente para:

- Usar **MongoDB con Mongoose** como base de datos.
- Implementar **paginación, filtros y ordenamiento** para productos.
- Agregar **vistas con Handlebars**.
- Incorporar un **sistema de carritos persistente** con operaciones completas.

---

## 🛠 Tecnologías Utilizadas

- Node.js + Express
- MongoDB Atlas + Mongoose
- Express Handlebars
- Socket.io (para vista realtime)
- CSS personalizado
- Postman (para pruebas de API)

---

## 📦 Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/Izxy86/EntregaFinal-BackEnd1.git
   cd backend-entrega-final
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar conexión a MongoDB Atlas en `src/config/db.js`

4. Iniciar el servidor:
   ```bash
   npm start
   ```

---

## 🚀 Cómo acceder

### ▶️ Vista de productos
- Ir a: [http://localhost:8080/products](http://localhost:8080/products)
- Se puede usar paginación, filtros y ordenamiento por URL:
  ```
  /products?limit=5&page=2&sort=desc&query=audio
  ```

### ▶️ Vista de detalle
- Hacer clic en el nombre de cualquier producto para ver su detalle.
- URL: `/products/:pid`

### ▶️ Agregar al carrito
- Desde la vista de productos, cada producto tiene un botón “Agregar al carrito”.
- Por ahora, el carrito activo es fijo (en el código puede estar hardcodeado para pruebas).

### ▶️ Vista de carrito
- Ir a: `/cart/:cid`
- Se puede ver el contenido del carrito, eliminar productos o vaciarlo por completo.

---

## ✅ Funcionalidades Implementadas

### 📘 Productos
- CRUD con Mongoose.
- Paginación (`limit`, `page`).
- Filtros por `category` o `status` (`query`).
- Ordenamiento por precio (`sort=asc|desc`).
- Vistas con listado paginado y detalle individual.

### 🛒 Carrito
- Crear carrito vacío.
- Agregar productos al carrito (desde botón o vía API).
- Ver carrito con datos poblados (`populate`).
- Vista de carrito con productos, cantidades y botones para eliminar/vaciar.

### 🎨 Estilos
- Se aplicaron estilos básicos desde CSS externo (`src/public/css/styles.css`).

---

## 📂 Estructura del Proyecto

```
/src
  /models         ← Esquemas de Mongoose
  /routes         ← Rutas de API y vistas
  /views          ← Plantillas Handlebars
  /public         ← Archivos estáticos (CSS, imágenes, JS)
  /data           ← (solo en entrega 2) archivo JSON de respaldo
  /sockets        ← Configuración de socket.io para realtime
```

---

## ✉️ Notas Finales

- El proyecto parte de la entrega 2, pero se migró todo a MongoDB para cumplir con los nuevos requerimientos.
- Se puede seguir expandiendo para agregar autenticación, persistencia de carrito por usuario, entre otras mejoras.

---

🎓 **Gracias por tu tiempo y correcciones.**

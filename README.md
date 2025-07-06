# Lara's Project - Sistema de Gestión de Joyas

Sistema completo de gestión de joyas con módulos de usuarios, joyas y pedidos, desarrollado con Node.js, Express, Sequelize (MySQL) y MongoDB.

## 🚀 Características Principales

### 👥 Gestión de Usuarios
- Registro e inicio de sesión de administradores
- Autenticación JWT
- CRUD completo de usuarios
- Validación de datos

### 💍 Gestión de Joyas
- Catálogo de joyas con categorías
- Gestión de stock e imágenes
- CRUD completo
- Almacenamiento en MongoDB

### 🛍️ **Módulo de Pedidos (NUEVO)**
- Gestión completa de pedidos
- Estados: pendiente, pagado, enviado, cancelado
- Validaciones robustas con express-validator
- **Notificaciones por correo automáticas**
- Estadísticas de ventas
- Filtrado por estado

## 📁 Estructura del Proyecto

```
src/
├── configuracion/
│   ├── db.js                 # Configuración MySQL
│   ├── baseDeDatosMongo.js   # Configuración MongoDB
│   ├── passport.js           # Configuración JWT
│   └── correo.js             # Configuración Nodemailer
├── modelos/
│   ├── Usuario.js            # Modelo usuarios (MySQL)
│   ├── Pedido.js             # Modelo pedidos (MySQL)
│   └── joya.js               # Modelo joyas (MongoDB)
├── controladores/
│   ├── usuariosController.js # Lógica usuarios
│   ├── joyascontrolador.js   # Lógica joyas
│   └── pedidosController.js  # Lógica pedidos
├── rutas/
│   ├── usuarios.js           # Rutas usuarios
│   ├── joyas.js              # Rutas joyas
│   └── pedidos.js            # Rutas pedidos
├── intermediarios/
│   └── validador.js          # Validaciones express-validator
├── migraciones/
│   └── 2025062802-crear-pedido.js
└── app.js                    # Archivo principal
```

## 🛠️ Tecnologías Utilizadas

- **Backend:** Node.js + Express.js
- **Bases de Datos:** MySQL (Sequelize) + MongoDB (Mongoose)
- **Autenticación:** JWT + Passport.js
- **Validación:** Express-validator
- **Correos:** Nodemailer
- **Seguridad:** Argon2 (hash de contraseñas)

## 📋 Endpoints Disponibles

### Usuarios
- `POST /api/usuarios/registro` - Registrar administrador
- `POST /api/usuarios/iniciarsesion` - Iniciar sesión
- `GET /api/usuarios` - Listar usuarios
- `GET /api/usuarios/:id` - Obtener usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

### Joyas
- `POST /api/joyas` - Crear joya
- `GET /api/joyas` - Listar joyas
- `GET /api/joyas/:id` - Obtener joya
- `PUT /api/joyas/:id` - Actualizar joya
- `DELETE /api/joyas/:id` - Eliminar joya

### **Pedidos (NUEVO)**
- `POST /api/pedidos` - Crear pedido
- `GET /api/pedidos` - Listar pedidos
- `GET /api/pedidos/:id` - Obtener pedido
- `PUT /api/pedidos/:id` - Actualizar pedido
- `DELETE /api/pedidos/:id` - Eliminar pedido
- `GET /api/pedidos/estado/:estado` - Filtrar por estado
- `GET /api/pedidos/estadisticas` - Estadísticas

## 🔧 Instalación y Configuración

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd ProyectoLara
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crea un archivo `.env` basado en `CONFIGURACION.md`

4. **Ejecutar migraciones (opcional)**
```bash
npx sequelize-cli db:migrate
```

5. **Iniciar el servidor**
```bash
npm run dev
```

## 📧 Configuración de Correos

El sistema envía correos automáticos cuando:
- Se crea un nuevo pedido
- Se actualiza el estado de un pedido

Configura las variables SMTP en tu `.env`:
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_de_aplicacion
ADMIN_EMAIL=admin@larasproject.com
```

## 🧪 Pruebas

Consulta `PRUEBAS.md` para ejemplos completos de cómo probar todos los endpoints.

## 📊 Modelo de Datos

### Pedido
```json
{
  "id": 1,
  "joya_id": "abc123",
  "cantidad": 2,
  "total": 150.00,
  "estado": "pendiente",
  "admin_id": 1,
  "createdAt": "2025-06-28T10:00:00.000Z",
  "updatedAt": "2025-06-28T10:00:00.000Z"
}
```

## 🔒 Seguridad

- Todas las rutas de pedidos requieren autenticación JWT
- Validación robusta de datos de entrada
- Hash seguro de contraseñas con Argon2
- Validación de existencia de joyas y usuarios

## 👥 Autores

- Joaquin David Buezo Rosa
- Fernanda
- Carlo

## 📝 Licencia

ISC

---

**Mis hermonitos ahí agregue parte de mi parte, maybe hago algo más luego, ya vere que onda: Joaquin David Buezo Rosa**

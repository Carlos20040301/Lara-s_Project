# Configuración del Proyecto Lara's Project

## Variables de Entorno (.env)

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de la base de datos MySQL
DB_HOST=localhost
DB_USER=Lara
DB_PASSWORD=Larasita.123
DB_NAME=lara_s_project
DB_PORT=3306

# Configuración de MongoDB
MONGODB_URI=mongodb://localhost:27017/joyeria

# Configuración JWT
clave=clave_secreta

# Configuración SMTP para correos (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_password_de_aplicacion
ADMIN_EMAIL=admin@larasproject.com

# Configuración del servidor
PORT=3001
NODE_ENV=development
```

## Configuración de Gmail para SMTP (Opcional)

Para usar Gmail como servidor SMTP y recibir notificaciones por correo:

1. Activa la verificación en dos pasos en tu cuenta de Google
2. Genera una contraseña de aplicación:
   - Ve a Configuración de la cuenta de Google
   - Seguridad > Verificación en dos pasos
   - Contraseñas de aplicación
   - Genera una nueva contraseña para "Correo"
3. Usa esa contraseña en `SMTP_PASS`

**Nota:** Si no configuras SMTP, el sistema funcionará normalmente pero no enviará correos de notificación.

## Instalación y Ejecución

1. Instalar dependencias:
```bash
npm install
```

2. Configurar las variables de entorno en `.env` (usando las variables de arriba)

3. Asegurarte de que MySQL esté corriendo con:
   - Host: localhost
   - Usuario: Lara
   - Contraseña: Larasita.123
   - Base de datos: lara_s_project

4. Asegurarte de que MongoDB esté corriendo en:
   - URI: mongodb://localhost:27017/joyeria

5. Ejecutar migraciones (opcional):
```bash
npx sequelize-cli db:migrate
```

6. Iniciar el servidor:
```bash
npm run dev
```

## Endpoints de Pedidos

### Autenticación
Todos los endpoints requieren un token JWT válido en el header:
```
Authorization: Bearer <token>
```

### Endpoints Disponibles

- `POST /api/pedidos` - Crear pedido
- `GET /api/pedidos` - Listar todos los pedidos
- `GET /api/pedidos/:id` - Obtener pedido por ID
- `PUT /api/pedidos/:id` - Actualizar pedido
- `DELETE /api/pedidos/:id` - Eliminar pedido
- `GET /api/pedidos/estado/:estado` - Filtrar por estado
- `GET /api/pedidos/estadisticas` - Obtener estadísticas

### Estados de Pedido
- `pendiente` - Pedido creado, pendiente de pago
- `pagado` - Pedido pagado
- `enviado` - Pedido enviado
- `cancelado` - Pedido cancelado

## Estructura de Datos

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

### Crear Pedido
```json
{
  "joya_id": "abc123",
  "cantidad": 2,
  "total": 150.00,
  "estado": "pendiente",
  "admin_id": 1
}
```

## Verificación de Conexiones

El servidor mostrará mensajes de estado cuando inicie:

```
⏳ Conectando a la base de datos MySQL...
✅ Base de datos conectada correctamente
📦 Tablas sincronizadas:
   - usuarios
   - pedidos
✅ Conectado a MongoDB: mongodb://localhost:27017/joyeria
🚀 Servidor escuchando en http://localhost:3001
```

Si ves estos mensajes, todo está configurado correctamente. 
# Pruebas del Módulo de Pedidos - Lara's Project

## Configuración de Pruebas

### 1. Obtener Token JWT

Primero necesitas obtener un token JWT autenticándote:

```http
POST http://localhost:3001/api/usuarios/iniciarsesion
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

### 2. Crear una Joya (si no existe)

```http
POST http://localhost:3001/api/joyas
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json

{
  "_id": "test123",
  "nombre": "Anillo de Prueba",
  "categoria": "Anillo",
  "precio": 150.00,
  "descripcion": "Anillo para pruebas",
  "stock": 10,
  "imagen": "anillo.jpg"
}
```

### 3. Crear un Usuario Administrador (si no existe)

```http
POST http://localhost:3001/api/usuarios/registro
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123",
  "nombre": "Administrador",
  "rol": "admin"
}
```

## Pruebas de Endpoints

### 1. Crear Pedido

```http
POST http://localhost:3001/api/pedidos
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json

{
  "joya_id": "test123",
  "cantidad": 2,
  "total": 300.00,
  "estado": "pendiente",
  "admin_id": 1
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Pedido creado exitosamente",
  "data": {
    "id": 1,
    "joya_id": "test123",
    "cantidad": 2,
    "total": "300.00",
    "estado": "pendiente",
    "admin_id": 1,
    "createdAt": "2025-06-28T10:00:00.000Z",
    "updatedAt": "2025-06-28T10:00:00.000Z",
    "Usuario": {
      "id": 1,
      "nombre": "Administrador",
      "email": "admin@example.com"
    }
  }
}
```

### 2. Listar Todos los Pedidos

```http
GET http://localhost:3001/api/pedidos
Authorization: Bearer <tu_token_jwt>
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Pedidos obtenidos exitosamente",
  "count": 1,
  "data": [
    {
      "id": 1,
      "joya_id": "test123",
      "cantidad": 2,
      "total": "300.00",
      "estado": "pendiente",
      "admin_id": 1,
      "createdAt": "2025-06-28T10:00:00.000Z",
      "updatedAt": "2025-06-28T10:00:00.000Z",
      "Usuario": {
        "id": 1,
        "nombre": "Administrador",
        "email": "admin@example.com"
      }
    }
  ]
}
```

### 3. Obtener Pedido por ID

```http
GET http://localhost:3001/api/pedidos/1
Authorization: Bearer <tu_token_jwt>
```

### 4. Actualizar Pedido

```http
PUT http://localhost:3001/api/pedidos/1
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json

{
  "estado": "pagado",
  "cantidad": 3,
  "total": 450.00
}
```

### 5. Filtrar Pedidos por Estado

```http
GET http://localhost:3001/api/pedidos/estado/pendiente
Authorization: Bearer <tu_token_jwt>
```

### 6. Obtener Estadísticas

```http
GET http://localhost:3001/api/pedidos/estadisticas
Authorization: Bearer <tu_token_jwt>
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Estadísticas obtenidas exitosamente",
  "data": {
    "totalPedidos": 1,
    "pedidosPendientes": 0,
    "pedidosPagados": 1,
    "pedidosEnviados": 0,
    "pedidosCancelados": 0,
    "totalVentas": "450.00"
  }
}
```

### 7. Eliminar Pedido

```http
DELETE http://localhost:3001/api/pedidos/1
Authorization: Bearer <tu_token_jwt>
```

## Pruebas de Validación

### 1. Crear Pedido con Datos Inválidos

```http
POST http://localhost:3001/api/pedidos
Authorization: Bearer <tu_token_jwt>
Content-Type: application/json

{
  "joya_id": "inexistente",
  "cantidad": -1,
  "total": -100,
  "estado": "invalido",
  "admin_id": 999
}
```

**Respuesta esperada:**
```json
{
  "success": false,
  "message": "Errores de validación",
  "errors": [
    {
      "type": "field",
      "value": "inexistente",
      "msg": "La joya especificada no existe",
      "path": "joya_id",
      "location": "body"
    },
    {
      "type": "field",
      "value": -1,
      "msg": "La cantidad debe ser un número entero positivo mayor a 0",
      "path": "cantidad",
      "location": "body"
    }
  ]
}
```

### 2. Acceso sin Token JWT

```http
GET http://localhost:3001/api/pedidos
```

**Respuesta esperada:**
```json
{
  "message": "No token provided"
}
```

## Verificación de Correos

1. Verifica que se envíe un correo cuando se crea un pedido
2. Verifica que se envíe un correo cuando se actualiza el estado de un pedido
3. Revisa la bandeja de entrada del correo configurado en `ADMIN_EMAIL`

## Comandos de Prueba con cURL

### Obtener Token
```bash
curl -X POST http://localhost:3001/api/usuarios/iniciarsesion \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@example.com", "password": "password123"}'
```

### Crear Pedido
```bash
curl -X POST http://localhost:3001/api/pedidos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <tu_token>" \
  -d '{
    "joya_id": "test123",
    "cantidad": 2,
    "total": 300.00,
    "estado": "pendiente",
    "admin_id": 1
  }'
```

### Listar Pedidos
```bash
curl -X GET http://localhost:3001/api/pedidos \
  -H "Authorization: Bearer <tu_token>"
``` 
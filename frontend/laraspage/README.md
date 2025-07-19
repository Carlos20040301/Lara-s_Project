# Lara's Joyería - Sistema de Gestión Frontend

## 🎨 Descripción

Frontend del sistema de gestión para Lara's Joyería, desarrollado con React, TypeScript y styled-components. El sistema permite gestionar inventario, clientes y ventas de manera eficiente.

## 🚀 Características

- **Autenticación segura** - Solo para administradores y empleados
- **Dashboard interactivo** - Con texto cambiante y estadísticas
- **Gestión de inventario** - CRUD completo de productos
- **Gestión de clientes** - Registro y seguimiento de clientes
- **Sistema de ventas** - Funciona como caja registradora
- **Diseño responsive** - Adaptable a diferentes dispositivos
- **Paleta de colores elegante** - Inspirada en joyería

## 🛠️ Tecnologías Utilizadas

- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Styled Components** - CSS-in-JS
- **React Router** - Navegación entre páginas
- **Axios** - Cliente HTTP para API

## 📦 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Instalar dependencias adicionales:**
```bash
npm install react-router-dom axios styled-components @types/styled-components react-icons
```

3. **Configurar variables de entorno:**
Crear archivo `.env` en la raíz del proyecto:
```env
REACT_APP_API_URL=http://localhost:3001/api
```

## 🚀 Ejecución

### Desarrollo
```bash
npm start
```
El proyecto se ejecutará en `http://localhost:3000`

### Producción
```bash
npm run build
```

## 📱 Páginas del Sistema

### 1. Login (`/login`)
- Autenticación para administradores y empleados
- Validación de credenciales
- Redirección automática al dashboard

### 2. Dashboard (`/dashboard`)
- Bienvenida con texto cambiante
- Botones de acceso rápido a inventario y clientes
- Información de la empresa (Misión, Visión, Objetivo)

### 3. Inventario (`/inventario`)
- Vista de productos en grid
- Modal para agregar nuevos productos
- Gestión de stock y precios
- Carga de imágenes

### 4. Clientes (`/clientes`)
- Tabla de clientes registrados
- Modal para registrar nuevos clientes
- Información completa del cliente

### 5. Ventas (`/ventas`)
- Sistema de caja registradora
- Registro de ventas con detalles completos
- Cálculo automático de totales
- Estados de venta

## 🎨 Paleta de Colores

```css
--primary-gold: #d4af37;      /* Dorado principal */
--secondary-gold: #f4e4bc;    /* Dorado secundario */
--dark-gold: #b8860b;         /* Dorado oscuro */
--light-gold: #fff8dc;        /* Dorado claro */
--accent-bronze: #cd7f32;     /* Bronce */
--text-dark: #2c3e50;         /* Texto oscuro */
--text-light: #7f8c8d;        /* Texto claro */
--white: #ffffff;             /* Blanco */
```

## 🔐 Autenticación

El sistema requiere que el backend esté ejecutándose en `http://localhost:3001` y que existan usuarios con roles `admin` o `empleado`.

### Credenciales de prueba:
```
Email: carlosecastro04@gmail.com
Password: MaTuMa15
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   └── Navbar.tsx      # Barra de navegación
├── context/            # Context API
│   └── AuthContext.tsx # Contexto de autenticación
├── pages/              # Páginas principales
│   ├── Login.tsx       # Página de login
│   ├── Dashboard.tsx   # Dashboard principal
│   ├── Inventario.tsx  # Gestión de inventario
│   ├── Clientes.tsx    # Gestión de clientes
│   └── Ventas.tsx      # Sistema de ventas
├── services/           # Servicios de API
│   └── api.ts          # Configuración de axios
├── styles/             # Estilos globales
│   └── GlobalStyles.ts # Estilos CSS globales
├── types/              # Tipos TypeScript
│   └── index.ts        # Interfaces y tipos
└── App.tsx             # Componente principal
```

## 🔧 Configuración del Backend

Asegúrate de que el backend esté ejecutándose con:

1. **Base de datos MySQL** configurada
2. **Servidor corriendo** en puerto 3001
3. **CORS habilitado** para localhost:3000
4. **Usuarios creados** con roles admin/empleado

## 🐛 Solución de Problemas

### Error de conexión con API
- Verifica que el backend esté ejecutándose
- Revisa la URL en `src/services/api.ts`
- Confirma que CORS esté configurado

### Error de autenticación
- Verifica que existan usuarios en la base de datos
- Confirma que el token JWT se esté enviando correctamente
- Revisa los logs del backend

### Problemas de estilos
- Asegúrate de que styled-components esté instalado
- Verifica que GlobalStyles esté importado en App.tsx

## 📝 Próximas Mejoras

- [ ] Sistema de recuperación de contraseñas
- [ ] Reportes y estadísticas avanzadas
- [ ] Notificaciones en tiempo real
- [ ] Modo oscuro
- [ ] Exportación de datos
- [ ] Filtros avanzados

## 👥 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Realiza tus cambios
4. Envía un pull request

## 📄 Licencia

Este proyecto es parte del sistema de gestión de Lara's Joyería.

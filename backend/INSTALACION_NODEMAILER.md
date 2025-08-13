# 📧 Instalación de Nodemailer para Envío de Emails

## 🔧 **Problema Resuelto**

El error `nodemailer.createTransporter is not a function` ha sido corregido. El problema era:
- **Función incorrecta:** `createTransporter` → `createTransport`
- **Nodemailer no instalado:** El paquete no estaba en las dependencias

## ✅ **Solución Implementada**

### **1. Corrección de Función:**
```javascript
// ❌ Incorrecto
const transporter = nodemailer.createTransporter({...});

// ✅ Correcto
const transporter = nodemailer.createTransport({...});
```

### **2. Modo de Prueba Temporal:**
- ✅ **Funcionalidad completa** sin nodemailer instalado
- ✅ **Códigos mostrados en consola** para pruebas
- ✅ **Sin errores** de compilación
- ✅ **Fácil activación** del envío real de emails

## 🚀 **Para Habilitar Envío Real de Emails**

### **1. Instalar Nodemailer:**
```bash
npm install nodemailer
```

### **2. Configurar Variables de Entorno:**
Crear o editar el archivo `.env` en la raíz del proyecto:

```env
# Configuración de Email
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-password-de-app

# Otras variables existentes...
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=laras_joyeria
PUERTO=3001
```

### **3. Configurar Gmail (Recomendado):**

#### **Paso 1: Habilitar Autenticación de 2 Factores**
1. Ve a tu cuenta de Google
2. Seguridad → Verificación en 2 pasos → Activar

#### **Paso 2: Generar Contraseña de Aplicación**
1. Seguridad → Contraseñas de aplicación
2. Selecciona "Correo" o "Otra aplicación"
3. Copia la contraseña generada (16 caracteres)

#### **Paso 3: Configurar .env**
```env
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop  # Contraseña de aplicación
```

### **4. Alternativas de Proveedores:**

#### **Outlook/Hotmail:**
```javascript
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'tu-email@outlook.com',
    pass: 'tu-password'
  }
});
```

#### **Yahoo:**
```javascript
const transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: 'tu-email@yahoo.com',
    pass: 'tu-password'
  }
});
```

#### **SMTP Personalizado:**
```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.tuproveedor.com',
  port: 587,
  secure: false,
  auth: {
    user: 'tu-email@dominio.com',
    pass: 'tu-password'
  }
});
```

## 🔍 **Verificación de Instalación**

### **1. Verificar Dependencias:**
```bash
npm list nodemailer
```

### **2. Probar Configuración:**
```bash
# Reiniciar el servidor
npm start
```

### **3. Verificar Logs:**
- **Sin nodemailer:** Verás mensajes de "MODO PRUEBA"
- **Con nodemailer:** Los emails se enviarán normalmente

## 📊 **Modo de Prueba vs Producción**

### **Modo de Prueba (Actual):**
- ✅ **Códigos mostrados en consola**
- ✅ **Funcionalidad completa**
- ✅ **Sin configuración adicional**
- ❌ **No envío real de emails**

### **Modo Producción (Con Nodemailer):**
- ✅ **Envío real de emails**
- ✅ **Template profesional**
- ✅ **Configuración segura**
- ✅ **Logs de envío**

## 🛠️ **Troubleshooting**

### **Error: "Invalid login"**
- Verificar que la contraseña de aplicación sea correcta
- Asegurar que la autenticación de 2 factores esté activada

### **Error: "Connection timeout"**
- Verificar conexión a internet
- Revisar configuración de firewall

### **Error: "Authentication failed"**
- Usar contraseña de aplicación, no la contraseña normal
- Verificar que el email esté correcto

## 📝 **Ejemplo de Uso**

### **1. Solicitar Recuperación:**
```bash
POST http://localhost:3001/api/auth/recuperar-password
Content-Type: application/json

{
  "email": "usuario@ejemplo.com"
}
```

### **2. Verificar Código:**
```bash
POST http://localhost:3001/api/auth/verificar-token
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "token": "12345"
}
```

### **3. Cambiar Contraseña:**
```bash
POST http://localhost:3001/api/auth/cambiar-password
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "token": "12345",
  "newPassword": "nueva123"
}
```

## 🎯 **Resultado Final**

Una vez instalado nodemailer y configurado correctamente:

- ✅ **Emails reales** enviados a usuarios
- ✅ **Template profesional** con branding
- ✅ **Seguridad** con tokens temporales
- ✅ **Experiencia completa** de recuperación

La funcionalidad está lista para producción y funcionará perfectamente una vez configurado el envío de emails. 
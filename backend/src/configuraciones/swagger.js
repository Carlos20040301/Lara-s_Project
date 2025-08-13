const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');
require('dotenv').config();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API-Laras Joyeria',
      version: '1.0.0',
      description: 'API para el control y facturacio de Laras Joyeria',
      contact: {
        email: 'larasjoyeria08@gmail.com'
      },
    },
    servers: [
        {
          url: 'http://localhost:'+ process.env.PUERTO +'/api', // URL del servidor
          description: 'Servidor local',
        },
    ],
    components: {
      securitySchemes: {
          BearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT'
          }
      }
    },
    security: [
        {
            BearerAuth: []
        }
    ],
  },
  apis: [`${path.join(__dirname, "../rutas/*.js")}`], // Ruta a los archivos donde están definidas las rutas
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
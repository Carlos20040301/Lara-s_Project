const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.BD_NOMBRE,
  process.env.BD_USUARIO,
  process.env.BD_CONTRASENA,
  {
    host: process.env.BD_HOST,
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;
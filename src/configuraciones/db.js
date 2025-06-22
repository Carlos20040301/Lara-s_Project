const sequelize = require('sequelize');

const db = new sequelize(
    'pulperia',
    'sistemas',
    'Sistemas123.',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false, // Disable logging for cleaner output
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
)

module.exports = db; 
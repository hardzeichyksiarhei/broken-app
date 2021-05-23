const Sequelize = require('sequelize');

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = require('./config');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    port: DB_PORT,
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to DB');
    })
    .catch((error) => {
        console.log(`Error: ${error}`);
    });

module.exports = sequelize;

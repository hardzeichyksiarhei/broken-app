const Sequelize = require('sequelize');

const sequelize = new Sequelize('gamedb', 'postgres', 'ghastb0i', {
    host: 'localhost',
    dialect: 'postgres',
    // port: 5433
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

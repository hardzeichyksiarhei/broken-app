const dotenv = require('dotenv');
const path = require('path');

dotenv.config({
    path: path.join(__dirname, '.env'),
});

module.exports = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT || 4000,
    DB_HOST: process.env.DB_HOST || 'localhost',
    DB_PORT: process.env.DB_PORT || 5432,
    DB_NAME: process.env.DB_NAME || 'gamedb',
    DB_USER: process.env.DB_USER || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD,
};

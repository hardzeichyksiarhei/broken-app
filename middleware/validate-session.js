const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const { JWT_SECRET_KEY } = require('../config');

const User = require('../db').import('../models/user');

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next(); // allowing options as a method for request
    }

    try {
        let sessionToken = req.headers.authorization;
        if (sessionToken && sessionToken.indexOf('Bearer ') === 0) {
            sessionToken = sessionToken.slice(7, sessionToken.length);
        }

        if (!sessionToken) {
            throw new Error('Not authorized to access this resource. Auth token is not supplied');
        }

        const decoded = jwt.verify(sessionToken, JWT_SECRET_KEY);

        if (!decoded || !decoded.id) {
            throw new Error('Not authorized to access this resource. Token is not valid');
        }

        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) throw new Error('Not authorized to access this resource. Token is not valid');

        req.user = user;
        console.log(`User: ${user}`);
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ auth: false, error: error.message });
    }

    return next();
};

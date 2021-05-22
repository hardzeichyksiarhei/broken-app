const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const User = require('../db').import('../models/user');

module.exports = async (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next(); // allowing options as a method for request
    } 
    
    let sessionToken = req.headers.authorization;
    if (sessionToken && sessionToken.indexOf('Bearer ') === 0) {
        sessionToken = sessionToken.slice(7, sessionToken.length)
    }

    if (!sessionToken) {
        return res.status(StatusCodes.UNAUTHORIZED).send({
            auth: false,
            message: "Not authorized to access this resource. Auth token is not supplied"
        });
    }

    try {
        const decoded = jwt.verify(sessionToken, 'lets_play_sum_games_man')

        if (!decoded || !decoded.id) throw new Error('Not authorized to access this resource. Token is not valid');
        
        const user = await User.findOne({ where: { id: decoded.id } });
        if (!user) throw new Error('Not authorized to access this resource. Token is not valid');
        
        req.user = user;
        console.log(`User: ${user}`)
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ auth: false, error: error.message })
    } 

    return next()
}
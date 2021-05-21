var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

var User = require('../db').import('../models/user');

exports.signUp = async (req, res) => {
    try {
        const { full_name, username, password, email } = req.body.user;
        const passwordHash = bcrypt.hashSync(password, 10);
        const user = await User.create({ full_name, username, passwordHash, email, })

        let token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
        return res.status(StatusCodes.CREATED).json({ user, token })
    } catch(error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err.message)
    }
};

exports.signIn = async (req, res) => {
    const {username, password} = req.body.user;
    const user = await User.findOne({ where: { username } })

    if (!user) {
        return res.status(StatusCodes.FORBIDDEN).send({ error: "User not found." })
    }

    const isPasswordMatch = bcrypt.compare(password, user.passwordHash)
    
    if (!isPasswordMatch) {
        return res.status(StatusCodes.BAD_GATEWAY).send({ error: "Passwords do not match." })
    }
    
    const sessionToken = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
    return res.json({ user, message: "Successfully authenticated.", sessionToken });
};
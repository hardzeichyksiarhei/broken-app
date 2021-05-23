const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const AppError = require('../classes/appError.class');
const catchErrors = require('../helpers/catchErrors');

const User = require('../db').import('../models/user');

exports.signUp = catchErrors(async (req, res) => {
    const { full_name, username, password, email } = req.body.user;
    const passwordHash = bcrypt.hashSync(password, 10);

    const userCheck = await User.findOne({ where: { username } });
    if (userCheck) {
        throw new AppError(
            'User with provided username already exists',
            StatusCodes.UNAUTHORIZED,
            'USER_ALREADY_EXISTS'
        );
    }

    const user = await User.create({ full_name, username, passwordHash, email });

    let token = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', { expiresIn: 60 * 60 * 24 });
    return res.status(StatusCodes.CREATED).json({ user, token });
});

exports.signIn = catchErrors(async (req, res) => {
    const { username, password } = req.body.user;
    const user = await User.findOne({ where: { username } });

    if (!user) throw new AppError('User not found', StatusCodes.UNAUTHORIZED, 'USER_NOT_FOUND');

    const isPasswordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordMatch) {
        throw new AppError(
            'Passwords do not match',
            StatusCodes.UNAUTHORIZED,
            'PASSWORD_NOT_MATCH'
        );
    }

    const sessionToken = jwt.sign({ id: user.id }, 'lets_play_sum_games_man', {
        expiresIn: 60 * 60 * 24,
    });
    return res.json({ user, message: 'Successfully authenticated', sessionToken });
});

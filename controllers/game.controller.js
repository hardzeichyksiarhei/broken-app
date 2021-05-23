const { StatusCodes } = require('http-status-codes');

const AppError = require('../classes/appError.class');
const catchErrors = require('../helpers/catchErrors');

const Game = require('../db').import('../models/game');

exports.all = catchErrors(async (req, res) => {
    const games = await Game.findAll({ where: { owner_id: req.user.id } });
    return res.status(StatusCodes.OK).json({ games, message: 'Game fetched' });
});

exports.getById = catchErrors(async (req, res) => {
    const game = await Game.findOne({ where: { id: req.params.id, owner_id: req.user.id } });

    if (!game) throw new AppError('Game not found', StatusCodes.NOT_FOUND, 'GAME_NOT_FOUND');

    return res.status(StatusCodes.OK).json({ game, message: 'Game fetched' });
});

exports.create = catchErrors(async (req, res) => {
    const { id: owner_id } = req.user;
    const { title, studio, esrb_rating, user_rating, have_played } = req.body.game;
    const game = await Game.create({
        title,
        owner_id,
        studio,
        esrb_rating,
        user_rating,
        have_played,
    });

    return res.status(StatusCodes.CREATED).json({ game, message: 'Game created' });
});

exports.updateById = catchErrors(async (req, res) => {
    const { id } = req.params;
    const { id: owner_id } = req.user;
    const { title, studio, esrb_rating, user_rating, have_played } = req.body.game;

    const game = await Game.findOne({ where: { id, owner_id } });
    if (!game) throw new AppError('Game not found', StatusCodes.NOT_FOUND, 'GAME_NOT_FOUND');

    await game.update({ title, studio, esrb_rating, user_rating, have_played });

    return res.status(StatusCodes.OK).json({ message: `Game modified with ID: ${id}` });
});

exports.removeById = catchErrors(async (req, res) => {
    const { id } = req.params;
    const { id: owner_id } = req.user;

    const game = await Game.findOne({ where: { id, owner_id } });

    if (!game) throw new AppError('Game not found', StatusCodes.NOT_FOUND, 'GAME_NOT_FOUND');

    await game.destroy();

    return res.status(StatusCodes.OK).json({ message: `Game deleted with ID: ${id}` });
});

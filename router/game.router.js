const router = require('express').Router();

const gameController = require('../controllers/game.controller');

router
    .post('/create', gameController.create)
    .put('/update/:id', gameController.updateById)
    .delete('/remove/:id', gameController.removeById);

router
    .get('/all', gameController.all)
    .get('/:id', gameController.getById);

module.exports = router;
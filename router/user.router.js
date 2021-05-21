const router = require('express').Router();

const userController = require('../controllers/user.controller');

router
    .post('/signup', userController.signUp)
    .post('/signin', userController.signIn);

module.exports = router;
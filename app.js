const express = require('express');

const db = require('./db');

const validateSession = require('./middleware/validate-session');

const userRouter = require('./router/user.router');
const gameRouter = require('./router/game.router');

const PORT = 4000;

const app = express();

db.sync();
app.use(express.json());

app.use('/', (req, res, next) => {
    if (req.originalUrl === '/') {
        res.send('Service is running!');
        return;
    }
    next();
});

app.use('/api/auth', userRouter);

app.use(validateSession);
app.use('/api/game', gameRouter);

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'ERROR';
    err.code = err.code || 'SERVER_ERROR';

    res.status(err.statusCode).json({
        status: err.status,
        code: err.code,
        message: err.message,
    });
});

app.listen(PORT, function () {
    console.log(`App is listening on ${PORT}`);
});

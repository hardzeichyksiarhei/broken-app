const express = require('express');

const db = require('./db');

const validateSession = require('./middleware/validate-session')

const userRouter = require('./router/user.router');
const game = require('./controllers/gamecontroller')

const PORT = 4000

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

app.use(validateSession)
app.use('/api/game', game);

app.listen(PORT, function() {
    console.log(`App is listening on ${PORT}`);
})
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var db = require('./db');
var user = require('./controllers/usercontroller');
var game = require('./controllers/gamecontroller')

const PORT = 4000

db.sync();
app.use(bodyParser.json());

app.use('/', (req, res, next) => {
    if (req.originalUrl === '/') {
        res.send('Service is running!');
        return;
    }
    next();
});

app.use('/api/auth', user);
app.use(require('./middleware/validate-session'))
app.use('/api/game', game);
app.listen(PORT, function() {
    console.log(`App is listening on ${PORT}`);
})
const express = require('express');
const path = require('node:path');
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");

const usersRouter = require('./routes/usersRouter');
const messagesRouter = require('./routes/messagesRouter');
const messagesMiddleware = require("./middlewares/messagesMiddleware");

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: "cats",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false
    }
}));
app.use(flash());
app.use(passport.session());
app.use(express.urlencoded({
    extended: false
}));

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

app.use('/users', usersRouter);
app.use('/messages', messagesRouter);
app.get('/', async (req, res, next) => {
    const messages = await messagesMiddleware.getAllMessages();

    res.render('index', {
        messages
    });
});

app.listen(3000, () => console.log('app listening on port 3000!'));
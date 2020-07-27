const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const session = require('express-session');
var cookieParser = require('cookie-parser');
//Import Routes
const articlesRoute = require('./routes/articles');
const usersRoute = require('./routes/users');

//Middlewares
// support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

//Cookie and session
app.use(cookieParser());
var MemoryStore = session.MemoryStore;
app.use(session({
    name: 'app.sid',
    secret: "1234567890QWERTY",
    resave: false,
    store: new MemoryStore(),
    saveUninitialized: false
}));

//Use route
app.use('/articles', articlesRoute);
app.use('/users', usersRoute);

// app.use('/posts', () => {
//     console.log('This is a middleware running');
// });

//other middleware

//server static files
app.use(express.static(path.join(__dirname, 'public')));
//template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home', {});
});

app.get('/signin', (req, res) => {
    res.render('signin', {});
});

app.get('/signup', (req, res) => {
    res.render('signup', {});
});


app.listen(3000);
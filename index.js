require("dotenv-safe").config()
const express = require('express')
const session = require('express-session')
const app = express()
const path = require('path')

const userRoutes = require('./routes/user')
const loginRoutes = require('./routes/login')
const bodyParser = require('body-parser')


var exphbs = require('express-handlebars');

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/public'))
app.use(session({
    secret: 'itsASecret',
    resave: true,
    saveUninitialized: true
}))

app.get('/', function (req, res) {
    res.render('home', {
        isLogged: req.session.isLogged,
        user: req.session.user,
        email: req.session.email
    })
})

app.get('/login', function (req, res) {
    res.render('login', {
        loginAttemptFail : req.session.loginAttemptFail
    })
})

app.get('/cadastro', function (req, res) {
    res.render('login', {
        funfo: "funcionou caralho"
    })
})

app.use('/api/user', userRoutes)
app.use('/api/auth', loginRoutes)

app.listen(process.env.PORT, function () {
    console.log(`Program running at ${process.env.PORT}`)
})

require("dotenv-safe").config()
const express = require('express')
const session = require('express-session')
const app = express()
const path = require('path')

const userRoutes = require('./routes/user')
const loginRoutes = require('./routes/login')
const bodyParser = require('body-parser')
const db = require('./models')


const exphbs = require('express-handlebars');


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
        preRegistrated: req.session.preRegistrated,
        user: req.session.user,
        email: req.session.email,
        userId: req.session.userId,
    })
})

app.get('/login', function (req, res) {
    res.render('login')
})

app.get('/cadastro', function (req, res) {
    res.render('register')
})

app.get('/trocaSenha/:userId', function (req, res) {
    db.User.findById(req.params.userId, function (err, data) {
        if (data) {
            const { name, email, _id } = data
            res.render("changePass", {
                userId: _id,
                user: name,
                email: email,
                isLogged: req.session.isLogged,
                preRegistrated: req.session.preRegistrated
            })
        }
        else{
            res.send(err)
        }
    })
})

app.use('/api/user', userRoutes)
app.use('/api/auth', loginRoutes)

app.listen(process.env.PORT, function () {
    console.log(`Program running at ${process.env.PORT}`)
})

require("dotenv-safe").config()
const express = require('express')
app = express()

const userRoutes = require('./routes/user')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname +'/public'))

app.get('/', function (req, res) {
    res.sendFile("index.html")
})

app.use('/api/user', userRoutes)

app.listen(process.env.PORT, function() {
    console.log(`Program running at ${process.env.PORT}`)
})

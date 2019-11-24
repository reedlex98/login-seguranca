// connect to mongoose

const mongoose = require('mongoose')
const connectionString = process.env.MONGO_CONNECTION

mongoose.set('debug',true)
mongoose.set('useUnifiedTopology',true)
mongoose.connect(connectionString, {useNewUrlParser: true })
    .then(data => {console.log("working...")})    
    .catch(err => {console.log(err)})

mongoose.Promise = Promise 

module.exports.User = require("./user")
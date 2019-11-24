// Schema
// name 
// completed
// created_date

const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: "Name cannot be blank"
    },
    password: {
        type: String,
        required: "Password cannot be blank"
    },
    email: {
        type: String,
        required: "Email cannot be blank"
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
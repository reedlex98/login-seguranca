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
    accessKey: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: "Email cannot be blank"
    },
    preRegistrated: {
        type: Boolean,
        required: true
    },
    regDate: {
        type: Date,
        required: true
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User
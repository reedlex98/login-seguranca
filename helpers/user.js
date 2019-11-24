const db = require("../models")
const passGen = require('generate-password')
const hasha = require('hasha')

exports.getUser = function (req, res) {
    db.User.find()
        .then(function(user) {
            res.json(user)
        })
        .catch(function (err) {
            res.send(err)
        })
}

exports.getSpecificUser = function(req, res){
    db.User.findById(req.params.userId)
        .then(foundUser => {res.json(foundUser)})
        .catch(err => {res.send(err)})
}

exports.postUser = function(req,res) {
    const userData = req.body

    const password = passGen.generate({
        length: 10,
        numbers: true,
        symbols: true,
        excludeSimilarCharacters: true
    })

    const encryptedPass = hasha(password, {
        algorithm: "sha512"
    })

    userData.password = encryptedPass

    console.log(userData.password)

    db.User.create(userData)
        .then(function (newUser) {
            res.status(201).json(newUser)
        })
        .catch(function (err) {
            console.log(err)
        })
}

// exports.putTodos = function(req, res) {
//     db.Todo.findOneAndUpdate({_id: req.params.todoId}, req.body, {useFindAndModify: false, new:true})
//         .then(function(todo){
//             res.json(todo)
//         })
//         .catch(err => {res.send(err)})   
// }

// exports.deleteTodos = function(req, res) {
//     db.Todo.remove({_id: req.params.todoId})
//         .then(function(todo){
//             res.json({message: "we just deleted it"})
//         })
//         .catch(err => {res.send(err)})   
// }
const db = require("../models")
const hasha = require('hasha')

exports.authUser = function (req, res) {
    const email = req.body.email;
    const password = req.body.password;
    
    const passHash = hasha(password, {
        algorithm: "sha512"
    })

    if (email && password) {

        db.User.findOne({ 'email': email, 'password': passHash }, (err, data) => {
            if(err){
                res.send(err)
            }
            if(data){  
                req.session.isLogged = !data.preRegistrated
                req.session.user = data.name
                req.session.email = data.email
                req.session.userId = data._id
                res.json({ status: "Success", redirect: "/"})
            }
            else{
                res.json({ status: "Nome de usuário ou senha errados"})
            }
        })
    } else {
        res.json({status: 'Os campos não foram preenchidos'});
    }
}

exports.logout = function (req,res) {
    req.session.isLogged = false
    req.session.preRegistrated = false
    req.session.user = null
    req.session.email = null
    res.redirect('/')
}
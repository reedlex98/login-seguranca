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
                console.log(err)
            }
            if(data){  
                req.session.isLogged = !data.preRegistrated
                req.session.loginAttemptFail = false
                req.session.user = data.name
                req.session.email = data.email
                req.session.userId = data._id
                req.session.preRegistrated = data.preRegistrated
                res.redirect('/')
            }
            else{
                req.session.loginAttemptFail = true
                res.redirect('/login')
            }
        })
    } else {
        res.send('Os campos não foram preenchidos');
        res.end();
    }
}

exports.logout = function (req,res) {
    req.session.isLogged = false
    req.session.preRegistrated = false
    req.session.user = null
    req.session.email = null
    res.redirect('/')
}
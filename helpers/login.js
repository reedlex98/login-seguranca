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
                req.session.isLogged = true
                req.session.loginAttemptFail = false
                req.session.user = data.name
                req.session.email = data.email
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
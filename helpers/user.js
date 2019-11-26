const db = require("../models")
const passGen = require('generate-password')
const hasha = require('hasha')
const nodemailer = require('nodemailer')
const passwordValidator = require('password-validator')

exports.getUser = function (req, res) {
    res.render()
}

exports.getSpecificUser = function (req, res) {
    db.User.findById(req.params.userId)
        .then(foundUser => { res.json(foundUser) })
        .catch(err => { res.send(err) })
}

exports.postUser = function (req, res) {
    const userData = req.body
    let userId

    const password = passGen.generate({
        length: 10,
        numbers: true,
        symbols: true,
        excludeSimilarCharacters: true
    })

    const passHash = hasha(password, {
        algorithm: "sha512"
    })

    userData.password = passHash

    db.User.create(userData)
        .then(function (newUser) {
            userId = newUser._id
            res.status(201).json(newUser)
        })
        .catch(function (err) {
            console.log(err)
        })

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    let mailOptions = {
        from: `"Nodemailer Contact" <${process.env.MAIL_USER}>`,
        to: userData.email,
        subject: 'Pré-cadastro',
        text: "Pré-cadastro",
        html: `
            <h1>Pré-cadastro efetuado</h1>
            <p>Você concluiu o pré-cadastro, abaixo estão seus dados, lembrando que a senha é gerada automáticamente por nosso sistema</p>
            <p>Nome de usuário: ${userData.name}</p>
            <p>Senha: ${password}</p>
        `
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    });
}

exports.putTodos = function (req, res) {
    const userData = {}
    const { password, confirmation } = req.body
    const schema = new passwordValidator();

    schema
        .is().min(8)
        .is().min(16)
        .has().symbols()
        .has().numbers()
        .has().letters()
        .has().not().spaces()

    if (password === confirmation) {
        if (schema.validate(password)) {
            
            const passHash = hasha(password, {
                algorithm: "sha512"
            })
            
            userData.password = passHash

            db.Todo.findOneAndUpdate({ _id: req.params.userId }, userData, { useFindAndModify: false, new: true })
                .then(function (user) {
                    res.json(user)
                })
                .catch(err => { res.send(err) })
        }
        else
            res.send("A senha nao atende os requisitos...")
    }
    else
        res.send("As senhas nao sao iguais...")
}

// exports.deleteTodos = function(req, res) {
//     db.Todo.remove({_id: req.params.todoId})
//         .then(function(todo){
//             res.json({message: "we just deleted it"})
//         })
//         .catch(err => {res.send(err)})   
// }
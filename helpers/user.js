const db = require("../models")
const passGen = require('generate-password')
const hasha = require('hasha')
const nodemailer = require('nodemailer')
const passwordValidator = require('password-validator')

exports.postUser = function (req, res) {

    db.User.findOne({ email: req.body.email }, function (err, data) {

        if (data) {
            res.json({ status: "Email já está em uso" })
        }
        else {

            const userData = req.body
            userData.preRegistrated = true

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
            userData.regDate = new Date()

            db.User.create(userData)
                .then(function (newUser) {
                    req.session.userId = newUser._id
                    req.session.preRegistrated = true
                    req.session.isLogged = false
                    req.session.user = newUser.name
                    req.session.email = newUser.email
                    req.session.password = password
                    console.log(newUser)

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
                        from: `"Secure Login" <secure_login@slogin.com>`,
                        to: userData.email,
                        subject: 'Complete o seu cadastro',
                        text: "",
                        html: `
                            <h1>Pré-cadastro efetuado</h1>
                            <p>Você concluiu o pré-cadastro, abaixo estão seus dados, lembrando que a senha é gerada automáticamente por nosso sistema</p>
                            <p>Nome de usuário: ${userData.name}</p>
                            <p><strong style='background-color: darkblue; color: white; padding: 5px'>${password}</strong></p>
                            <h1>Conclua o cadastro!</h1>
                            <p>Para concluir o cadastro, <a href="${process.env.DOMAIN}/login">clique aqui</a> para efetuar o login (use a senha acima). Após logar, clique em "completar cadastro" no canto superior direito da tela</p>
                        `
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                    });

                    res.status(201)
                    res.json({ status: "Success", redirect: "/" })
                })
                .catch(function (err) {
                    res.json({ status: err })
                })
        }
    })


}

exports.recoverPass = function (req, res) {
    const { email } = req.body

    if (email) {
        db.User.findOne({ email }, function (err, data) {
            if (err) {
                res.send(err)
            }
            if (data) {

                if (data.preRegistrated) {
                    res.json({ status: "Email pré-cadastrado, cheque sua caixa de email para completar o cadastro!" })
                }
                else if(data.passRecovering) {
                    res.json({ status: "Já enviamos uma mensagem de recuperação de senha para esse email, cheque sua caixa de entrada!" })
                }
                else{

                    const password = passGen.generate({
                        length: 10,
                        numbers: true,
                        symbols: true,
                        excludeSimilarCharacters: true
                    })


                    const passHash = hasha(password, {
                        algorithm: "sha512"
                    })

                    db.User.findOneAndUpdate({ _id: data._id }, { password: passHash, passRecovering: true }, { useFindAndModify: false, new: true }, function (err, updatedUser) {
                        if (err) {
                            res.send(err)
                        } else {
                            console.log(updatedUser)

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
                                from: `"Secure Login" <secure_login@slogin.com>`,
                                to: data.email,
                                subject: "Recuperação de senha",
                                text: "",
                                html: `
                                    <h1>Recuperação de senha</h1>
                                    <p>Ola, ${data.name}</p>
                                    <p> Você solicitou a recuperação da senha, use essa nova senha para efetuar o login:<br><br><strong style='background-color: darkblue; color: white; padding: 5px'>${password}</strong></p>
                                    <p>Após isso, clique em <strong>"Trocar senha"</strong> no canto superior direito da tela para redefinir sua senha</p>
                                `
                            };

                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    return console.log(error);
                                }
                                console.log('Message sent: %s', info.messageId);
                                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

                            });


                            res.json({ status: "Success" })
                        }
                    })

                }
            }
            else {
                res.json({ status: "Email inexistente!" })
            }
        })
    } else {
        res.json({ status: "Email não foi inserido!" })
    }
}

exports.putUser = function (req, res) {
    const userData = {}
    const { password, confirmation, userId, prevpass } = req.body
    const schema = new passwordValidator();

    schema
        .is().min(8)
        .is().max(16)
        .has().symbols()
        .has().digits()
        .has().letters()
        .has().not().spaces()

    if (password === confirmation) {
        if (schema.validate(password)) {

            const passHash = hasha(password, {
                algorithm: "sha512"
            })

            const prevHash = hasha(prevpass, {
                algorithm: "sha512"
            })

            userData.password = passHash
            userData.preRegistrated = false
            userData.passRecovering = false

            db.User.findOne({ _id: userId }, function (err, userFound) {
                if (err) {
                    res.send(err)
                } else {
                    if (userFound.password === prevHash) {
                        if (passHash !== prevHash) {
                            db.User.findOneAndUpdate({ _id: userId }, userData, { useFindAndModify: false, new: true }, function (err, data) {
                                if (err) {
                                    res.send(err)
                                } else {
                                    req.session.isLogged = true
                                    req.session.preRegistrated = false
                                    req.session.user = data.name
                                    req.session.email = data.email
                                    req.session.userId = data._id
                                    console.log(data)
                                    res.json({ status: "Success", redirect: "/" })
                                }
                            })
                        }
                        else {
                            res.json({ status: "Senha antiga e nova não podem ser iguais!" })
                        }
                    }
                    else {
                        res.json({ status: "Senha antiga está incorreta!" })
                    }
                }
            })

        }
        else {
            res.json({ status: "A senha nao atende os requisitos!" })
        }
    }
    else {
        res.json({ status: "As senhas nao sao iguais!" })
    }
}
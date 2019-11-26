const express = require('express')
const router = express.Router()
const helpers = require("../helpers/login")

router.route('/')
    .post(helpers.authUser)

module.exports = router
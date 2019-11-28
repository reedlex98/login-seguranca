const express = require('express')
const router = express.Router()
const helpers = require("../helpers/login")

router.route('/')
    .post(helpers.authUser)
    .get(helpers.logout)

module.exports = router
const express = require('express')
const router = express.Router()
const helpers = require("../helpers/user")

router.route('/')
    .post(helpers.postUser)

router.route('/:userId')
    .put(helpers.putUser)

module.exports = router
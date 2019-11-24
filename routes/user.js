const express = require('express')
const router = express.Router()
const helpers = require("../helpers/user")

router.route('/')
    .get(helpers.getUser)
    .post(helpers.postUser)

router.route('/:userId')
    .get(helpers.getSpecificUser)
    // .put(helpers.putTodos)
    // .delete(helpers.deleteTodos)

module.exports = router
const express = require('express')
const router = express.Router()



const User = require('../models/user.model')

router.get('/usuarios', (req, res, next) => {

    User
        .find()
        .then(locales => res.json(locales))
        .catch(err => next(err))
})

router.get('/usuarios/:id', (req, res, next) => {
    const userId = req.params.id
    User
        .findById(userId)
        .then(local => res.json(local))
        .catch(err => next(err))
})



module.exports = router
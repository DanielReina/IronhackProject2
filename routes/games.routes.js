const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = require('../models/user.model')
const Game = require('../models/game.model')

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Por favor, inicie sesión para continuar'})
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Por favor, inicie sesión para continuar' })

router.get('/', (req, res, next) => {
    Game
        .find()
        .then(allgames => {
        res.render('games/game-list', {allgames})})
        .catch(err => next(err))
})

router.get('/detalles/:id',ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']), (req, res, next) => {
    const gameId = req.params.id
    Game
        .findById(gameId)
        .then(thegame => res.render('games/game-details', { thegame, user: req.user, isAdmin: req.user.role.includes('ADMIN') }))
        .catch(err => next(err))
})

router.get('/nuevo', ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']), (req, res, next) => res.render('games/game-add'))

router.post('/nuevo', (req, res, next) => {
    const { title, description, developer, rating } = req.body

    Game
        .create({title, description, developer, rating})
        .then(() => res.redirect('/juegos'))
        .catch(err => next(err))
})
router.get('/editar', (req, res, next) => {
    const gameId = req.query.gameId
    Game
        .findById(gameId)
        .then(theGame => res.render('games/game-edit', theGame))
        .catch(err => next(err))
})

router.post('/editar', (req,res, next) => {
    const gameId = req.query.gameId
    const { title, description, developer, rating} = req.body
    Game
        .findByIdAndUpdate(gameId, {title, description, developer, rating})
        .then(() => res.redirect('/juegos'))
        .catch(err => next(err))
})


router.get('/borrar', (req, res, next) => {
    const gameId = req.query.gameId
    Game
        .findByIdAndDelete(gameId)
        .then(() => res.redirect('/juegos'))
        .catch(err => next(err))
})



module.exports = router
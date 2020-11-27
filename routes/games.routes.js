const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = require('../models/user.model')
const Game = require('../models/game.model')
const CDNupload = require('./../configs/cdn-upload.config')

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Por favor, inicie sesión para continuar'})
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Por favor, inicie sesión para continuar' })

router.get('/', (req, res, next) => {
    Game
        .find({}, {title: 1, developer: 1, images:1})
        .then(allgames => {
        res.render('games/game-list', {allgames})})
        .catch(err => next(new Error(err)))
})

router.get('/detalles',ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']), (req, res, next) => {
    const gameId = req.query.gameId
    Game
        .findById(gameId)
        .then(thegame => res.render('games/game-details', { thegame, user: req.user, isAdmin: req.user.role.includes('ADMIN') }))
        .catch(err => next(new Error(err)))
})

router.get('/favoritos', (req, res, next) => {
    const gameId = req.query.gameId
    User
        .findByIdAndUpdate(req.user._id, {$push: {favoriteGames: gameId}}, {new:true})
        .then(() => res.redirect('/perfil'))
        .catch(err => next(new Error(err)))
})

router.get('/editar', (req, res, next) => {
    const gameId = req.query.gameId
    Game
        .findById(gameId)
        .then(theGame => res.render('games/game-edit', theGame))
        .catch(err => next(new Error(err)))
})

router.post('/editar', (req,res, next) => {
    const gameId = req.query.gameId
    const { title, description, developer, rating} = req.body
    Game
        .findByIdAndUpdate(gameId, {title, description, developer, rating})
        .then(() => res.redirect('/juegos'))
        .catch(err => next(new Error(err)))
})

router.get('/borrar', (req, res, next) => {
    const gameId = req.query.gameId
    Game
        .findByIdAndDelete(gameId)
        .then(() => res.redirect('/juegos'))
        .catch(err => next(new Error(err)))
})

router.get('/borrarfavoritos', (req, res, next) => {
    const gameId = req.query.gameId
    User
        .findByIdAndUpdate(req.user._id, {$pull: {favoriteGames: gameId}}, {new:true})
        .then(() => res.redirect('/perfil'))
        .catch(err => next(new Error(err)))
})

router.get('/ventas',ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']), (req, res, next) => {
    const gameId = req.query.gameId
    
    User
        .find({ 'stock.game':{ $all: [`${gameId}`]  } })
        .then(theUsers => res.render('games/sell-games', {theUsers}))
        .catch(err => next(new Error(err)))
})

router.get('/vendedores',ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']), (req, res, next) => {
    const userId = req.query.userId
    User
        .findById(userId)
        .populate('stock.game')
        .then(theVendor => res.render('vendors-profile.hbs', theVendor))
        .catch(err => next(new Error(err)))
})

router.get('/incluir-venta',ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']), (req, res, next) => {
    const gameId = req.query.gameId
    Game
        .findById(gameId)
        .then(theGame => res.render('games/add-sell', theGame))
        .catch(err => next(new Error(err)))
})

router.post('/incluir-venta', (req, res, next) => {
    const gameId = req.query.gameId 
    const {wantsale} = req.body
    Game
        .findByIdAndUpdate(gameId,{$inc: {availableSale: wantsale}}, {new: true})
        .then(theGame => User.findByIdAndUpdate(req.user._id, {$push: {stock: { game:theGame._id, number: wantsale}}}, {new: true}))
        .then(()=> res.redirect("/perfil"))
        .catch(err => next(new Error(err)))
})

router.get('/imagen', ensureAuthenticated, checkRole(['NORMAL', 'ADMIN', 'SHOP']), (req, res) =>  { 
    const gameId = req.query.gameId
    res.render('games/image-game', {gameId})
})    

router.post('/imagen', CDNupload.single('imageFile'), (req, res, next) => {  
    const gameId = req.query.gameId
    Game
        .findByIdAndUpdate(gameId, {images: req.file.path})
        .then(() => res.redirect('/juegos'))
        .catch(err => next(new Error(err)))
})

module.exports = router
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
        .catch(err => next(err))
})

router.get('/detalles',ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']), (req, res, next) => {
    const gameId = req.query.gameId
    Game
        .findById(gameId)
        .then(thegame => res.render('games/game-details', { thegame, user: req.user, isAdmin: req.user.role.includes('ADMIN') }))
        .catch(err => next(err))
})
//añadir a favoritos
router.get('/favoritos', (req, res, next) => {
    const gameId = req.query.gameId
    User
    .findByIdAndUpdate(req.user._id, {$push: {favoriteGames: gameId}}, {new:true})
    .then(() => res.redirect('/perfil'))
    .catch(err => next(err))
})

/*
router.get('/incluir-venta', (req, res, next) => {
    const gameId = req.query.gameId
    let stockNumber = req.user.stock[0].number
    Game
    .findById(gameId)
    .then(game=>{console.log(stockNumber)
    User
    .findByIdAndUpdate(req.user._id, {$push: {stock:{number: stockNumber+1, name: game.title}

    } }, {new:true})
    .then(() =>{ 
        let totalstock=0
        for (let i = 0; i < req.user.stock.length; i++) {
         if(req.user.stock[i].name ===game.title){
totalstock+=req.user.stock[i].number
         }
            
        }
        res.redirect('/perfil')
})
    .catch(err => next(err))
})
})
*/

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

router.get('/borrarfavoritos', (req, res, next) => {
    const gameId = req.query.gameId
    User
    .findByIdAndUpdate(req.user._id, {$pull: {favoriteGames: gameId}}, {new:true})
    .then(() => res.redirect('/perfil'))
    .catch(err => next(err))
})
router.get('/ventas',ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']), (req, res, next) => {
    const gameId = req.query.gameId
    User
        .find({ sellingGames: { $all: [`${gameId}`] } } )
        .then(theUsers => {
            console.log(theUsers )
            res.render('games/sell-games', {theUsers, user: req.user, number: req.user.stock.number })
    })
        .catch(err => next(err))
})

router.get('/vendedores',ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']), (req, res, next) => {
    const userId = req.query.userId
    User
    .findById(userId)
    .populate('sellingGames')
    .then(theVendor => {
        console.log(theVendor)
        res.render('vendors-profile.hbs', theVendor)
})
    .catch(err => next(err))
})

router.get('/incluir-venta',ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']), (req, res, next) => {
    const gameId = req.query.gameId
    Game
        .findById(gameId)
        .then(theGame => res.render('games/add-sell', theGame))
        .catch(err => next(err))
})

router.post('/incluir-venta', (req, res, next) => {
    const gameId = req.query.gameId 
    const {wantsale} = req.body
    Game
        .findById(gameId)
        .then(theGame => {
            User
            .findByIdAndUpdate(req.user.id, {$pull: {stock: { name: theGame.title}}})
            .then(() => User.findByIdAndUpdate(req.user.id, {$push: {stock: {number: wantsale, name: theGame.title}}}))
            .then(() => User.findByIdAndUpdate(req.user.id, {$push: {sellingGames: gameId}}))
            .then(() => res.redirect("/perfil"))
            .catch(err => next(err))
            })
    .catch(err => next(err))
})

router.get('/imagen', ensureAuthenticated, checkRole(['NORMAL', 'ADMIN', 'SHOP']), (req, res) =>  { 
    const gameId = req.query.gameId
    console.log(req.query.gameId)
    res.render('games/image-game', {gameId})
})    
router.post('/imagen', CDNupload.single('imageFile'), (req, res, next) => {  
    const gameId = req.query.gameId
    console.log(req.query.gameId)
    Game
        .findByIdAndUpdate(gameId, {
           images: req.file.path         
        })
        .then(() => {
           
            console.log(req.file.path )
            res.redirect('/juegos')
    })
        .catch(err => next(new Error(err)))
})


module.exports = router
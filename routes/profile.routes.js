const express = require('express')
const router = express.Router()
const CDNupload = require('./../configs/cdn-upload.config')
const User = require("../models/user.model")
const Game = require('../models/game.model')

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' })

router.get('/', ensureAuthenticated, checkRole(['NORMAL', 'ADMIN', 'SHOP']),(req, res) => {
    User
        .findById(req.user._id)
        .populate('sellingGames')
        .populate('favoriteGames')
        .then(userFound => res.render('profile/user-profile', userFound))
        .catch(err => next(err))
})

router.get('/nuevojuego', ensureAuthenticated, checkRole(['NORMAL', 'ADMIN', 'SHOP']), (req, res) =>   res.render('profile/add-game', { user: req.user, allGames: req.user.games }))

router.post('/nuevojuego', (req, res, next) => {
    const { id, title, description, developer, rating, availableSale } = req.body
    
    Game
        .create({ title, description, developer, rating, availableSale })
        .then(newGame => User.findByIdAndUpdate(req.user._id, {$push: {sellingGames: newGame._id}}/*,{$push: {sellingGames: newGame.availableSale}} */))
        .then(()=> res.redirect('/'))
        .catch(err => next(err))
})


router.get('/avatar', ensureAuthenticated, checkRole(['NORMAL', 'ADMIN', 'SHOP']), (req, res) =>   res.render('avatar', { user: req.user }))
    
router.post('/avatar', CDNupload.single('imageFile'), (req, res) => {
  

    User
        .findByIdAndUpdate(req.user.id, {
            avatar: {
                imageName: req.body.imageName,
                path: req.file.path,
                originalName: req.file.originalname
            }           
        })
        .then(() => res.redirect('/'))
        .catch(err => next(new Error(err)))
})


router.get('/ubicacion', ensureAuthenticated, checkRole(['NORMAL', 'ADMIN', 'SHOP']), (req, res) => {
     
    res.render('ubication', { user: req.user })
})
    
router.post('/ubicacion', (req, res, next) => {
   const { latitude, longitude } = req.body

    const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }
    User
        .findByIdAndUpdate(req.user._id, {
            location :   location      
        })
        .then(() => res.redirect('/perfil'))
        .catch(err => next(new Error(err)))
})


router.get('/mapa', ensureAuthenticated, checkRole(['NORMAL', 'ADMIN', 'SHOP']), (req, res) => {
       
    res.render('maps', { user: req.user })
   
 
})

module.exports = router
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
/*
router.post('/nuevojuego', (req, res, next) => {
    const { title, description, developer, rating, availableSale } = req.body
    
    Game
        .create({ title, description, developer, rating, availableSale })
        .then(newGame => User.findByIdAndUpdate(req.user._id, {$push: {sellingGames: newGame._id}}))
        .then(()=> res.redirect('/'))
        .catch(err => next(err))
})*/
router.post("/nuevojuego", (req, res, next) => {

    const { title, description, developer, rating } = req.body

    if (!title || !description || !developer || !rating) {
        res.render("profile/add-game", { errorMsg: "Rellena todos los campos" })
        return
    }
    Game
        .findOne({ title })
        .then(title => {
            if (title) {
                res.render("profile/add-game", { errorMsg: "El juego ya existe" })
                return
            }
            Game
                .create({ title, description, developer, rating })
                .then(() => res.redirect('/iniciar-sesion'))
                .catch(err => {  console.log(title, description, developer, rating, err)
                    res.render("profile/add-game", { errorMsg: "Error, asegurate que todos los campos están rellenados correctamente" })
                })
        })
        .catch(error => next(error))
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
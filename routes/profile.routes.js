const express = require('express')
const router = express.Router()
const CDNupload = require('./../configs/cdn-upload.config')
const User = require("../models/user.model")

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, inicia sesión' })
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Desautorizado, no tienes permisos' })

router.get('/', ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']),(req, res) => {
    
    res.render('profile', { user: req.user })
  
    })

router.get('/avatar', ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']), (req, res) => {
       
    res.render('avatar', { user: req.user })
   
 
})
    
router.post('/avatar', CDNupload.single('imageFile'), (req, res) => {

    User
        .findByIdAndUpdate(req.user.id, {
            avatar: {
                imageName: req.user.avatar.imageName,
                path: req.file.path,
                originalName: req.file.originalname
            }           
        })
        .then(() => res.redirect('/'))
        .catch(err => next(new Error(err)))
})


module.exports = router

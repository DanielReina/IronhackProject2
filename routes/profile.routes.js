const express = require("express")
const router = express.Router()
const passport = require("passport")
const User = require('../models/user.model')
const Game = require('../models/game.model')

const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Por favor, inicie sesión para continuar'})
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Por favor, inicie sesión para continuar' })

router.get('/', ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']),(req, res) =>res.render('profile', { user: req.user, isAdmin: req.user.role.includes('ADMIN') }))

module.exports = router 
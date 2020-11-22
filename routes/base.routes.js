const express = require('express')
const router = express.Router()
const Game = require('../models/game.model')
const User = require('../models/user.model')
const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Por favor, inicie sesión para continuar'})
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Por favor, inicie sesión para continuar' })



// Endpoints
router.get('/', (req, res) => res.render('index'))




module.exports = router

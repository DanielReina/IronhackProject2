  
const express = require('express')
const router = express.Router()
const User = require('../models/user.model')
const transporter = require('../configs/nodemailer.config')
const ensureAuthenticated = (req, res, next) => req.isAuthenticated() ? next() : res.render('auth/login', { errorMsg: 'Por favor, inicie sesión para continuar'})
const checkRole = admittedRoles => (req, res, next) => admittedRoles.includes(req.user.role) ? next() : res.render('auth/login', { errorMsg: 'Por favor, inicie sesión para continuar' })

router.get('/',ensureAuthenticated, checkRole(['NORMAL', 'ADMIN']), (req, res, next) => {
    let vendorsId =req.query.vendorsId
    User
.findById(vendorsId)
.then(vendor => res.render('send-email', vendor))
.catch(err => next(new Error(err)))
})


router.post('/', (req, res) => {

    const { email, subject, message } = req.body
    let vendorsId =req.query.vendorsId
    let userMail = req.user.email
User
.findById(vendorsId)
.then(vendor => 
    transporter
        .sendMail({
            from: userMail,
            to: vendor.email,
            subject,
            text: message,
            html: `<b>${message}</b>`
        }))      
.catch(error => console.log(error))
})


module.exports = router

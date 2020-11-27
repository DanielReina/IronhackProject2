const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

router.get("/registrar", (req, res) => res.render("auth/signup"))

router.post("/registrar", (req, res, next) => {
    const { username, password, name, lastName, email, } = req.body
    if (!username || !password || !email || !name) {
        res.render("auth/signup", { errorMsg: "Rellena todos los campos" })
        return
    }
    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "El usuario ya existe" })
                return
            }
            User
                .findOne({ email })
                .then(userEmail => {
                    if (userEmail) {
                        res.render("auth/signup", { errorMsg: "Este correo ya existe" })
                        return
                    }
                })
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)      
            User
                .create({ username, password: hashPass, name, lastName, email})
                .then(() => res.redirect('/iniciar-sesion'))
                .catch(err => res.render("auth/signup", { errorMsg: "Error, asegurate que todos los campos están rellenados correctamente" }))
        })
        .catch(err => next(new Error(err)))
})

router.get("/iniciar-sesion", (req, res) => res.render("auth/login", { errorMsg: req.flash("error")}))

router.post("/iniciar-sesion", passport.authenticate("local", {
    successRedirect: "/perfil",
    failureRedirect: "/iniciar-sesion",
    failureFlash: true,
    passReqToCallback: true
}
))

router.get('/cerrar-sesion', (req, res) => {
    req.logout()
    res.redirect("/")
})

module.exports = router
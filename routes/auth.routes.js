const express = require("express")
const router = express.Router()
const passport = require("passport")

const User = require("../models/user.model")
const Shop = require("../models/shop.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

// Registro (renderizado formualrio)
router.get("/registrar/empresa", (req, res) => res.render("auth/business-signup"))

router.post("/registrar/empresa", (req, res, next) => {

    const { username, password, name, email, latitude, longitude} = req.body
      const location = {
        type: 'Point',
        coordinates: [latitude, longitude]
    }
    console.log(req.body)

    if (!username || !password || !email || !name) {
        res.render("auth/business-signup", { errorMsg: "Rellena todos los campos" })
        return
    }
    // if (email !== )

    Shop
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/business-signup", { errorMsg: "El usuario ya existe" })
                return
            }
            Shop.findOne({ email })
                .then(userEmail => {
                    if (userEmail) {
                        res.render("auth/business-signup", { errorMsg: "Este correo ya existe" })
                        return
                    }
                })
            // Other validations
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)
          
            
            Shop.create({ username, password: hashPass, name, location, email })
              
                .then(() => res.redirect('/iniciar-sesion'))
                .catch(err => {  
                    res.render("auth/business-signup", { errorMsg: "Error, asegurate que todos los campos están rellenados correctamente" })
                })
            
        })
        

        
        .catch(error => next(error))
})



// Registro (renderizado formualrio)
router.get("/registrar", (req, res) => res.render("auth/signup"))


// Registro (gestión)
router.post("/registrar", (req, res, next) => {

    const { username, password, name, lastName, email, } = req.body
    
      
  

    if (!username || !password || !email || !name) {
        res.render("auth/signup", { errorMsg: "Rellena todos los campos" })
        return
    }
    // if (email !== )

    User
        .findOne({ username })
        .then(user => {
            if (user) {
                res.render("auth/signup", { errorMsg: "El usuario ya existe" })
                return
            }
            User.findOne({ email })
                .then(userEmail => {
                    if (userEmail) {
                        res.render("auth/signup", { errorMsg: "Este correo ya existe" })
                        return
                    }
                })
            // Other validations
            const salt = bcrypt.genSaltSync(bcryptSalt)
            const hashPass = bcrypt.hashSync(password, salt)

         
            
            User.create({ username, password: hashPass, name, lastName, email})
              
                .then(() => res.redirect('/iniciar-sesion'))
                .catch(err => {  console.log(username, password, name, lastName, email, err)
                    res.render("auth/signup", { errorMsg: "Error, asegurate que todos los campos están rellenados correctamente" })
                })
        })
        .catch(error => next(error))
})



// Inicio sesión (renderizado formulario)
router.get("/iniciar-sesion", (req, res) => {
    res.render("auth/login", { errorMsg: req.flash("error") })
   
})


// Inicio sesión (gestión)
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
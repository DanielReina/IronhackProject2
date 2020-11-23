const express = require('express')
const router = express.Router()


const User = require("../models/user.model")

// CDN
const CDNupload = require('./../configs/cdn-upload.config')



router.post('/perfil/avatar', CDNupload.single('imageFile'), (req, res) => {
    const userId = 'asda'
    User
        .findByIdAndUpdate(userId, {
            imageName: req.body.imageName,
            path: req.file.path,
            originalName: req.file.originalname             // multer dota de la propiedad file al objeto request
        })
        .then(() => res.redirect('/gallery'))
        .catch(err => next(new Error(err)))
})


module.exports = router
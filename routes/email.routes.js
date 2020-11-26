  
const express = require('express')
const router = express.Router()

const transporter = require('../configs/nodemailer.config')

router.get('/', (req, res) => res.render('send-email'))

router.post('/', (req, res) => {

    const { email, subject, message } = req.body

    transporter
        .sendMail({
            from: req.user.email,
            to: email,
            subject,
            text: message,
            html: `<b>${message}</b>`
        })
        .then(info => res.send(info))
        .catch(error => console.log(error))
})


module.exports = router

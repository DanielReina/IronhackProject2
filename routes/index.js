module.exports = app => {

    app.use('/', require('./base.routes.js'))
    app.use('/', require('./auth.routes.js'))
    app.use('/perfil', require('./profile.routes.js'))

    // app.use('/', require('./upload.routes.js'))
    

}
module.exports = app => {

    app.use('/', require('./base.routes.js'))
    app.use('/', require('./auth.routes.js'))
    app.use('/juegos', require('./games.routes.js'))
    app.use('/perfil', require('./profile.routes.js'))
    app.use('/api', require('./api.routes.js'))
    app.use('/email', require('./email.routes.js'))
    

}
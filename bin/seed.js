

const mongoose = require('mongoose')

const User = require('../models/user.model')
const Game = require('../models/game.model')

const dbName = 'game-project'
mongoose.connect(`mongodb://localhost/${dbName}`)
User.collection.drop()

const users = [
    {
        username: 'Jose',
        name: 'Jose Antonio',
        lastName: 'Rodriguez',
        email: 'joselito@msn.es',
       password: 'joselito'
    },
]

const games = [
    {
        title: 'Super Smash Bros. Ultimate',
        description: 'Super Smash Bros. Ultimate is a fighting game for up to eight players in which characters from Nintendo games and other third-party franchises must try to knock each other out of an arena. ... The game features 103 different stages included in the base game, with additional ones coming packaged with DLC fighters.',
        developer: 'BANDAI NAMCO Studios',
        images: 'https://andaluciagame.andaluciainformacion.es/wp-content/uploads/2018/11/super-smash-bros-1528841391078_1280w-810x400.jpg',
        rating: 93,
        
    },
]
   

User
    .create(users)
    .then(allUsersCreated => {
        console.log(`Created ${allUsersCreated.length} users`)
        mongoose.connection.close()
    })
    .catch(err => console.log('Hubo un error, users: ', err))

Game
    .create(games)
    .then(allGamesCreated => {
        console.log(`Created ${allGamesCreated.length} games`)
        mongoose.connection.close()
    })
    .catch(err => console.log('Hubo un error, games: ', err))
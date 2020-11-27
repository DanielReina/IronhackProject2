const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,        
    },
     name: {
        type: String,
        required: true,
        default: 'Desconocido',
        set: text => text.charAt(0).toUpperCase()+ text.substring(1)
    },
    lastName: {
        type: String,
        default: 'Desconocido',
        set: text => text.charAt(0).toUpperCase()+ text.substring(1)      
    },
    avatar: {        
        imageName: String,
        path: String,
        originalName: String,      
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        match:/^[^@]+@[^@]+\.[a-zA-Z]{2,}$/ 
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['ADMIN', 'NORMAL'],
        default: 'NORMAL'
    },
    favoriteGames: [{
        type: Schema.Types.ObjectId,
        ref: 'Game'       
    }],
    location: {
        type: {
            type: String
        },
        coordinates: [Number]
    },
    stock:[
        {
        number:{
            type: Number,
            default:0,
            min: 0,
            max: 100
        },
        game:{
            type: Schema.Types.ObjectId,
            ref: 'Game',       
        }
    }]
}, {
    timestamps: true
});

userSchema.index({ location: '2dsphere' }) 
const User = mongoose.model("User", userSchema);

module.exports = User;

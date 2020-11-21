const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const gameSchema = new Schema({
   title: {
        type: String,
        required: true,
        default: 'Desconocido',
        set: text => text.charAt(0).toUpperCase() + text.substring(1) 
    },
    description: {
        type: String,
        required: true,
        default: 'Desconocido',
    },
    developer: {
        type: String,
        required: true,
        default: 'Desconocido',
    },
    images: [String],
    
    rating: {
        type: Number,
        required: true
    },
    available: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

const Game = mongoose.model("Game", gameSchema);

module.exports = Game;

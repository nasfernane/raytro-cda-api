const mongoose = require('mongoose');
const getWeek = require('../utils/getWeek')

const User = require('./userModel');


const feedbackSchema = new mongoose.Schema({
    createdAt: {
        type: String,
        default: `${getWeek(new Date())}-${new Date().getFullYear()}`,
    },
    content: {
        type: String,
        required: [true, `Vous devez détailler votre feedback`],
    },
    category: {
        type: String,
        required: [true, 'Le feedback doit avoir une catégorie'],
        enum: ['like', 'dislike'],
        message: 'Le feedback doit être de type like ou dislike',
    }
})



const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
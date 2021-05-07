const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        required: [true, `Vous devez détailler votre feedback`],
    },
    category: {
        type: String,
        required: [true, 'Le feedback doit avoir une catégorie'],
        enum: ['like', 'unlike'],
        message: 'Le feedback doit être de type like ou unlike',
    }
})


const Feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = Feedback;
// modules
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');

// utilitaires
const AppError = require('../utils/appError');
const getWeek = require('../utils/getWeek');

// modèles
const User = require('../models/userModel');

// récupération des utilisateurs ayant contribués aux feedbacks de la semaine en cours
exports.getWeekContribution = catchAsync(async (req, res, next) => {
    // récupération de la semaine en cours
    const currentWeek = `${getWeek(new Date())}-${new Date().getFullYear()}`;

    // cherche tous les utilisateurs ayant contribué cette semaine
    const users = await User.find({lastFeedback: currentWeek});
    
    // réponse au client
    res.status(201).json({
        status: 'success', 
        data: {
            data: users,
        }
    })
});







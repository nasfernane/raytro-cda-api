// modules
const catchAsync = require('../utils/catchAsync');
const getWeek = require('../utils/getWeek')

// utilitaires
const AppError = require('../utils/appError');

// modèles
const User = require('../models/userModel');
const Feedback = require('../models/feedbackModel');

// création d'un nouveau feedback
exports.create = catchAsync(async (req, res, next) => {
    // récupère les informations dans le corps de la requête
    const doc = await Feedback.create(req.body);

    // retourne le document créé au client
    res.status(201).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
})

// récupération de tous les feedbacks
exports.index = catchAsync(async (req, res, next) => {
    const doc = await Feedback.find();

    res.status(201).json({
        status: 'success', 
        data: {
            data: doc,
        }
    })
})

// récupération des feedbacks de la semaine en cours
exports.currentWeek = catchAsync(async (req, res, next) => {
    // calcul de la semaine en cours
    const currentWeek = `${getWeek(new Date())}-${new Date().getFullYear()}`
    // récupération des documents
    const doc = await Feedback.find({ createdAt: currentWeek});

    // retourne réponse au client
    res.status(201).json({
        status: 'success', 
        data: {
            data: doc,
        }
    })
})

// récupération des feedbacks d'une semaine spécifique
exports.getWeek = catchAsync(async (req, res, next) => {
    // récupère tous les feedbacks de la semaine récupérée en paramètre de la requête
    const doc = await Feedback.find({createdAt : req.params.week});

    // retourne la réponse au client
    res.status(201).json({
        status: 'success', 
        data: {
            data: doc,
        }
    })
})


// modules
const catchAsync = require('../utils/catchAsync');
const getWeek = require('../utils/getWeek')

// utilitaires
const AppError = require('../utils/appError');

// modèles
const User = require('../models/userModel');
const Feedback = require('../models/feedbackModel');

// vérifie si l'utilisateur est admin et si il a participé aux feedbacks de la semaine en cours 
exports.checkAccess = catchAsync(async (req, res, next) => {
    // récupération de la semaine en cours
    const currentWeek = getWeek(new Date());

    // récupération de l'utilisateur connecté
    const user = await User.findById(req.user.id)

    // si l'utilisateur n'a pas participé cette semaine et si il n'est pas admin, refuse l'accès
    if (user.lastFeedback !== currentWeek && user.role !== 'admin') {
        return next(
            new AppError(`Vous n'êtes pas autorisés à constulter ces feedbacks`, 400)
        );
    }

    // sinon, fait suivre la requête
    next();
})

// création d'un nouveau feedback
exports.create = catchAsync(async (req, res, next) => {
    // récupère les informations dans le corps de la requête
    const doc = await Feedback.create(req.body);

    // mise à jour de la dernière participation de l'utilisateur aux feedbacks
    // await User.findByIdAndUpdate(req.user.id, {
    //     lastFeedback: getWeek(new Date()),
    // });

    // rréponse au client
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
    // récupération de la semaine en cours
    const currentWeek = getWeek(new Date());

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


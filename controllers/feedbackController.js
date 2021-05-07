// modules
const catchAsync = require('../utils/catchAsync');

// utilitaires
const AppError = require('../utils/appError');

// modèles
const User = require('../models/userModel');
const Feedback = require('../models/feedbackModel');

exports.create = catchAsync(async (req, res, next) => {
    const doc = await Feedback.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            data: doc,
        },
    });
})


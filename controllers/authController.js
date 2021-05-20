// modules
const catchAsync = require('../utils/catchAsync');
// const crypto = require('crypto');
const jwt = require('jsonwebtoken');
// récupère la méthode promisify du module built-in Util de Node
const { promisify } = require('util');

// utilitaires
const AppError = require('../utils/appError');

// modèles
const User = require('../models/userModel');

// génère le token d'authentification
const signToken = id => 
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,

    });

// création et envoie du token à l'utilisateur
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        // expire dans maintenant + date d'expiration
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: false,
    }

    // option secure seulement en mode production
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    // envoie du cookie
    res.cookie('jwt', token, cookieOptions);

    // enlève le mdp de la réponse à l'utilisateur
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        }
    });
}

// création de compte utilisateur
exports.signup = catchAsync(async (req, res, next) => {
    // alerte l'utilisateur si les mots de passe ne correspondent pas
    if (req.body.password !== req.body.passwordConfirm) {
        return next(new AppError('Vos mots de passe ne correspondent pas', 400))
    }

    // alerte si l'adresse mail est déjà utilisée
    const [existingUser] = await User.find({ email: req.body.email });
    // si on trouve un résultat, refuse la création
    if (typeof existingUser !== 'undefined') {
        return next (new AppError('Cette adresse email est déjà utilisée', 400));
    }
    
 

    // création de l'utilisateur
    const newUser = await User.create({
        // autorise seulement les données nécessaires pour la création de l'utilisateur
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    })

    createSendToken(newUser, 201, res);
})


// connexion utilisateur
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) vérifie si il y a un email et un mot de passe
    if (!email || !password) {
        return next(
            new AppError('Veuillez renseigner votre adresse email et votre mot de passe', 400)
        );
    }

    // 2) vérifie si l'utilisateur existe && si le mot de passe est correct
    const user = await User.findOne({ email }).select('+password');

    // si l'utilisateur n'existe pas || mot de passe incorrect
    if (!user || !(await user.correctPassword(password, user.password))) {
        // return et fait suivre l'erreur
        return next(new AppError('Vos identifiants sont incorrects', 401));
    }

    // 3) Si tout est OK, on envoie la réponse et le token à l'utilisateur
    createSendToken(user, 200, res);
})

// déconnexion de l'utilisateur
exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true,
    });

    res.status(200).json({ status: 'success' });
}

// vérifie que l'utilisateur est connecté
exports.protect = catchAsync(async (req, res, next) => {
    // 1) récupération du token, vérification qu'il existe
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        // accepte également le token via cookies
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    // si le token n'est pas trouvé
    if (!token) {
        return next(
            // renvoie une erreur 401
            new AppError(
                `Vous n'êtes pas identifié.`,
                401
            )
        );
    }

    // 2) vérification du token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) vérification si l'utilisateur existe encore
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next (new AppError(`L'utilisateur lié à cet accès n'existe plus`));
    }

    // 4) procure l'accès à l'itinéraire protégé
    req.user = currentUser;
    res.locals.user = currentUser;
    next();
})

// limite l'accès à certains routes selon le rôle utilisateur
exports.restrictTo = role => (req, res, next) => {
    if (role !== req.user.role) {
        // return et transmet l'erreur 403 (forbidden)
        return next(new AppError(`Vous n'êtes pas autorisé(e) à effectuer cette action.`, 403));
    }

    next();
};
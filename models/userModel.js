// modules
const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');

// création du schéma
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, `Vous devez renseigner un nom d'utilisateur`],
        trim: true,
        maxlength: [30, `Votre nom ne doit pas contenir plus de 30 caractères`],
        minlenght: [6, `Votre nom doit contenir au moins 6 caractères`],
    },
    email: {
        type: String,
        required: [true, `Vous devez renseigner votre adresse e-mail`],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, `Le format de votre adresse mail n'est pas valide`]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, `Vous devez renseigner un mot de passe`],
        minlength: [6, `Votre mot de passe doit contenir au moins 6 caractères`],
        select: false,
    },
    passwordConfirm: {
        type: String,
        validate: {
            // ne fonctiojnne que sur create et save
            validator: function (val) {
                return val === this.password;
            },
            message: `Vos mots de passe ne correspondent pas`
        },
    },  
})

userSchema.pre('save', async function (next) {
    // hashage du mot de passe
    this.password = await bcrypt.hash(this.password, 12);

    // le mot de passe de confirmation n'es t plus nécessaire
    this.passwordConfirm = undefined;

    next();
})

// méthode pour comparer le mot de passe crypté avec la saisie utilisateur
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
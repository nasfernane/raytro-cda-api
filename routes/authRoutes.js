// modules
const express = require('express');
const authController = require('../controllers/authController');


// création du routeur
const router = express.Router();

//// itinéraires
//

// création de compte
router.post('/signup', authController.signup);
// connexion
router.post('/login', authController.login);
// deconnexion
router.post('/logout', authController.logout);

// exporte le module pour app.js
module.exports = router;
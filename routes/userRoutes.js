// modules
const express = require('express');
const userController = require('../controllers/userController');


// création du routeur
const router = express.Router();

//// itinéraires
//

// création de compte
router.post('/signup', userController.signup);
// connexion
router.post('/login', userController.login);
// deconnexion
router.post('/logout', userController.logout);

// exporte le module pour app.js
module.exports = router;
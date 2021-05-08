// modules
const express = require('express');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');


// création du routeur
const router = express.Router();

//// itinéraires
//

// rend la connexion obligatoire en role administrateur pour tous les itinéraires qui suivent
router.use(authController.protect);
router.use(authController.restrictTo('admin'));

// affichage des apprenants ayant contribués aux feedbacks de la semaine en cours
router.get('/contribution', adminController.getWeekContribution);

// exporte le module pour app.js
module.exports = router;
// modules
const express = require('express');
const feedbackController = require('../controllers/feedbackController');
const authController = require('../controllers/authController');

// création du routeur
const router = express.Router();

//// itinéraires
//

// rend la connexion obligatoire pour tous les itinéraires qui suivent
router.use(authController.protect);

// création
router.post('/create', authController.protect, feedbackController.create);
// rend obligatoire la participation à la semaine en cours ou la connexion en tant qu'admin pour accéder aux prochains middlewares
router.use(feedbackController.checkAccess);
// récupération de tous les feedbacks
router.get('/index', feedbackController.index);
// récupération des feedbacks de la semaine en cours
router.get('/currentweek', feedbackController.currentWeek);
// récupération des feedbacks d'une semaine spécifique
router.get('/week/:week', feedbackController.getWeek);

// exporte le module pour app.js
module.exports = router;
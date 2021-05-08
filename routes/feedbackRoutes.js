// modules
const express = require('express');
const feedbackController = require('../controllers/feedbackController');

// création du routeur
const router = express.Router();

//// itinéraires
//

// création
router.post('/create', feedbackController.create);
// récupération de tous les feedbacks
router.get('/index', feedbackController.index);
// récupération des feedbacks de la semaine en cours
router.get('/currentweek', feedbackController.currentWeek);
// récupération des feedbacks d'une semaine spécifique
router.get('/week/:week', feedbackController.getWeek);

// exporte le module pour app.js
module.exports = router;
// modules
const express = require('express');
const feedbackController = require('../controllers/feedbackController');

// création du routeur
const router = express.Router();

//// itinéraires
//

// création
router.post('/create', feedbackController.create);

// exporte le module pour app.js
module.exports = router;
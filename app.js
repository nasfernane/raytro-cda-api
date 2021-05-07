// modules
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');


// routeurs
const userRouter = require('./routes/userRoutes.js');
const feedbackRouter = require('./routes/feedbackRoutes.js');

// création de l'app
const app = express();

// définition des headers http
app.use(helmet({ constentSecurityPolicy: false }));

// middleware qui compresse les réponses aux clients (HTML ou JSON)
app.use(compression());

app.use(express.json({limit: '10kb'}));
app.use(cookieParser());

// routes
app.use('/api/users', userRouter);
app.use('/api/feedbacks', feedbackRouter);

// gestion des routes qui n'existent pas ?
// app.all('*', (req, res, next) => {
    
// })

module.exports = app;
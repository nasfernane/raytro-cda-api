const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');


// ROUTEUR ?

const app = express();

app.use(helmet({ constentSecurityPolicy: false }));

// middleware qui compresse les réponses aux clients (HTML ou JSON)
app.use(compression());

// app.use('/api/users', userRouter);
// app.use('/api/feedbacks', feedbackRouter);

// gestion des routes qui n'existent pas ?
// app.all('*', (req, res, next) => {
    
// })

module.exports = app;
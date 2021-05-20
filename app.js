// modules
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// routeurs
const authRouter = require('./routes/authRoutes.js');
const adminRouter = require('./routes/adminRoutes.js');
const feedbackRouter = require('./routes/feedbackRoutes.js');
const AppError = require('./utils/appError.js');

// création de l'app
const app = express();



// définit pug comme moteur de templating sur Express
app.set('view engine', 'pug');
// définit le chemin d'accès des vues avec path.join pour récupérer le bon dossier quel que soit l'endroit d'où est exécuté l'application. Evite également certains bugs liés à la présence ou non des slashs dans l'url.
app.set('views', path.join(__dirname, 'views'));

// inclusion des fichiers statiques
app.use(express.static(path.join(__dirname, '/public')));

// définition des headers http
const corsOptions = {
    origin : ['http://localhost:4200'],
    optionsSuccessStatus: 200,
    credentials: true,
}

app.use(cors(corsOptions));

app.use(helmet({ 
    constentSecurityPolicy: false,
 }));

// cors: {
//     origin: ["http://localhost:4200/","http://localhost:4200"]
// }

// app.all('*', function(req, res, next) {
//     let origin = req.headers.origin;
//     if(cors.origin.indexOf(origin) >= 0){
//         res.header("Access-Control-Allow-Origin", origin);
//     }         
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });


// middleware qui compresse les réponses aux clients (HTML ou JSON)
app.use(compression());

app.use(express.json({limit: '10kb'}));
app.use(cookieParser());

// routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/feedbacks', feedbackRouter);
app.get('/', function (req, res) {
    res.render('welcome');
})

// gestion des routes qui n'existent pas ?
app.all('*', (req, res, next) => {
    next(new AppError(`Impossible de trouver ${req.originalUrl} sur ce serveur`))
})

module.exports = app;
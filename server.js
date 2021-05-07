// librairie pour modéliser les données, gérer les queries etc
const mongoose = require('mongoose');
// module pour charger les var environnementales
const dotenv = require('dotenv');

// définit chemin de configuration des var env. A garder avant le require app
dotenv.config({ path: './config.env' })

// import de l'application
const app = require('./app');

// récupère l'accès à la base de données
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
console.log(DB);
console.log(process.env.NODE_ENV);

// connexion à la BDD
mongoose.connect(DB, {
    // échappe certains warnings de dépréciation
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}).then(console.log('Connexion à la bdd réussie'));

// définit le port pour heroku ou en local
const port = process.env.PORT || 8000;
// ajout listener pour log le port en cours d'utilisation
const server = app.listen(port, () => {
    console.log(`L'application tourne sur le port ${port} !`)
});



// création d'une classe de gestion des erreurs
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        // récupération et définition du statut
        this.statusCode = statusCode;
        // statuscode = 4xx = fail // 500 = erreur serveur
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        // distinction des erreurs opérationnelles des erreurs de code
        this.isOperational = true;

        // capture de la stack trace pour éviter que l'appel de fonction du constructeur ne pollue le stack
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;
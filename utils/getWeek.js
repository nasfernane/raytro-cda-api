module.exports = (date) => {
    // copie la date pour ne pas modifier l'originale
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));
    // Récupère le premier jour de l'année
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));

    // Calcule le numéro de semaine
    const weekNumber = Math.ceil(( ( (date - yearStart) / 86400000) + 1)/7);

    return weekNumber;
};
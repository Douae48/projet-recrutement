const neo4j = require('neo4j-driver');
require('dotenv').config();


const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER || process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// FONCTION DE TEST IMMÉDIAT
driver.verifyConnectivity()
    .then(() => {
        console.log("🚀 CONNEXION RÉUSSIE : Le serveur parle enfin à AuraDB !");
    })
    .catch(error => {
        console.log("❌ ÉCHEC CRITIQUE DE CONNEXION :");
        console.error(error.message); // C'est ici que l'erreur s'affichera en rouge
    });

module.exports = { driver };


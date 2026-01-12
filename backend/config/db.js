const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USER || process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

driver.verifyConnectivity()
    .then(() => {
        console.log("Connexion Neo4j réussie");
    })
    .catch(error => {
        console.error("Erreur connexion Neo4j:", error.message);
    });

module.exports = { driver };


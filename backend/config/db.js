const neo4j = require('neo4j-driver');
require('dotenv').config();

console.log("⚙️  LOG : Lecture de db.js lancée");

const driver = neo4j.driver(
    process.env.NEO4J_URI,
    neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
);

// On vérifie que l'objet driver est bien créé
if (driver) {
    console.log("✅ LOG : Driver Neo4j créé avec succès");
}

module.exports = driver;
// backend/services/RecommendationService.js
const { driver } = require('../config/db'); // On extrait "driver" de l'objet exporté

const neo4j = require('neo4j-driver'); // On ajoute l'import pour les outils de conversion

const RecommendationService = {
    getRecommendedJobs: async (candidateId) => {
        const session = driver.session();
        try {
            const query = `
                MATCH (c:Candidate {id: $candidateId})-[:HAS_SKILL]->(s:Skill)
                MATCH (s)<-[:REQUIRES_SKILL]-(j:JobOffer {status: 'open'})
                MATCH (j)-[:REQUIRES_SKILL]->(totalSkills:Skill)
                
                WITH j, count(DISTINCT s) AS commonCount, count(DISTINCT totalSkills) AS totalCount
                
                MATCH (rec:Recruiter)-[:POSTED]->(j)
                MATCH (rec)-[:WORKS_AT]->(com:Company)
                
                // On s'assure que le résultat est un entier pour le driver
                RETURN 
                    j.id AS jobId, 
                    j.title AS title, 
                    com.name AS companyName,
                    j.salaryRange AS salary,
                    toInteger(round((toFloat(commonCount) / totalCount) * 100)) AS matchPercentage
                ORDER BY matchPercentage DESC
            `;

            const result = await session.run(query, { candidateId });

            return result.records.map(record => {
                const matchPercentage = record.get('matchPercentage');
                
                return {
                    jobId: record.get('jobId'),
                    title: record.get('title'),
                    companyName: record.get('companyName'),
                    salary: record.get('salary'),
                    // SECURITÉ : On convertit en nombre standard JS que ce soit un Integer Neo4j ou un Number
                    matchScore: neo4j.isInt(matchPercentage) ? matchPercentage.toNumber() : matchPercentage
                };
            });
        } catch (error) {
            console.error("❌ Erreur Cypher:", error.message);
            throw error;
        } finally {
            await session.close();
        }
    },

    getStats: async () => {
        const session = driver.session();
        try {
            const res = await session.run("MATCH (j:JobOffer {status: 'open'}) RETURN count(j) as total");
            const count = res.records[0].get('total');
            return neo4j.isInt(count) ? count.toNumber() : count;
        } finally {
            await session.close();
        }
    }
};

module.exports = RecommendationService;
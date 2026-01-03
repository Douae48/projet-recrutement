// backend/services/RecommendationService.js
const { driver } = require('../config/db');
const neo4j = require('neo4j-driver');

const RecommendationService = {
    getRecommendedJobs: async (candidateId) => {
        const session = driver.session();
        try {
            const query = `
                // 1. On trouve les skills communs entre candidat et jobs ouverts
                MATCH (c:User:Candidate {id: $candidateId})-[:HAS_SKILL]->(s:Skill)
                MATCH (s)<-[:REQUIRES_SKILL]-(j:JobOffer {status: 'open'})
                MATCH (j)-[:REQUIRES_SKILL]->(totalSkills:Skill)
                
                WITH c, j, count(DISTINCT s) AS commonCount, count(DISTINCT totalSkills) AS totalCount
                
                // 2. On récupère les infos de l'entreprise
                MATCH (rec:User:Recruiter)-[:POSTED]->(j)
                MATCH (rec)-[:WORKS_AT]->(com:Company)
                
                // 3. LOGIQUE DE CALCUL + BONUS
                // On calcule le bonus d'expérience (10 si > 5 ans, sinon 0)
                WITH j, com, commonCount, totalCount, 
                     CASE WHEN c.yearsExperience > 5 THEN 10 ELSE 0 END AS experienceBonus
                
                // 4. LOGIQUE DE PLAFONNEMENT
                // On calcule le score brut d'abord
                WITH j, com, (((toFloat(commonCount) / totalCount) * 100) + experienceBonus) AS rawScore
                
                // 5. RÉSULTAT FINAL
                RETURN 
                    j.id AS jobId, 
                    j.title AS title, 
                    com.name AS companyName,
                    j.salaryRange AS salary,
                    // Si le score dépasse 100, on le bloque à 100
                    toInteger(round(CASE WHEN rawScore > 100 THEN 100 ELSE rawScore END)) AS matchPercentage
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
                    matchScore: neo4j.isInt(matchPercentage) ? matchPercentage.toNumber() : matchPercentage
                };
            });
        } catch (error) {
            console.error("❌ Erreur Cypher RecommendationService:", error.message);
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
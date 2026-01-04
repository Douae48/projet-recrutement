// backend/services/RecommendationService.js
const { driver } = require('../config/db');
const neo4j = require('neo4j-driver');

const RecommendationService = {
    getRecommendedJobs: async (candidateId) => {
        const session = driver.session();
        try {
            const query = `
                // 1. On cherche les skills communs (Obligatoire)
                MATCH (c:User:Candidate {id: $candidateId})-[:HAS_SKILL]->(s:Skill)
                MATCH (s)<-[:REQUIRES_SKILL]-(j:JobOffer {status: 'open'})
                
                // 2. On compte le total des skills du job pour le %
                MATCH (j)-[:REQUIRES_SKILL]->(totalSkills:Skill)
                
                WITH j, c, count(DISTINCT s) AS commonCount, count(DISTINCT totalSkills) AS totalCount
                
                // 3. OPTIONAL MATCH : On cherche l'entreprise si elle existe
                // Si elle n'existe pas, la requête ne s'arrête pas (contrairement au MATCH simple)
                OPTIONAL MATCH (rec:User:Recruiter)-[:POSTED]->(j)
                OPTIONAL MATCH (rec)-[:WORKS_AT]->(com:Company)
                
                WITH j, com, commonCount, totalCount,
                     CASE WHEN c.yearsExperience > 5 THEN 10 ELSE 0 END AS experienceBonus
                
                WITH j, com, (((toFloat(commonCount) / totalCount) * 100) + experienceBonus) AS rawScore

                RETURN 
                    j.id AS jobId, 
                    j.title AS title, 
                    coalesce(com.name, "Entreprise non spécifiée") AS companyName,
                    j.salaryRange AS salary,
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
            console.error("❌ Erreur RecommendationService:", error.message);
            throw error;
        } finally {
            await session.close();
        }
    },
    // ... garde tes autres fonctions (getStats, etc.)




    getStats: async () => {
        const session = driver.session();
        try {
            const res = await session.run("MATCH (j:JobOffer {status: 'open'}) RETURN count(j) as total");
            const count = res.records[0].get('total');
            return neo4j.isInt(count) ? count.toNumber() : count;
        } finally {
            await session.close();
        }
    },

    // voir le détail complet dune  offre (description, nom du recruteur, etc.).
  getJobDetails: async (jobId) => {
        const session = driver.session();
        try {
            const query = `
                MATCH (j:JobOffer {id: $jobId})
                // On cherche le recruteur et la boîte, mais sans bloquer si c'est absent
                OPTIONAL MATCH (j)<-[:POSTED]-(r:User:Recruiter)
                OPTIONAL MATCH (r)-[:WORKS_AT]->(com:Company)
                // On récupère les compétences requises
                OPTIONAL MATCH (j)-[:REQUIRES_SKILL]->(s:Skill)
                
                RETURN j, r, com, collect(s.label) AS skills
            `;
            const result = await session.run(query, { jobId });
            
            if (result.records.length === 0) return null;
            
            const record = result.records[0];
            const jobProps = record.get('j').properties;
            const recruiterProps = record.get('r') ? record.get('r').properties : null;
            const companyProps = record.get('com') ? record.get('com').properties : null;

            return {
                ...jobProps,
                recruiterName: recruiterProps ? recruiterProps.firstName : "Non spécifié",
                companyName: companyProps ? companyProps.name : "Entreprise non spécifiée",
                skills: record.get('skills') || []
            };
        } finally {
            await session.close();
        }
    }
};

module.exports = RecommendationService;
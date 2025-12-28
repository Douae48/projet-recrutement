const driver = require('../config/db');

console.log("⚙️  LOG : Lecture de RecommendationService.js lancée");

const RecommendationService = {
    getRecommendedJobs: async (candidateId) => {
        console.log("🔍 LOG : Exécution de getRecommendedJobs pour", candidateId);
        
        const session = driver.session();
        try {
            const query = `
                MATCH (c:Candidate {id: $candidateId})-[:HAS_SKILL]->(s:Skill)
                MATCH (s)<-[:REQUIRES_SKILL]-(j:JobOffer)
                MATCH (rec:Recruiter)-[:POSTED]->(j)
                MATCH (rec)-[:WORKS_AT]->(com:Company)
                RETURN 
                    j.id AS jobId, 
                    j.title AS title, 
                    com.name AS companyName,
                    j.salaryRange AS salary,
                    count(s) AS matchedSkillsCount
                ORDER BY matchedSkillsCount DESC
            `;

            const result = await session.run(query, { candidateId });
            return result.records.map(record => ({
                jobId: record.get('jobId'),
                title: record.get('title'),
                companyName: record.get('companyName'),
                salary: record.get('salary'),
                matchScore: record.get('matchedSkillsCount').toNumber()
            }));
        } catch (error) {
            console.error("❌ LOG : Erreur Cypher :", error.message);
            throw error;
        } finally {
            await session.close();
        }
    }
};

module.exports = RecommendationService;
// backend/services/DataService.js
const { driver } = require('../config/db');

const DataService = {
    // 1. Ajouter une compétence à un candidat (Synchronisé avec ton algo)
    addSkillToCandidate: async (candidateId, skillLabel) => {
        const session = driver.session();
        try {
            await session.run(`
                MATCH (c:User:Candidate {id: $candidateId})
                // On utilise 'label' pour correspondre à ton algo de reco
                MERGE (s:Skill {label: $skillLabel}) 
                ON CREATE SET s.id = randomUUID(), s.category = 'General'
                MERGE (c)-[:HAS_SKILL]->(s)
                RETURN s
            `, { candidateId, skillLabel });
            return { message: `Compétence ${skillLabel} rattachée à votre profil !` };
        } finally {
            await session.close();
        }
    },

    // 2. Créer une offre d'emploi (Pour le Recruteur)
    createJobWithSkills: async (recruiterId, jobData) => {
        const session = driver.session();
        const { title, salaryRange, skills } = jobData;
        try {
            const query = `
                MATCH (r:User:Recruiter {id: $recruiterId})
                CREATE (j:JobOffer {
                    id: randomUUID(), 
                    title: $title, 
                    salaryRange: $salaryRange, 
                    status: 'open',
                    postedAt: date()
                })
                CREATE (r)-[:POSTED]->(j)
                WITH j
                UNWIND $skills AS sLabel
                MERGE (s:Skill {label: sLabel})
                ON CREATE SET s.id = randomUUID(), s.category = 'General'
                MERGE (j)-[:REQUIRES_SKILL]->(s)
                RETURN j
            `;
            await session.run(query, { recruiterId, title, salaryRange, skills });
            return { message: "Offre d'emploi publiée et indexée dans le graphe !" };
        } finally {
            await session.close();
        }
    }
};

module.exports = DataService;
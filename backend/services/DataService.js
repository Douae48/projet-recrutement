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

    // 2. Récupérer les compétences d'un candidat
    getCandidateSkills: async (candidateId) => {
        const session = driver.session();
        try {
            const result = await session.run(`
                MATCH (c:User:Candidate {id: $candidateId})-[:HAS_SKILL]->(s:Skill)
                RETURN s.label AS label
                ORDER BY s.label
            `, { candidateId });
            return result.records.map(record => record.get('label'));
        } finally {
            await session.close();
        }
    },

    // 3. Supprimer une compétence d'un candidat
    removeSkillFromCandidate: async (candidateId, skillLabel) => {
        const session = driver.session();
        try {
            await session.run(`
                MATCH (c:User:Candidate {id: $candidateId})-[r:HAS_SKILL]->(s:Skill {label: $skillLabel})
                DELETE r
            `, { candidateId, skillLabel });
            return { message: `Compétence ${skillLabel} retirée de votre profil.` };
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
    },

    // 5. Récupérer le profil complet d'un utilisateur
    getUserProfile: async (userId) => {
        const session = driver.session();
        try {
            const result = await session.run(`
                MATCH (u:User {id: $userId})
                OPTIONAL MATCH (u)-[:HAS_SKILL]->(s:Skill)
                RETURN u.id AS id, u.name AS name, u.email AS email, 
                       labels(u) AS roles, collect(s.label) AS skills
            `, { userId });
            
            if (result.records.length === 0) {
                throw new Error('Utilisateur non trouvé');
            }
            
            const record = result.records[0];
            return {
                id: record.get('id'),
                name: record.get('name'),
                email: record.get('email'),
                roles: record.get('roles'),
                skills: record.get('skills').filter(s => s !== null)
            };
        } finally {
            await session.close();
        }
    },

    // 6. Mettre à jour le profil utilisateur
    updateUserProfile: async (userId, updates) => {
        const session = driver.session();
        try {
            const { name, email } = updates;
            await session.run(`
                MATCH (u:User {id: $userId})
                SET u.name = COALESCE($name, u.name),
                    u.email = COALESCE($email, u.email),
                    u.updatedAt = datetime()
                RETURN u
            `, { userId, name, email });
            return { message: 'Profil mis à jour avec succès !' };
        } finally {
            await session.close();
        }
    },

    // 7. Supprimer une offre d'emploi
    deleteJob: async (recruiterId, jobId) => {
        const session = driver.session();
        try {
            // Vérifier que l'offre appartient bien au recruteur
            const checkResult = await session.run(`
                MATCH (r:User:Recruiter {id: $recruiterId})-[:POSTED]->(j:JobOffer {id: $jobId})
                RETURN j
            `, { recruiterId, jobId });
            
            if (checkResult.records.length === 0) {
                throw new Error('Offre non trouvée ou non autorisée');
            }
            
            // Supprimer l'offre et toutes ses relations
            await session.run(`
                MATCH (j:JobOffer {id: $jobId})
                DETACH DELETE j
            `, { jobId });
            
            return { message: 'Offre supprimée avec succès !' };
        } finally {
            await session.close();
        }
    },

    // 8. Mettre à jour une offre d'emploi
    updateJob: async (recruiterId, jobId, updates) => {
        const session = driver.session();
        try {
            const { title, salaryRange, skills } = updates;
            
            // Vérifier que l'offre appartient bien au recruteur
            const checkResult = await session.run(`
                MATCH (r:User:Recruiter {id: $recruiterId})-[:POSTED]->(j:JobOffer {id: $jobId})
                RETURN j
            `, { recruiterId, jobId });
            
            if (checkResult.records.length === 0) {
                throw new Error('Offre non trouvée ou non autorisée');
            }
            
            // Mettre à jour les propriétés de l'offre
            await session.run(`
                MATCH (j:JobOffer {id: $jobId})
                SET j.title = COALESCE($title, j.title),
                    j.salaryRange = COALESCE($salaryRange, j.salaryRange),
                    j.updatedAt = datetime()
                RETURN j
            `, { jobId, title, salaryRange });
            
            // Si des skills sont fournis, mettre à jour les relations
            if (skills && skills.length > 0) {
                // Supprimer les anciennes relations
                await session.run(`
                    MATCH (j:JobOffer {id: $jobId})-[r:REQUIRES_SKILL]->()
                    DELETE r
                `, { jobId });
                
                // Créer les nouvelles relations
                await session.run(`
                    MATCH (j:JobOffer {id: $jobId})
                    UNWIND $skills AS sLabel
                    MERGE (s:Skill {label: sLabel})
                    ON CREATE SET s.id = randomUUID(), s.category = 'General'
                    MERGE (j)-[:REQUIRES_SKILL]->(s)
                `, { jobId, skills });
            }
            
            return { message: 'Offre mise à jour avec succès !' };
        } finally {
            await session.close();
        }
    }
};

module.exports = DataService;
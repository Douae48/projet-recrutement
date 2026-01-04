const DataService = require('../services/DataService');

// --- 1. Ajouter une compétence (Candidat) ---
exports.addSkill = async (req, res) => {
    try {
        // CHANGEMENT : on récupère "label" au lieu de "skillName"
        const { label } = req.body; 
        const candidateId = req.userData.userId;

        if (!req.userData.roles.includes('Candidate')) {
            return res.status(403).json({ message: "Seuls les candidats peuvent faire cela." });
        }

        // On envoie "label" au service de l'étudiante A
        const result = await DataService.addSkillToCandidate(candidateId, label);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 2. Publier une offre d'emploi (Recruteur) ---
exports.postJob = async (req, res) => {
    try {
        const recruiterId = req.userData.userId;
        
        // AJOUT : on récupère "salaryRange" et "postedAt" (si envoyé par le front)
        const { title, company, skills, salaryRange } = req.body;

        if (!req.userData.roles.includes('Recruiter')) {
            return res.status(403).json({ message: "Action réservée aux recruteurs." });
        }

        // On prépare l'objet avec les nouveaux champs pour le service
        const jobData = { 
            title, 
            company, 
            skills, 
            salaryRange, 
            postedAt: new Date().toISOString() // On génère la date automatiquement si besoin
        };

        const result = await DataService.createJobWithSkills(recruiterId, jobData);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
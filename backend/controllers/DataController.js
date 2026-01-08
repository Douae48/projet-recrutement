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

// --- 2. Récupérer les compétences du candidat connecté ---
exports.getMySkills = async (req, res) => {
    try {
        const candidateId = req.userData.userId;

        if (!req.userData.roles.includes('Candidate')) {
            return res.status(403).json({ message: "Seuls les candidats peuvent faire cela." });
        }

        const skills = await DataService.getCandidateSkills(candidateId);
        res.status(200).json({ skills });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 3. Supprimer une compétence du profil ---
exports.removeSkill = async (req, res) => {
    try {
        const { label } = req.body;
        const candidateId = req.userData.userId;

        if (!req.userData.roles.includes('Candidate')) {
            return res.status(403).json({ message: "Seuls les candidats peuvent faire cela." });
        }

        const result = await DataService.removeSkillFromCandidate(candidateId, label);
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

// --- 4. Récupérer le profil complet du candidat ---
exports.getProfile = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const profile = await DataService.getUserProfile(userId);
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 5. Mettre à jour le profil ---
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userData.userId;
        const { name, email } = req.body;
        const result = await DataService.updateUserProfile(userId, { name, email });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 6. Postuler à une offre d'emploi ---
exports.applyToJob = async (req, res) => {
    try {
        const candidateId = req.userData.userId;
        const { jobId } = req.body;

        if (!req.userData.roles.includes('Candidate')) {
            return res.status(403).json({ message: "Seuls les candidats peuvent postuler." });
        }

        const result = await DataService.applyToJob(candidateId, jobId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 7. Récupérer les candidatures du candidat ---
exports.getMyApplications = async (req, res) => {
    try {
        const candidateId = req.userData.userId;

        if (!req.userData.roles.includes('Candidate')) {
            return res.status(403).json({ message: "Seuls les candidats peuvent voir leurs candidatures." });
        }

        const applications = await DataService.getCandidateApplications(candidateId);
        res.status(200).json({ applications });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 8. Supprimer une offre d'emploi (Recruteur) ---
exports.deleteJob = async (req, res) => {
    try {
        const recruiterId = req.userData.userId;
        const { jobId } = req.params;

        if (!req.userData.roles.includes('Recruiter')) {
            return res.status(403).json({ message: "Action réservée aux recruteurs." });
        }

        const result = await DataService.deleteJob(recruiterId, jobId);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 9. Mettre à jour une offre d'emploi (Recruteur) ---
exports.updateJob = async (req, res) => {
    try {
        const recruiterId = req.userData.userId;
        const { jobId } = req.params;
        const { title, salaryRange, skills } = req.body;

        if (!req.userData.roles.includes('Recruiter')) {
            return res.status(403).json({ message: "Action réservée aux recruteurs." });
        }

        const result = await DataService.updateJob(recruiterId, jobId, { title, salaryRange, skills });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
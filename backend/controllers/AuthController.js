const { driver } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- INSCRIPTION ---
exports.register = async (req, res) => {
    const { email, password, name, role } = req.body; // role attendu: 'Candidate' ou 'Recruiter'
    const session = driver.session();

    try {
        // 1. Validation du rôle pour éviter d'injecter n'importe quel label
        if (!['Candidate', 'Recruiter'].includes(role)) {
            return res.status(400).json({ message: "Rôle invalide." });
        }

        // 2. Cryptage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // 3. Création avec Multi-Labels (:User ET :Candidate/Recruiter)
        const query = `
            CREATE (u:User:${role} {
                id: randomUUID(),
                email: $email,
                password: $password,
                name: $name,
                createdAt: datetime()
            }) RETURN u
        `;

        await session.run(query, { email, password: hashedPassword, name });
        res.status(201).json({ message: `Utilisateur ${role} créé avec succès !` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
};

// --- CONNEXION ---
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const session = driver.session();

    try {
        // On récupère l'utilisateur ET ses étiquettes (labels)
        const query = 'MATCH (u:User {email: $email}) RETURN u, labels(u) AS roles';
        const result = await session.run(query, { email });

        if (result.records.length === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const user = result.records[0].get('u').properties;
        const labels = result.records[0].get('roles');

        // Vérification mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Mot de passe incorrect." });

        // On extrait les rôles (on enlève 'User' pour ne garder que Candidate/Recruiter)
        const roles = labels.filter(l => l !== 'User');

        // Création du Token avec les rôles à l'intérieur
        const token = jwt.sign(
            { id: user.id, email: user.email, roles: roles },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({ token, roles, user: { name: user.name } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        await session.close();
    }
};
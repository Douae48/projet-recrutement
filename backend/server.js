const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jobRoutes = require('./routes/JobRoutes');
// Chargement des variables d'environnement
dotenv.config();

const app = express();

// Middlewares de base
app.use(cors()); // Autorise le Frontend à appeler l'API
app.use(express.json()); // Permet de lire le JSON dans les requêtes

// Route de test (Health Check)
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Le serveur backend fonctionne parfaitement !',
        timestamp: new Date()
    });
});
app.use('/api/jobs', jobRoutes);
// Port d'écoute
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur : http://localhost:${PORT}`);
    console.log(`🚀 Route de test disponible sur : http://localhost:${PORT}/api/health`);
});
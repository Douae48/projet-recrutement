require('dotenv').config(); // Toujours en premier !
const express = require('express');
const cors = require('cors');
const jobRoutes = require('./routes/JobRoutes');
const authRoutes = require('./routes/AuthRoutes');
const auth = require('./middlewares/authMiddleware');
const dataRoutes = require('./routes/DataRoutes');
const app = express();

// Middlewares globaux
app.use(cors()); 
app.use(express.json()); 

// --- ROUTES ---

// 1. Routes Publiques (Accessibles par tout le monde)
app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Le serveur backend fonctionne parfaitement !',
        timestamp: new Date()
    });
});
app.use('/api/data', auth, dataRoutes);

// 2. Routes Jobs (certaines sont publiques, certaines protégées)
// L'authentification est gérée individuellement dans JobRoutes.js
app.use('/api/jobs', jobRoutes); 

// --- LANCEMENT ---
const PORT = process.env.PORT || 5000; // On utilise 5000 comme convenu
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur : http://localhost:${PORT}`);
});
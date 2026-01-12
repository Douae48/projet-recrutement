require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jobRoutes = require('./routes/JobRoutes');
const authRoutes = require('./routes/AuthRoutes');
const auth = require('./middlewares/authMiddleware');
const dataRoutes = require('./routes/DataRoutes');
const app = express();

app.use(cors()); 
app.use(express.json()); 

app.use('/api/auth', authRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Le serveur backend fonctionne parfaitement !',
        timestamp: new Date()
    });
});
app.use('/api/data', auth, dataRoutes);
app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur : http://localhost:${PORT}`);
});
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        // On attache les rôles à la requête
        req.userData = { userId: decodedToken.id, roles: decodedToken.roles };
        next();
    } catch (error) {
        res.status(401).json({ message: "Authentification échouée." });
    }
};
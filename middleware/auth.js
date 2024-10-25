const jwt = require('jsonwebtoken');

// Middleware para proteger rutas
const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token'); // O 'Authorization' según tu implementación
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, permiso denegado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user; // Guardar información del usuario en la solicitud
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};

module.exports = authMiddleware;

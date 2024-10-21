
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Obtener el token de los headers
    const token = req.header('x-auth-token');

    // Si no hay token, denegar el acceso
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    // Verificar el token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;  // Guardar usuario en la request
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};

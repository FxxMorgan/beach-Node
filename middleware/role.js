// middleware/role.js

module.exports = function(rolesPermitidos) {
    return function(req, res, next) {
        // Verificar si el rol del usuario está entre los roles permitidos
        if (!rolesPermitidos.includes(req.user.role)) {
            return res.status(403).json({ msg: 'Acceso denegado: No tienes permiso para acceder a esta ruta.' });
        }
        next(); // Continúa a la siguiente función si el rol es permitido
    };
};

// middleware/checkRoleAndPermission.js
const jwt = require('jsonwebtoken');

const checkRoleAndPermission = (rolesPermitidos, module, action) => {
    return (req, res, next) => {
        const token = req.header('x-auth-token');
        if (!token) {
            console.log('No hay token'); // Debug
            return res.status(401).json({ msg: 'No hay token, permiso denegado' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;

            console.log('Usuario decodificado:', req.user); // Debug

            // Verificar si el rol está permitido
            if (!rolesPermitidos.includes(req.user.role)) {
                console.log('Rol no permitido:', req.user.role); // Debug
                return res.status(403).json({ msg: 'Acceso denegado: No tienes el rol requerido.' });
            }

            // Verificar permisos específicos (módulo y acción)
            if (
                req.user.permissions &&
                req.user.permissions[module] &&
                req.user.permissions[module][action]
            ) {
                console.log('Permiso permitido para:', action, 'en', module); // Debug
                next(); // Acceso permitido
            } else {
                console.log('Permiso denegado para:', action, 'en', module); // Debug
                res.status(403).json({ msg: `Permiso denegado para ${action} en ${module}` });
            }
        } catch (err) {
            console.error(err);
            res.status(401).json({ msg: 'Token no válido' });
        }
    };
};

module.exports = checkRoleAndPermission;

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User'); 
const router = express.Router();


// Registro de usuario
router.post('/register', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Incluye un email válido').isEmail(),
    check('password', 'El password debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('permissions', 'Los permisos son obligatorios').isObject() // Validar que permissions sea un objeto
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role, permissions } = req.body; // Asegúrate de recibir los permisos también

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'Usuario ya existe' });
        }

        user = new User({
            name,
            email,
            password, // Solo asignar la contraseña sin hashear
            role,
            permissions // Asignar los permisos al nuevo usuario
        });
        

        await user.save();
        
        const payload = { user: { id: user.id, role: user.role } }; // Incluye el ID y el rol
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token }); // Devuelve el token
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Login de usuario
router.post('/login', [
    check('email', 'Incluye un email válido').isEmail(),
    check('password', 'La contraseña es obligatoria').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }

        const payload = { user: { id: user.id, role: user.role } }; // Incluye el ID y el rol
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token }); // Devuelve el token
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;

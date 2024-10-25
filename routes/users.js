const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt'); // Para hashear contraseñas
const auth = require('../middleware/auth');  // Cambia verifyToken a auth

// Rutas de usuarios
router.get('/', async (req, res) => {
    try {
        const users = await User.find().populate('branch');
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener usuarios' });
    }
});

router.post('/', async (req, res) => {
    const { name, email, password, role, branch } = req.body;

    // Validar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ msg: 'El usuario ya existe' });
    }

    try {
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role, branch });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el usuario' });
    }
});

// Ruta para obtener el usuario actual
router.get('/current', auth, async (req, res) => {  // Cambia verifyToken por auth
    try {
        const user = await User.findById(req.user.id).populate('branch');
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }
        res.json({ name: user.name, email: user.email, role: user.role });
    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor' });
    }
});


module.exports = router;

// routes/permisos.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// GET: Obtener todos los usuarios y sus permisos
router.get('/', authMiddleware, async (req, res) => {
    try {
        const users = await User.find().populate('branch', 'name');
        res.json(users);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al obtener permisos de usuarios' });
    }
});

// PUT: Actualizar permisos de un usuario
router.put('/:id', authMiddleware, async (req, res) => {
    const { permissions } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        user.permissions = permissions;
        await user.save();
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Error al actualizar permisos' });
    }
});

module.exports = router;

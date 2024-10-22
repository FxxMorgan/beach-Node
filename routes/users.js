const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Rutas de usuarios
router.get('/', async (req, res) => {
    const users = await User.find().populate('branch');
    res.json(users);
});

router.post('/', async (req, res) => {
    const { name, email, password, role, branch } = req.body;
    const newUser = new User({ name, email, password, role, branch });
    await newUser.save();
    res.json(newUser);
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const Gasto = require('../models/Gasto');
const auth = require('../middleware/auth');

// Obtener ventas de cabañas
router.get('/ventas', auth, async (req, res) => {
    try {
        const ventas = await Venta.find({ rubro: 'Cabañas' });
        res.json(ventas);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Obtener gastos de cabañas
router.get('/gastos', auth, async (req, res) => {
    try {
        const gastos = await Gasto.find({ rubro: 'Cabañas' });
        res.json(gastos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
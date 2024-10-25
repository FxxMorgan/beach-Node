const express = require('express');
const router = express.Router();
const Venta = require('../models/Venta');
const Gasto = require('../models/Gasto');
const auth = require('../middleware/auth');

// Obtener ventas de supermercados
router.get('/ventas', auth, async (req, res) => {
    try {
        const ventas = await Venta.find({ rubro: 'Supermercado' });
        res.json(ventas);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

// Obtener gastos de supermercados
router.get('/gastos', auth, async (req, res) => {
    try {
        const gastos = await Gasto.find({ rubro: 'Supermercado' });
        res.json(gastos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;
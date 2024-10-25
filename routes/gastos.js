const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Gasto = require('../models/Gasto');
const auth = require('../middleware/auth');         // Middleware de autenticación
const roleCheck = require('../middleware/role');    // Middleware de verificación de roles

// @route    POST /api/gastos
// @desc     Registrar un gasto
// @access   Private (Solo accesible para roles 'Jefe de Local', 'Encargado' y 'TI')
router.post('/', [
    auth, 
    roleCheck(['Jefe de Local', 'Encargado', 'TI']), // Verificar roles permitidos
    [
        check('local', 'El nombre del local es obligatorio').not().isEmpty(),
        check('monto', 'El monto del gasto debe ser un número').isNumeric(),
        check('tipo', 'El tipo de gasto debe ser Fijo o Variable').isIn(['Fijo', 'Variable']),
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { local, tipo, monto, descripcion } = req.body;

    try {
        const nuevoGasto = new Gasto({
            local,
            tipo,
            monto,
            descripcion,
            registradoPor: req.user.id,  // Usuario que hace el registro
            fecha: new Date(),             // Añadir la fecha actual
        });

        const gasto = await nuevoGasto.save();
        res.json(gasto);
    } catch (err) {
        console.error('Error al registrar el gasto:', err.message);
        res.status(500).send('Error en el servidor');
    }
});

// @route    GET /api/gastos
// @desc     Obtener todos los gastos
// @access   Private (Acceso para todos los roles)
router.get('/', auth, async (req, res) => {
    const { local, tipo } = req.query;

    try {
        let query = {};
        
        // Filtrar por local si se pasa en la query
        if (local) {
            query.local = local;
        }

        // Filtrar por tipo de gasto (fijo o variable)
        if (tipo) {
            query.tipo = tipo;
        }

        // Aquí se incluye el populate
        const gastos = await Gasto.find(query)
            .populate('registradoPor', 'name') // Obtener solo el campo 'name'
            .sort({ fecha: -1 });

        res.json(gastos);
    } catch (err) {
        console.error('Error al obtener los gastos:', err.message);
        res.status(500).send('Error en el servidor');
    }
});

module.exports = router;

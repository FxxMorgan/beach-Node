// routes/gastos.js

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Gasto = require('../models/Gasto');  // Asegúrate de tener el modelo Gasto creado
const auth = require('../middleware/auth');  // Middleware de autenticación

// @route    POST /api/gastos
// @desc     Registrar un gasto
// @access   Private (Protegido por autenticación)
router.post(
  '/',
  [
    auth,
    [
      check('local', 'El nombre del local es obligatorio').not().isEmpty(),
      check('monto', 'El monto del gasto es obligatorio').isNumeric(),
      check('tipo', 'El tipo de gasto es obligatorio').isIn(['Fijo', 'Variable']),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { local, tipo, monto, descripcion, registradoPor } = req.body;

    try {
      const nuevoGasto = new Gasto({
        local,
        tipo,
        monto,
        descripcion,
        registradoPor: req.user.id,  // El usuario que hace el registro
      });

      const gasto = await nuevoGasto.save();
      res.json(gasto);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
  }
);

// @route    GET /api/gastos
// @desc     Obtener todos los gastos, con opción de filtro por local o tipo
// @access   Private
router.get('/', auth, async (req, res) => {
  const { local, tipo } = req.query;

  try {
    let query = {};
    
    // Filtrar por local
    if (local) {
      query.local = local;
    }

    // Filtrar por tipo de gasto
    if (tipo) {
      query.tipo = tipo;
    }

    const gastos = await Gasto.find(query).sort({ fecha: -1 });
    res.json(gastos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;

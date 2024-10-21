// routes/ventas.js

const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Venta = require('../models/Venta');  // Asegúrate de tener el modelo Venta creado
const auth = require('../middleware/auth');  // Middleware de autenticación

// @route    POST /api/ventas
// @desc     Registrar una venta
// @access   Private (Protegido por autenticación)
router.post(
  '/',
  [
    auth,
    [
      check('local', 'El nombre del local es obligatorio').not().isEmpty(),
      check('monto', 'El monto de la venta es obligatorio').isNumeric(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { local, monto, descripcion } = req.body;

    try {
      const nuevaVenta = new Venta({
        local,
        monto,
        descripcion,
        registradoPor: req.user.id,  // El usuario que hace el registro
      });

      const venta = await nuevaVenta.save();
      res.json(venta);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Error en el servidor');
    }
  }
);

// @route    GET /api/ventas
// @desc     Obtener todas las ventas, con opción de filtro por local
// @access   Private
router.get('/', auth, async (req, res) => {
  const { local } = req.query;

  try {
    let query = {};
    
    // Filtrar por local
    if (local) {
      query.local = local;
    }

    const ventas = await Venta.find(query).sort({ fecha: -1 });
    res.json(ventas);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error en el servidor');
  }
});

module.exports = router;

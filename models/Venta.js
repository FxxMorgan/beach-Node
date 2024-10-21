const mongoose = require('mongoose');

const VentaSchema = new mongoose.Schema({
  local: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  descripcion: {
    type: String
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  registradoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Venta', VentaSchema);

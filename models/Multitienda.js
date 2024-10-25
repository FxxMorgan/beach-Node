const mongoose = require('mongoose');

const MultitiendaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  ventas: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Venta'
  }],
  gastos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gasto'
  }],
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Multitienda', MultitiendaSchema);
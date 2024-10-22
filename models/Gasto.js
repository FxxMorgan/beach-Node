const mongoose = require('mongoose');

const GastoSchema = new mongoose.Schema({
  local: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    enum: ['Fijo', 'Variable'],
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

module.exports = mongoose.model('Gasto', GastoSchema);

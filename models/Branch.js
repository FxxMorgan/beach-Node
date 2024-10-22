const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Supermercado', 'Multitienda', 'Ferretería', 'Cabañas']
    }
});

module.exports = mongoose.model('Branch', branchSchema);

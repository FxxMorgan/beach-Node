const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Encargado', 'Jefe de Local', 'TI', 'Dueño'],
        default: 'Encargado'
    },
    assignedLocal: {
        type: String, // El local que tiene asignado el usuario
        required: false
    }
});

module.exports = mongoose.model('User', UserSchema);

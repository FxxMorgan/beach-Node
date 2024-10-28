const mongoose = require('mongoose'); 
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Encargado', 'Jefe de Local', 'TI', 'Dueño'],
        default: 'Encargado',
        index: true
    },
    assignedLocal: {
        type: String,
        required: false
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    permissions: {
            read: { type: Boolean, default: false },
            write: { type: Boolean, default: false },
            delete: { type: Boolean, default: false }
        },
});

// Middleware para hashear la contraseña antes de guardar
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('User', UserSchema);

// Importa el módulo bcrypt
const bcrypt = require('bcrypt');

// La contraseña que deseas comprobar
const password = 'fernandowo'; // Cambia esto por la contraseña que intentaste usar

// El hash de la base de datos para comparar
const hash = '$2b$10$21kUVfODPD4KaNfaOmIiveI4E.DlDwZ1zFYBq9CkERCVF3s68KF.e'; // Reemplaza esto con el hash real de tu base de datos

// Comparar la contraseña con el hash
bcrypt.compare(password, hash, function(err, result) {
    if (err) {
        console.error('Error al comparar contraseñas:', err);
        return;
    }

    if (result) {
        console.log('La contraseña es correcta!');
    } else {
        console.log('La contraseña es incorrecta!');
    }
});

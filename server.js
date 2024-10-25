const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log(err));

// Importar rutas después de conectar a MongoDB
const authRoutes = require('./routes/auth'); // Asegúrate de que esta ruta sea correcta
app.use('/api/auth', authRoutes); // Esto hace que todas las rutas en auth.js comiencen con /api/auth

app.use('/api/ventas', require('./routes/ventas'));  
app.use('/api/gastos', require('./routes/gastos'));  
app.use('/api/sucursales', require('./routes/branch'));
app.use('/api/usuarios', require('./routes/users'));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Configuración del puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

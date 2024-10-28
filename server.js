const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const checkPermission = require('./middleware/checkpermission');
const authMiddleware = require('./middleware/auth'); // Asegúrate de que la ruta sea correcta

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
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.use('/api/ventas', require('./routes/ventas'));  
app.use('/api/gastos', require('./routes/gastos'));  
app.use('/api/sucursales', require('./routes/branch'));
app.use('/api/usuarios', require('./routes/users'));
app.use('/api/permisos', require('./routes/permisos'));

// Ejemplo de ruta protegida usando el middleware de permisos
app.get('/api/administracion', [authMiddleware, checkPermission('admin')], (req, res) => {
    res.json({ msg: 'Acceso concedido a administración' });
});

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

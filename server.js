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

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/ventas', require('./routes/ventas'));  
app.use('/api/gastos', require('./routes/gastos'));  
app.use('/api/sucursales', require('./routes/branch'));
app.use('/api/usuarios', require('./routes/users'));
app.use('/api/supermercados', require('./routes/supermercados'));
app.use('/api/ferreterias', require('./routes/ferreterias'));
app.use('/api/multitiendas', require('./routes/multitiendas'));
app.use('/api/cabanas', require('./routes/cabanas'));

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
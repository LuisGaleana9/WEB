// archivo: index.js

// 1. Importar las librerías
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs'); 

const saltRounds = 10; // Factor de encriptación para las contraseñas

// 2. Configuración inicial
const app = express();
const PORT = 8080;

// 3. Middlewares
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

// 4. Configuración de la base de datos
const pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'dldandld', // <-- RECUERDA PONER TU CONTRASEÑA
    database: 'sistemas_bombeo',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// ... (El resto de la inicialización y rutas de dispositivos se mantiene igual)
// ... (Puedes copiar y pegar tus rutas de /dispositivos aquí si las modificaste)

// ======================================================
//      NUEVAS RUTAS PARA AUTENTICACIÓN DE USUARIOS
// ======================================================

// RUTA: Registrar un nuevo usuario
app.post('/usuarios/register', async (req, res) => {
    // AHORA RECIBIMOS 4 CAMPOS DEL FRONTEND
    const { nombre, apellido, username, password } = req.body;
    if (!nombre || !apellido || !username || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        // ACTUALIZAMOS LA CONSULTA PARA INSERTAR LOS NUEVOS CAMPOS
        const query = "INSERT INTO usuarios (nombre, apellido, username, password) VALUES (?, ?, ?, ?)";
        await pool.query(query, [nombre, apellido, username, hashedPassword]);
        
        res.status(201).json({ mensaje: 'Usuario registrado exitosamente.' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'El nombre de usuario ya existe.' });
        }
        res.status(500).json({ error: 'Error al registrar el usuario.' });
    }
});

app.post('/usuarios/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña requeridos.' });
    }

    try {
        // AHORA PEDIMOS TAMBIÉN EL NOMBRE Y APELLIDO PARA DEVOLVERLOS
        const query = "SELECT id, username, password, nombre, apellido FROM usuarios WHERE username = ?";
        const [users] = await pool.query(query, [username]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const user = users[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }
        
        // DEVOLVEMOS EL OBJETO DE USUARIO COMPLETO (SIN LA CONTRASEÑA)
        res.status(200).json({
            mensaje: 'Login exitoso.',
            user: { 
                id: user.id, 
                username: user.username,
                nombre: user.nombre,
                apellido: user.apellido
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor.' });
    }
});


// ======================================================
//      RUTAS DE DISPOSITIVOS (Mantenemos las que ya tenías)
// ======================================================

// Obtener todos los dispositivos
app.get('/dispositivos', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM dispositivos");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los dispositivos' });
    }
});

// Crear un nuevo dispositivo
app.post('/dispositivos', async (req, res) => {
    try {
        const { nombre, ubicacion, estado, flujo, nivel_agua, presion, potencia } = req.body;
        const query = `INSERT INTO dispositivos (nombre, ubicacion, estado, flujo, nivel_agua, presion, potencia) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await pool.query(query, [nombre, ubicacion, estado, flujo, nivel_agua, presion, potencia]);
        const nuevoDispositivo = { id: result.insertId, ...req.body };
        res.status(201).json(nuevoDispositivo);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el dispositivo' });
    }
});

// Eliminar un dispositivo
app.post('/dispositivos/delete', async (req, res) => {
    try {
        const { id } = req.body;
        await pool.query("DELETE FROM dispositivos WHERE id = ?", [id]);
        res.json({ mensaje: `Dispositivo con ID ${id} eliminado` });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el dispositivo' });
    }
});


// Iniciar el servidor (la función de inicialización de DB ya no es necesaria aquí)
app.listen(PORT, () => {
    console.log(`🚀 Servidor Node.js corriendo en http://localhost:${PORT}`);
});
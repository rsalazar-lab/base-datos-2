const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(cors());
app.use(express.json());

// Reemplaza con tu Connection String de Atlas
const uri = "mongodb+srv://ronar76_db_user:LFvqxTl5T3snOolq@cluster0.mhoiwtn.mongodb.net/";
const client = new MongoClient(uri);

let db, productosCollection, clientesCollection, pedidosCollection;

async function iniciarServidor() {
    await client.connect();
    db = client.db("gventas"); 
    productosCollection = db.collection("productos");
    clientesCollection = db.collection("clientes");
    pedidosCollection = db.collection("pedidos"); 
    
    // IMPORTAR Y USAR LAS NUEVAS RUTAS
    // Le pasamos la instancia de 'db' al archivo rutas_tienda.js
    const rutasTienda = require('./rutas_tienda')(db);
    
    // Le decimos a Express que todas las rutas de ese archivo empiecen con '/api'
    app.use('/api', rutasTienda);
    
    app.listen(3001, () => {
        console.log('Backend corriendo en http://localhost:3001');
    });
}
iniciarServidor();

// READ: Obtener productos (con opción de incluir dados de baja)
app.get('/api/productos', async (req, res) => {
    try {
        // Si el frontend envía ?todos=true, traemos todos. Si no, solo los activos.
        const filtro = req.query.todos === 'true' ? {} : { activo: true };
        const productos = await productosCollection.find(filtro).toArray();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});

// CREATE: Insertar nuevo producto
app.post('/api/productos', async (req, res) => {
    try {
        const nuevoProducto = {
            codigo_sku: req.body.codigo_sku,
            nombre: req.body.nombre,
            precio: parseFloat(req.body.precio),
            stock: parseInt(req.body.stock),
            activo: true // Baja lógica por defecto
        };
        const result = await productosCollection.insertOne(nuevoProducto);
        res.json({ message: 'Producto creado', id: result.insertedId });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear producto' });
    }
});

// UPDATE: Modificación de campos específicos de un registro existente
app.put('/api/productos/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const { precio, stock } = req.body;
        
        await productosCollection.updateOne(
            { _id: id },
            { $set: { 
                precio: parseFloat(precio), 
                stock: parseInt(stock) 
            }}
        );
        res.json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
});

// RESTORE: Revertir la baja lógica
app.put('/api/productos/:id/restaurar', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        await productosCollection.updateOne(
            { _id: id },
            { $set: { activo: true } }
        );
        res.json({ message: 'Producto restaurado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al restaurar producto' });
    }
});

// DELETE: Baja lógica
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        await productosCollection.updateOne(
            { _id: id },
            { $set: { activo: false } }
        );
        res.json({ message: 'Producto dado de baja lógicamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});
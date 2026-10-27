const express = require('express');
const { ObjectId } = require('mongodb');

// Exportamos una función que recibe la base de datos 'db' desde server.js
module.exports = function(db) {
    const router = express.Router();
    
    // Inicializamos las colecciones necesarias para estas rutas
    const productosCollection = db.collection("productos");
    const clientesCollection = db.collection("clientes");
    const pedidosCollection = db.collection("pedidos");

    // READ: Obtener clientes activos
    router.get('/clientes', async (req, res) => {
        try {
            const clientes = await clientesCollection.find({ activo: true }).toArray();
            res.json(clientes);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener clientes' });
        }
    });

    // READ: Obtener todos los pedidos realizados
    router.get('/pedidos', async (req, res) => {
        try {
            // Traemos todos los pedidos registrados en la colección
            const pedidos = await pedidosCollection.find({}).toArray();
            res.json(pedidos);
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los pedidos' });
        }
    });
    
    // CREATE: Registrar un nuevo pedido y descontar stock
    router.post('/pedidos', async (req, res) => {
        try {
            const { cliente_id, items } = req.body;
            let totalPedido = 0;
            const itemsProcesados = [];
            
            for (let item of items) {
                const prodId = new ObjectId(item.producto_id);
                const producto = await productosCollection.findOne({ _id: prodId });
                
                if (!producto || producto.stock < item.cantidad) {
                    return res.status(400).json({ error: `Stock insuficiente para: ${item.producto_id}` });
                }
                
                itemsProcesados.push({
                    producto_id: prodId,
                    nombre: producto.nombre,
                    cantidad: item.cantidad,
                    precio_unitario: producto.precio
                });
                
                totalPedido += (producto.precio * item.cantidad);
            }

            const nuevoPedido = {
                cliente_id: new ObjectId(cliente_id),
                fecha_pedido: new Date(),
                items: itemsProcesados,
                total: totalPedido,
                estado: "completado",
                activo: true
            };
            
            const result = await pedidosCollection.insertOne(nuevoPedido);

            for (let item of itemsProcesados) {
                await productosCollection.updateOne(
                    { _id: item.producto_id },
                    { $inc: { stock: -item.cantidad } } 
                );
            }

            res.json({ message: 'Pedido registrado con éxito', id: result.insertedId });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error interno al procesar el pedido' });
        }
    });

    return router;
};
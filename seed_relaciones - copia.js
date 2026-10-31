const { MongoClient } = require('mongodb');

// Tu Connection String correcta (sin corchetes)
const uri = "mongodb+srv://ronar76_db_user:LFvqxTl5T3snOolq@cluster0.mhoiwtn.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function inicializarBaseDeDatos() {
    try {
        await client.connect();
        console.log("🌐 Conectado exitosamente a MongoDB Atlas...");
        
        const db = client.db("gventas");
        const productosCollection = db.collection("productos");
        const clientesCollection = db.collection("clientes");
        const pedidosCollection = db.collection("pedidos");

        // 0. LIMPIEZA: Borramos los datos anteriores para no tener duplicados al correr el script varias veces
        console.log("🧹 Limpiando colecciones anteriores para un inicio fresco...");
        await productosCollection.deleteMany({});
        await clientesCollection.deleteMany({});
        await pedidosCollection.deleteMany({});

        // 1. CREACIÓN DE PRODUCTOS
        console.log("📦 Insertando 15 productos en el catálogo...");
        const listaProductos = [
            { codigo_sku: "TEC-001", nombre: "Teclado Mecánico RGB", precio: 45000, stock: 25, activo: true },
            { codigo_sku: "TEC-002", nombre: "Mouse Gamer Inalámbrico", precio: 25000, stock: 40, activo: true },
            { codigo_sku: "TEC-003", nombre: "Monitor 24 pulgadas FHD", precio: 120000, stock: 15, activo: true },
            { codigo_sku: "TEC-004", nombre: "Auriculares con Micrófono", precio: 35000, stock: 30, activo: true },
            { codigo_sku: "TEC-005", nombre: "Silla Gamer Ergonómica", precio: 180000, stock: 10, activo: true },
            { codigo_sku: "TEC-006", nombre: "Disco Sólido SSD 1TB", precio: 55000, stock: 50, activo: true },
            { codigo_sku: "TEC-007", nombre: "Memoria RAM 16GB DDR4", precio: 42000, stock: 60, activo: true },
            { codigo_sku: "TEC-008", nombre: "Placa de Video RTX 3060", precio: 350000, stock: 8, activo: true },
            { codigo_sku: "TEC-009", nombre: "Gabinete ATX con Vidrio Templado", precio: 65000, stock: 20, activo: true },
            { codigo_sku: "TEC-010", nombre: "Fuente de Alimentación 750W", precio: 50000, stock: 25, activo: true },
            { codigo_sku: "TEC-011", nombre: "Webcam Full HD 1080p", precio: 28000, stock: 35, activo: true },
            { codigo_sku: "TEC-012", nombre: "Micrófono Condensador USB", precio: 48000, stock: 18, activo: true },
            { codigo_sku: "TEC-013", nombre: "Pad Mouse XL", precio: 12000, stock: 100, activo: true },
            { codigo_sku: "TEC-014", nombre: "Adaptador Bluetooth 5.0", precio: 5000, stock: 80, activo: true },
            { codigo_sku: "TEC-015", nombre: "Cable HDMI 2.1 (2 metros)", precio: 8000, stock: 120, activo: true }
        ];
        const resultadoProductos = await productosCollection.insertMany(listaProductos);
        // Extraemos los IDs generados por Mongo para usarlos en los pedidos
        const idsProductos = Object.values(resultadoProductos.insertedIds);

        // 2. CREACIÓN DE CLIENTES
        console.log("👥 Insertando clientes...");
        const listaClientes = [
            { nombre_completo: "Tecnología Paraná S.A.", email: "compras@tecnologiaparana.com.ar", telefono: "+5493435551234", activo: true, fecha_alta: new Date() },
            { nombre_completo: "Juan Pérez", email: "juan.perez@email.com", telefono: "+5493434449876", activo: true, fecha_alta: new Date() }
        ];
        const resultadoClientes = await clientesCollection.insertMany(listaClientes);
        const idsClientes = Object.values(resultadoClientes.insertedIds);

        // 3. CREACIÓN DE PEDIDOS (Relacionando colecciones)
        console.log("🛒 Insertando pedidos y armando relaciones (Linking & Embedding)...");
        const listaPedidos = [
            {
                cliente_id: idsClientes[0], // LINKING al primer cliente
                fecha_pedido: new Date(),
                items: [
                    {
                        producto_id: idsProductos[0], // Referencia
                        nombre: listaProductos[0].nombre, // EMBEDDING
                        cantidad: 2,
                        precio_unitario: listaProductos[0].precio // EMBEDDING
                    },
                    {
                        producto_id: idsProductos[1], // Referencia
                        nombre: listaProductos[1].nombre, // EMBEDDING
                        cantidad: 1,
                        precio_unitario: listaProductos[1].precio // EMBEDDING
                    }
                ],
                total: (listaProductos[0].precio * 2) + (listaProductos[1].precio * 1),
                estado: "completado",
                activo: true
            },
            {
                cliente_id: idsClientes[1], // LINKING al segundo cliente
                fecha_pedido: new Date(),
                items: [
                    {
                        producto_id: idsProductos[2], 
                        nombre: listaProductos[2].nombre, 
                        cantidad: 1,
                        precio_unitario: listaProductos[2].precio 
                    }
                ],
                total: listaProductos[2].precio,
                estado: "pendiente",
                activo: true
            }
        ];
        await pedidosCollection.insertMany(listaPedidos);

        console.log("✅ ¡Proceso finalizado con éxito!");
        console.log("Las 3 colecciones (productos, clientes y pedidos) han sido creadas y relacionadas.");
        
    } catch (error) {
        console.error("❌ Ocurrió un error:", error);
    } finally {
        await client.close();
    }
}

inicializarBaseDeDatos();
const ProductManager = require('../Managers/ProductManager');
const productManager = new ProductManager('src/data/products.json');

module.exports = (io) => {
    io.on('connection', async (socket) => {
        console.log('Cliente conectado');

        // Enviar productos al conectar
        const products = await productManager.getProducts();
        socket.emit('products', products);

        // ✅ Bloque correcto: dentro del evento
        socket.on('createProduct', async (data) => {
            console.log('📥 Recibido nuevo producto del cliente:', data);

            const newProduct = await productManager.addProduct({
                title: data.title,
                description: data.description,
                code: data.code,
                price: Number(data.price),
                stock: Number(data.stock),
                category: data.category,
                status: true,
                thumbnails: []
            });

            const updated = await productManager.getProducts();
            io.emit('products', updated);
        });

        socket.on('deleteProduct', async (id) => {
            await productManager.deleteProduct(parseInt(id));
            const updated = await productManager.getProducts();
            io.emit('products', updated);
        });
    });
};

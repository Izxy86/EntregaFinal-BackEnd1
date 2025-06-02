const fs = require('fs').promises;

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if (error.code === 'ENOENT') return [];
            throw error;
        }
    }

    async saveProducts(products) {
        await fs.writeFile(this.path, JSON.stringify(products, null, 2), 'utf-8');
    }

    async addProduct({ title, description, code, price, status = true, stock, category, thumbnails = [] }) {
        const products = await this.getProducts();
        const newId = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const newProduct = {
            id: newId,
            title,
            description,
            code,
            price,
            status,
            stock,
            category,
            thumbnails
        };

        products.push(newProduct);
        await this.saveProducts(products);
        return newProduct;
    }

    async getProductById(id) {
        const products = await this.getProducts();
        return products.find(p => p.id === id);
    }

    async updateProduct(id, updatedFields) {
        const products = await this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index === -1) return null;

        products[index] = { ...products[index], ...updatedFields, id: products[index].id };
        await this.saveProducts(products);
        return products[index];
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        const filtered = products.filter(p => p.id !== id);
        if (products.length === filtered.length) return false;

        await this.saveProducts(filtered);
        return true;
    }
}

module.exports = ProductManager;


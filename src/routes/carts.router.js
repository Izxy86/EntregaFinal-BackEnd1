const express = require('express');
const router = express.Router();
const CartModel = require('../models/Cart.model');
const ProductModel = require('../models/Product.model');

// POST /api/carts/ - Crear carrito vacío
router.post('/', async (req, res) => {
  try {
    const newCart = await CartModel.create({ products: [] });
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear carrito' });
  }
});

// GET /api/carts/:cid - Traer carrito por ID con populate
router.get('/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// POST /api/carts/:cid/product/:pid - Agregar producto
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const product = await ProductModel.findById(req.params.pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });

    const existing = cart.products.find(p => p.product.equals(product._id));
    if (existing) {
      existing.quantity++;
    } else {
      cart.products.push({ product: product._id });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: 'Error al agregar producto al carrito' });
  }
});

// DELETE /api/carts/:cid/products/:pid - Eliminar producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products = cart.products.filter(p => !p.product.equals(pid));
    await cart.save();

    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    res.status(400).json({ error: 'Error al eliminar producto del carrito' });
  }
});

// PUT /api/carts/:cid - Reemplazar productos del carrito
router.put('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    if (!Array.isArray(products)) {
      return res.status(400).json({ error: 'El body debe incluir un array de productos' });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products = products;
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar el carrito' });
  }
});

// PUT /api/carts/:cid/products/:pid - Actualizar cantidad de un producto
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ error: 'Cantidad inválida' });
    }

    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    const item = cart.products.find(p => p.product.equals(pid));
    if (!item) return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

    item.quantity = quantity;
    await cart.save();

    res.json(cart);
  } catch (error) {
    res.status(400).json({ error: 'Error al actualizar la cantidad del producto' });
  }
});

// DELETE /api/carts/:cid - Vaciar carrito
router.delete('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await CartModel.findById(cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products = [];
    await cart.save();

    res.json({ message: 'Carrito vaciado correctamente' });
  } catch (error) {
    res.status(400).json({ error: 'Error al vaciar el carrito' });
  }
});

module.exports = router;

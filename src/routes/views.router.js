const express = require('express');
const router = express.Router();
const ProductModel = require('../models/Product.model');
const CartModel = require('../models/Cart.model');


router.get('/products', async (req, res) => {
  try {
    const { limit = 5, page = 1, sort, query } = req.query;

    const filter = {};
    if (query) {
      if (query === 'true' || query === 'false') {
        filter.status = query === 'true';
      } else {
        filter.category = query;
      }
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      sort: sort === 'asc' || sort === 'desc' ? { price: sort === 'asc' ? 1 : -1 } : {}
    };

    const result = await ProductModel.paginate(filter, options);

    res.render('products', {
    title: 'Productos',
    products: result.docs, 
    hasPrevPage: result.hasPrevPage,
    hasNextPage: result.hasNextPage,
    prevPage: result.prevPage,
    nextPage: result.nextPage,
    page: result.page
    });

  } catch (error) {
    res.status(500).send('Error al cargar productos');
  }
});

router.get('/products/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid).lean();

    if (!product) {
      return res.status(404).render('404', { message: 'Producto no encontrado' });
    }

    res.render('productDetail', {
      title: product.title,
      product
    });
  } catch (error) {
    res.status(500).send('Error al cargar el producto');
  }
});

router.get('/cart/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).send('Carrito no encontrado');

    res.render('cart', { title: 'Carrito', cart });
  } catch (error) {
    res.status(500).send('Error al mostrar el carrito');
  }
});


// Eliminar producto del carrito
router.post('/cart/:cid/remove/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).send('Carrito no encontrado');

  cart.products = cart.products.filter(p => p.product.toString() !== pid);
  await cart.save();

  res.redirect(`/cart/${cid}`);
});

// Vaciar carrito
router.post('/cart/:cid/clear', async (req, res) => {
  const { cid } = req.params;
  const cart = await CartModel.findById(cid);
  if (!cart) return res.status(404).send('Carrito no encontrado');

  cart.products = [];
  await cart.save();

  res.redirect(`/cart/${cid}`);
});



module.exports = router;

const express = require('express');
const router = express.Router();
const mongoosePaginate = require('mongoose-paginate-v2');
const ProductModel = require('../models/Product.model');


// GET /api/products/
router.get('/', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const filter = {};

    // Filtro por categoría o estado
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

    res.json({
      status: 'success',
      payload: result.docs,
      totalPages: result.totalPages,
      prevPage: result.prevPage,
      nextPage: result.nextPage,
      page: result.page,
      hasPrevPage: result.hasPrevPage,
      hasNextPage: result.hasNextPage,
      prevLink: result.hasPrevPage ? `http://localhost:8080/api/products?page=${result.prevPage}` : null,
      nextLink: result.hasNextPage ? `http://localhost:8080/api/products?page=${result.nextPage}` : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error al obtener productos paginados' });
  }
});


// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});


// POST /api/products/
router.post('/', async (req, res) => {
  try {
    const { title, description, code, price, status, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || price == null || stock == null || !category) {
      return res.status(400).json({ error: 'Campos obligatorios faltantes' });
    }

    const newProduct = await ProductModel.create({
      title, description, code, price, status, stock, category, thumbnails
    });

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
});


// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  try {
    const updatedProduct = await ProductModel.findByIdAndUpdate(req.params.pid, req.body, { new: true });
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});


// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(req.params.pid);
    if (deletedProduct) {
      res.json({ message: 'Producto eliminado' });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch {
    res.status(400).json({ error: 'ID inválido' });
  }
});


module.exports = router;

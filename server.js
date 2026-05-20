import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { products as seedProducts } from './src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'products.db');

async function initDb() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price REAL NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      rating REAL NOT NULL,
      reviews INTEGER NOT NULL,
      likes INTEGER NOT NULL,
      inStock INTEGER NOT NULL,
      stockQuantity INTEGER NOT NULL,
      discount INTEGER NOT NULL
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      paymentMethod TEXT NOT NULL,
      status TEXT NOT NULL,
      shipping REAL NOT NULL,
      total REAL NOT NULL,
      items TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  const row = await db.get('SELECT COUNT(*) AS count FROM products');

  if (!row || row.count === 0) {
    const insert = await db.prepare(`
      INSERT INTO products (
        id, name, description, price, category, image,
        rating, reviews, likes, inStock, stockQuantity, discount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const product of seedProducts) {
      await insert.run(
        product.id,
        product.name,
        product.description,
        product.price,
        product.category,
        product.image,
        product.rating ?? 0,
        product.reviews ?? 0,
        product.likes ?? 0,
        product.inStock ? 1 : 0,
        product.stockQuantity ?? 0,
        product.discount ?? 0
      );
    }

    await insert.finalize();
    console.log(`Seeded database with ${seedProducts.length} products`);
  }

  return db;
}

function normalizeProduct(row) {
  if (!row) return null;
  return {
    ...row,
    inStock: Boolean(row.inStock),
    price: Number(row.price),
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    likes: Number(row.likes),
    stockQuantity: Number(row.stockQuantity),
    discount: Number(row.discount),
  };
}

function normalizeOrder(row) {
  if (!row) return null;
  return {
    ...row,
    shipping: Number(row.shipping),
    total: Number(row.total),
    items: row.items ? JSON.parse(row.items) : [],
    createdAt: row.createdAt,
  };
}

function sanitizeProductBody(body) {
  const stockQuantity = Number(body.stockQuantity) || 0;
  const inStock = typeof body.inStock === 'boolean'
    ? body.inStock
    : stockQuantity > 0;

  return {
    name: String(body.name || '').trim(),
    description: String(body.description || '').trim(),
    price: Number(body.price) || 0,
    category: String(body.category || '').trim(),
    image: String(body.image || '/assets/products/product-1.jpg').trim(),
    rating: Number(body.rating) || 0,
    reviews: Number(body.reviews) || 0,
    likes: Number(body.likes) || 0,
    inStock: inStock ? 1 : 0,
    stockQuantity,
    discount: Number(body.discount) || 0,
  };
}

async function startServer() {
  const db = await initDb();
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('API de productos funcionando. Usa /api/products');
  });

  app.get('/api/products', async (req, res) => {
    const rows = await db.all('SELECT * FROM products ORDER BY id');
    res.json(rows.map(normalizeProduct));
  });

  app.get('/api/products/:id', async (req, res) => {
    const row = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);
    if (!row) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(normalizeProduct(row));
  });

  app.post('/api/products', async (req, res) => {
    const product = sanitizeProductBody(req.body);
    if (!product.name || !product.description || !product.category || !product.price) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const result = await db.run(`
      INSERT INTO products (
        name, description, price, category, image,
        rating, reviews, likes, inStock, stockQuantity, discount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      product.name,
      product.description,
      product.price,
      product.category,
      product.image,
      product.rating,
      product.reviews,
      product.likes,
      product.inStock,
      product.stockQuantity,
      product.discount
    );

    const created = await db.get('SELECT * FROM products WHERE id = ?', result.lastID);
    res.status(201).json(normalizeProduct(created));
  });

  app.put('/api/products/:id', async (req, res) => {
    const existing = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);
    if (!existing) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const fields = {};
    const allowed = ['name','description','price','category','image','rating','reviews','likes','inStock','stockQuantity','discount'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        fields[key] = key === 'inStock' ? (req.body[key] ? 1 : 0) : req.body[key];
      }
    }

    if (Object.keys(fields).length === 0) {
      return res.status(400).json({ message: 'No hay campos para actualizar' });
    }

    const setClause = Object.keys(fields).map((key) => `${key} = ?`).join(', ');
    const values = Object.values(fields);
    values.push(req.params.id);

    await db.run(`UPDATE products SET ${setClause} WHERE id = ?`, values);
    const updated = await db.get('SELECT * FROM products WHERE id = ?', req.params.id);
    res.json(normalizeProduct(updated));
  });

  app.delete('/api/products/:id', async (req, res) => {
    const result = await db.run('DELETE FROM products WHERE id = ?', req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(204).send();
  });

  app.post('/api/orders', async (req, res) => {
    const { customerName, customerEmail, paymentMethod, shipping, total, items } = req.body;
    if (!customerName || !customerEmail || !paymentMethod || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Faltan datos del pedido' });
    }

    const transaction = await db.exec('BEGIN TRANSACTION');
    try {
      for (const item of items) {
        const product = await db.get('SELECT * FROM products WHERE id = ?', item.id);
        if (!product) {
          throw new Error(`Producto no encontrado: ${item.id}`);
        }
        const productStock = Number(product.stockQuantity);
        const quantity = Number(item.quantity) || 0;
        if (quantity > productStock) {
          throw new Error(`No hay stock suficiente para ${product.name}`);
        }
        const newStock = productStock - quantity;
        await db.run('UPDATE products SET stockQuantity = ?, inStock = ? WHERE id = ?', newStock, newStock > 0 ? 1 : 0, item.id);
      }

      const result = await db.run(`
        INSERT INTO orders (
          customerName, customerEmail, paymentMethod, status, shipping, total, items, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        String(customerName).trim(),
        String(customerEmail).trim(),
        String(paymentMethod).trim(),
        'ficticio',
        Number(shipping) || 0,
        Number(total) || 0,
        JSON.stringify(items),
        new Date().toISOString()
      );

      const created = await db.get('SELECT * FROM orders WHERE id = ?', result.lastID);
      await db.exec('COMMIT');
      res.status(201).json(normalizeOrder(created));
    } catch (error) {
      await db.exec('ROLLBACK');
      res.status(400).json({ message: error.message || 'Error al crear el pedido' });
    }
  });

  app.get('/api/orders', async (req, res) => {
    const rows = await db.all('SELECT * FROM orders ORDER BY id DESC');
    res.json(rows.map(normalizeOrder));
  });

  app.get('/api/orders/:id', async (req, res) => {
    const row = await db.get('SELECT * FROM orders WHERE id = ?', req.params.id);
    if (!row) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json(normalizeOrder(row));
  });

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Backend API running on http://localhost:${port}`);
  });
}

startServer().catch((error) => {
  console.error('Error iniciando backend:', error);
  process.exit(1);
});

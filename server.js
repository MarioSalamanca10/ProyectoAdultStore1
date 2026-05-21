import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';
import 'dotenv/config';
import { products as seedProducts } from './src/data/products.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SQLITE_DB_PATH = path.join(__dirname, 'products.db');
const DATABASE_URL = process.env.DATABASE_URL?.trim();
const USE_POSTGRES = Boolean(DATABASE_URL);

let sqliteDb = null;
let postgresPool = null;

async function initSqlite() {
  const db = await open({
    filename: SQLITE_DB_PATH,
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

async function initPostgres() {
  postgresPool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

  await postgresPool.query(`
    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC NOT NULL,
      category TEXT NOT NULL,
      image TEXT NOT NULL,
      rating NUMERIC NOT NULL,
      reviews INTEGER NOT NULL,
      likes INTEGER NOT NULL,
      "inStock" BOOLEAN NOT NULL,
      "stockQuantity" INTEGER NOT NULL,
      discount NUMERIC NOT NULL
    )
  `);

  await postgresPool.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customerName TEXT NOT NULL,
      customerEmail TEXT NOT NULL,
      paymentMethod TEXT NOT NULL,
      status TEXT NOT NULL,
      shipping NUMERIC NOT NULL,
      total NUMERIC NOT NULL,
      items TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  const result = await postgresPool.query('SELECT COUNT(*) AS count FROM products');
  const count = Number(result.rows?.[0]?.count ?? 0);

  if (count === 0) {
    for (const product of seedProducts) {
      await postgresPool.query(
        `INSERT INTO products (
          name, description, price, category, image,
          rating, reviews, likes, "inStock", "stockQuantity", discount
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          product.name,
          product.description,
          product.price,
          product.category,
          product.image,
          product.rating ?? 0,
          product.reviews ?? 0,
          product.likes ?? 0,
          product.inStock ?? true,
          product.stockQuantity ?? 0,
          product.discount ?? 0,
        ]
      );
    }
    console.log(`Seeded Postgres database with ${seedProducts.length} products`);
  }
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
    inStock,
    stockQuantity,
    discount: Number(body.discount) || 0,
  };
}

async function startServer() {
  if (USE_POSTGRES) {
    await initPostgres();
    console.log('Usando PostgreSQL a través de DATABASE_URL');
  } else {
    sqliteDb = await initSqlite();
    console.log('Usando SQLite local en', SQLITE_DB_PATH);
  }

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.send('API de productos funcionando. Usa /api/products');
  });

  app.get('/api/products', async (req, res) => {
    try {
      if (USE_POSTGRES) {
        const result = await postgresPool.query('SELECT * FROM products ORDER BY id');
        res.json(result.rows.map(normalizeProduct));
      } else {
        const rows = await sqliteDb.all('SELECT * FROM products ORDER BY id');
        res.json(rows.map(normalizeProduct));
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      let row;
      if (USE_POSTGRES) {
        const result = await postgresPool.query('SELECT * FROM products WHERE id = $1', [id]);
        row = result.rows[0];
      } else {
        row = await sqliteDb.get('SELECT * FROM products WHERE id = ?', id);
      }
      if (!row) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json(normalizeProduct(row));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/products', async (req, res) => {
    try {
      const product = sanitizeProductBody(req.body);
      if (!product.name || !product.description || !product.category || !product.price) {
        return res.status(400).json({ message: 'Faltan campos obligatorios' });
      }

      if (USE_POSTGRES) {
        const result = await postgresPool.query(
          `INSERT INTO products (
            name, description, price, category, image,
            rating, reviews, likes, "inStock", "stockQuantity", discount
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *`,
          [
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
            product.discount,
          ]
        );
        return res.status(201).json(normalizeProduct(result.rows[0]));
      }

      const result = await sqliteDb.run(`
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
        product.inStock ? 1 : 0,
        product.stockQuantity,
        product.discount
      );
      const created = await sqliteDb.get('SELECT * FROM products WHERE id = ?', result.lastID);
      res.status(201).json(normalizeProduct(created));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put('/api/products/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      let existing;
      if (USE_POSTGRES) {
        const result = await postgresPool.query('SELECT * FROM products WHERE id = $1', [id]);
        existing = result.rows[0];
      } else {
        existing = await sqliteDb.get('SELECT * FROM products WHERE id = ?', id);
      }
      if (!existing) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }

      const fields = {};
      const allowed = ['name','description','price','category','image','rating','reviews','likes','inStock','stockQuantity','discount'];
      for (const key of allowed) {
        if (req.body[key] !== undefined) {
          fields[key] = key === 'inStock' ? Boolean(req.body[key]) : req.body[key];
        }
      }
      if (Object.keys(fields).length === 0) {
        return res.status(400).json({ message: 'No hay campos para actualizar' });
      }

      if (USE_POSTGRES) {
        const setClause = Object.keys(fields).map((key, index) => `"${key}" = $${index + 1}`).join(', ');
        const values = Object.values(fields);
        values.push(id);
        await postgresPool.query(`UPDATE products SET ${setClause} WHERE id = $${values.length}`, values);
        const updated = await postgresPool.query('SELECT * FROM products WHERE id = $1', [id]);
        return res.json(normalizeProduct(updated.rows[0]));
      }

      const setClause = Object.keys(fields).map((key) => `${key} = ?`).join(', ');
      const values = Object.values(fields);
      values.push(id);
      await sqliteDb.run(`UPDATE products SET ${setClause} WHERE id = ?`, values);
      const updated = await sqliteDb.get('SELECT * FROM products WHERE id = ?', id);
      res.json(normalizeProduct(updated));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete('/api/products/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      if (USE_POSTGRES) {
        const result = await postgresPool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
        if (result.rowCount === 0) {
          return res.status(404).json({ message: 'Producto no encontrado' });
        }
        return res.status(204).send();
      }
      const result = await sqliteDb.run('DELETE FROM products WHERE id = ?', id);
      if (result.changes === 0) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/orders', async (req, res) => {
    try {
      const { customerName, customerEmail, paymentMethod, shipping, total, items } = req.body;
      if (!customerName || !customerEmail || !paymentMethod || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Faltan datos del pedido' });
      }

      if (USE_POSTGRES) {
        const client = await postgresPool.connect();
        try {
          await client.query('BEGIN');
          for (const item of items) {
            const productResult = await client.query('SELECT * FROM products WHERE id = $1', [item.id]);
            const product = productResult.rows[0];
            if (!product) {
              throw new Error(`Producto no encontrado: ${item.id}`);
            }
            const productStock = Number(product.stockQuantity);
            const quantity = Number(item.quantity) || 0;
            if (quantity > productStock) {
              throw new Error(`No hay stock suficiente para ${product.name}`);
            }
            const newStock = productStock - quantity;
            await client.query('UPDATE products SET "stockQuantity" = $1, "inStock" = $2 WHERE id = $3', [newStock, newStock > 0, item.id]);
          }

          const result = await client.query(`
            INSERT INTO orders (
              customerName, customerEmail, paymentMethod, status, shipping, total, items, createdAt
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [
              String(customerName).trim(),
              String(customerEmail).trim(),
              String(paymentMethod).trim(),
              'ficticio',
              Number(shipping) || 0,
              Number(total) || 0,
              JSON.stringify(items),
              new Date().toISOString(),
            ]
          );
          await client.query('COMMIT');
          res.status(201).json(normalizeOrder(result.rows[0]));
        } catch (error) {
          await client.query('ROLLBACK');
          res.status(400).json({ message: error.message || 'Error al crear el pedido' });
        } finally {
          client.release();
        }
        return;
      }

      await sqliteDb.exec('BEGIN TRANSACTION');
      try {
        for (const item of items) {
          const product = await sqliteDb.get('SELECT * FROM products WHERE id = ?', item.id);
          if (!product) {
            throw new Error(`Producto no encontrado: ${item.id}`);
          }
          const productStock = Number(product.stockQuantity);
          const quantity = Number(item.quantity) || 0;
          if (quantity > productStock) {
            throw new Error(`No hay stock suficiente para ${product.name}`);
          }
          const newStock = productStock - quantity;
          await sqliteDb.run('UPDATE products SET stockQuantity = ?, inStock = ? WHERE id = ?', newStock, newStock > 0 ? 1 : 0, item.id);
        }

        const result = await sqliteDb.run(`
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

        const created = await sqliteDb.get('SELECT * FROM orders WHERE id = ?', result.lastID);
        await sqliteDb.exec('COMMIT');
        res.status(201).json(normalizeOrder(created));
      } catch (error) {
        await sqliteDb.exec('ROLLBACK');
        res.status(400).json({ message: error.message || 'Error al crear el pedido' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/orders', async (req, res) => {
    try {
      if (USE_POSTGRES) {
        const result = await postgresPool.query('SELECT * FROM orders ORDER BY id DESC');
        res.json(result.rows.map(normalizeOrder));
      } else {
        const rows = await sqliteDb.all('SELECT * FROM orders ORDER BY id DESC');
        res.json(rows.map(normalizeOrder));
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get('/api/orders/:id', async (req, res) => {
    try {
      const id = Number(req.params.id);
      let row;
      if (USE_POSTGRES) {
        const result = await postgresPool.query('SELECT * FROM orders WHERE id = $1', [id]);
        row = result.rows[0];
      } else {
        row = await sqliteDb.get('SELECT * FROM orders WHERE id = ?', id);
      }
      if (!row) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }
      res.json(normalizeOrder(row));
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
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

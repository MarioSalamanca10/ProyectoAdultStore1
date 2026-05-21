import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Pool } from 'pg';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'products.json');
const PORT = process.env.PORT || 4000;
const DATABASE_URL = process.env.DATABASE_URL;
const useDatabase = Boolean(DATABASE_URL);

const pool = useDatabase ? new Pool({ connectionString: DATABASE_URL }) : null;

async function loadProductsFile() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

async function saveProductsFile(products) {
  await fs.writeFile(DATA_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

async function queryDb(query, params = []) {
  if (!useDatabase) {
    throw new Error('DATABASE_URL no está configurado');
  }
  return pool.query(query, params);
}

async function getAllProducts() {
  if (useDatabase) {
    const result = await queryDb('SELECT * FROM products ORDER BY id');
    return result.rows;
  }
  return loadProductsFile();
}

async function getProductById(id) {
  if (useDatabase) {
    const result = await queryDb('SELECT * FROM products WHERE id = $1', [id]);
    return result.rows[0];
  }
  const products = await loadProductsFile();
  return products.find((item) => item.id === id);
}

async function createProduct(data) {
  if (useDatabase) {
    const result = await queryDb(
      `INSERT INTO products (name, description, price, category, image, rating, reviews, likes, "inStock", "stockQuantity", discount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        data.name,
        data.description,
        data.price,
        data.category,
        data.image,
        data.rating,
        data.reviews,
        data.likes,
        data.inStock,
        data.stockQuantity,
        data.discount,
      ]
    );
    return result.rows[0];
  }

  const products = await loadProductsFile();
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map((item) => item.id)) + 1 : 1,
    ...data,
  };
  products.push(newProduct);
  await saveProductsFile(products);
  return newProduct;
}

async function updateProduct(id, data) {
  if (useDatabase) {
    const fields = [];
    const values = [];
    let index = 1;

    for (const [key, value] of Object.entries(data)) {
      if (['name', 'description', 'price', 'category', 'image', 'rating', 'reviews', 'likes', 'inStock', 'stockQuantity', 'discount'].includes(key)) {
        fields.push(`"${key}" = $${index}`);
        values.push(value);
        index += 1;
      }
    }

    if (fields.length === 0) {
      return null;
    }

    values.push(id);
    const result = await queryDb(
      `UPDATE products SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
      values
    );
    return result.rows[0];
  }

  const products = await loadProductsFile();
  const index = products.findIndex((item) => item.id === id);
  if (index === -1) return null;

  products[index] = {
    ...products[index],
    ...data,
  };
  await saveProductsFile(products);
  return products[index];
}

async function deleteProduct(id) {
  if (useDatabase) {
    const result = await queryDb('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  const products = await loadProductsFile();
  const filtered = products.filter((item) => item.id !== id);
  if (filtered.length === products.length) return null;
  await saveProductsFile(filtered);
  return true;
}

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Adult Store Backend activo', version: '1.0.0', useDatabase });
});

app.get('/products', async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

app.get('/products/:id', async (req, res, next) => {
  try {
    const product = await getProductById(Number(req.params.id));
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

app.post('/products', async (req, res, next) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ error: 'Faltan datos requeridos del producto' });
    }

    const payload = {
      name,
      description,
      price: Number(price),
      category,
      image: req.body.image || '/assets/products/default.jpg',
      rating: Number(req.body.rating || 0),
      reviews: Number(req.body.reviews || 0),
      likes: Number(req.body.likes || 0),
      inStock: req.body.inStock !== undefined ? Boolean(req.body.inStock) : true,
      stockQuantity: Number(req.body.stockQuantity ?? 0),
      discount: Number(req.body.discount ?? 0),
    };

    const newProduct = await createProduct(payload);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

app.put('/products/:id', async (req, res, next) => {
  try {
    const updated = await updateProduct(Number(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Producto no encontrado o no se enviaron campos válidos' });
    }
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

app.delete('/products/:id', async (req, res, next) => {
  try {
    const deleted = await deleteProduct(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Backend Express corriendo en http://localhost:${PORT}`);
  if (useDatabase) {
    console.log('Conectado a la base de datos PostgreSQL.');
  } else {
    console.log('WARNING: DATABASE_URL no está configurado. Usando almacenamiento local JSON.');
  }
});

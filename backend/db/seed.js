import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Pool } from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: Debes definir DATABASE_URL en backend/.env o en las variables de entorno.');
  process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });
const PRODUCTS_FILE = path.join(__dirname, '..', 'data', 'products.json');

async function loadSeedProducts() {
  const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
  return JSON.parse(data);
}

async function initDatabase() {
  try {
    const schema = await fs.readFile(path.join(__dirname, 'schema.sql'), 'utf-8');
    await pool.query(schema);

    const products = await loadSeedProducts();
    await pool.query('TRUNCATE TABLE products RESTART IDENTITY CASCADE');

    for (const product of products) {
      const {
        name,
        description,
        price,
        category,
        image,
        rating,
        reviews,
        likes,
        inStock,
        stockQuantity,
        discount,
      } = product;

      await pool.query(
        `INSERT INTO products (name, description, price, category, image, rating, reviews, likes, "inStock", "stockQuantity", discount)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [name, description, price, category, image, rating, reviews, likes, inStock, stockQuantity, discount]
      );
    }

    console.log('Base de datos inicializada y datos de productos cargados.');
  } catch (error) {
    console.error('Error inicializando la base de datos:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();

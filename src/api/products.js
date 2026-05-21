const API_BASE = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:4000' : '');

function buildUrl(path) {
  const base = API_BASE.replace(/\/$/, '');
  return `${base}${path}`;
}

async function parseResponse(response) {
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${text || '<empty response>'}`);
  }
  if (!text) {
    return null;
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`Error parseando JSON de respuesta: ${error.message}. Respuesta: ${text}`);
  }
}

export function getProducts() {
  return parseResponse(fetch(buildUrl('/api/products')));
}

export function getProduct(id) {
  return parseResponse(fetch(buildUrl(`/api/products/${id}`)));
}

export function createProduct(product) {
  return parseResponse(fetch(buildUrl('/api/products'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  }));
}

export function updateProduct(id, data) {
  return parseResponse(fetch(buildUrl(`/api/products/${id}`), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }));
}

export async function deleteProduct(id) {
  const response = await fetch(buildUrl(`/api/products/${id}`), {
    method: 'DELETE',
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text || '<empty response>'}`);
  }
}

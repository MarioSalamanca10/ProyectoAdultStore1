const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const buildUrl = (path) => {
  const base = API_BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
};

async function fetchJson(path, options = {}) {
  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL no está definido');
  }

  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en la API: ${response.status} ${response.statusText} - ${errorText}`);
  }

  return response.json();
}

export async function getProducts() {
  return fetchJson('/products');
}

export async function createProduct(data) {
  return fetchJson('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateProductById(id, data) {
  return fetchJson(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteProductById(id) {
  return fetchJson(`/products/${id}`, {
    method: 'DELETE',
  });
}

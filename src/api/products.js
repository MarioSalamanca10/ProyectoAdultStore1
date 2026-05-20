const API_BASE = import.meta.env.VITE_API_URL ?? '';

async function handleResponse(responsePromise) {
  const response = await responsePromise;

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }
  return response.json();
}

export function getProducts() {
  return handleResponse(fetch(`${API_BASE}/api/products`));
}

export function getProduct(id) {
  return handleResponse(fetch(`${API_BASE}/api/products/${id}`));
}

export function createProduct(product) {
  return handleResponse(fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  }));
}

export function updateProduct(id, data) {
  return handleResponse(fetch(`${API_BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }));
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }
}

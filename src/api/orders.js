const API_BASE = import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? (import.meta.env.DEV ? 'http://localhost:4000' : '');

function buildUrl(path) {
  const base = API_BASE.replace(/\/$/, '');
  return `${base}${path}`;
}

async function handleResponse(responsePromise) {
  const response = await responsePromise;
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${response.status} ${response.statusText}: ${text}`);
  }
  return response.json();
}

export function createOrder(order) {
  return handleResponse(fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  }));
}

export function getOrders() {
  return handleResponse(fetch(`${API_BASE}/api/orders`));
}

export function getOrder(id) {
  return handleResponse(fetch(`${API_BASE}/api/orders/${id}`));
}

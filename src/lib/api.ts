const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

function token() {
  return localStorage.getItem('token');
}

function authHeaders(): HeadersInit {
  const t = token();
  return t
    ? { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' }
    : { 'Content-Type': 'application/json' };
}

async function req<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders(), ...options });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || 'Request failed');
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Types ──────────────────────────────────────────────────
export interface User { id: string; name: string; email: string; phone?: string; created_at?: string }
export interface Seller {
  id: string; name: string; email: string; phone: string;
  whatsapp?: string; shop_name: string; shop_desc?: string; is_approved: boolean;
}
export interface Product {
  id: string; seller_id: string; name: string; name_fr: string;
  description: string; description_fr: string; price: number;
  category: string; image_url: string; in_stock: boolean; stock_qty: number;
  created_at: string;
  seller_name?: string; seller_phone?: string; seller_whatsapp?: string; shop_name?: string;
}
export interface CartItem {
  id: string; quantity: number; product_id: string;
  name: string; name_fr: string; price: number; image_url: string;
  in_stock: boolean; shop_name: string;
}
export interface Order {
  id: string; user_id: string; seller_id: string; total_amount: number;
  status: string; payment_status: string; payment_method?: string;
  delivery_address?: string; created_at: string;
  shop_name?: string; buyer_name?: string; buyer_email?: string; buyer_phone?: string;
  items?: { product_id: string; quantity: number; unit_price: number; name: string }[];
}

// ── Auth ───────────────────────────────────────────────────
export const auth = {
  registerUser: (d: { name: string; email: string; phone?: string; password: string }) =>
    req<{ token: string; user: User }>('/auth/user/register', { method: 'POST', body: JSON.stringify(d) }),

  loginUser: (d: { email: string; password: string }) =>
    req<{ token: string; user: User }>('/auth/user/login', { method: 'POST', body: JSON.stringify(d) }),

  registerSeller: (d: { name: string; email: string; phone: string; whatsapp?: string; shop_name: string; shop_desc?: string; password: string }) =>
    req<{ token: string; seller: Seller }>('/auth/seller/register', { method: 'POST', body: JSON.stringify(d) }),

  loginSeller: (d: { email: string; password: string }) =>
    req<{ token: string; seller: Seller }>('/auth/seller/login', { method: 'POST', body: JSON.stringify(d) }),

  loginAdmin: (d: { username: string; password: string }) =>
    req<{ token: string; admin: { id: string; username: string } }>('/auth/admin/login', { method: 'POST', body: JSON.stringify(d) }),
};

// ── Products ───────────────────────────────────────────────
export const products = {
  list: (params?: { category?: string; search?: string; seller_id?: string }) => {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    return req<Product[]>(`/products${q ? `?${q}` : ''}`);
  },
  get: (id: string) => req<Product>(`/products/${id}`),
  mine: () => req<Product[]>('/products/seller/mine'),
  create: (d: Omit<Product, 'id' | 'created_at' | 'seller_id' | 'seller_name' | 'seller_phone' | 'seller_whatsapp' | 'shop_name'>) =>
    req<Product>('/products', { method: 'POST', body: JSON.stringify(d) }),
  update: (id: string, d: Partial<Product>) =>
    req<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  remove: (id: string) => req<void>(`/products/${id}`, { method: 'DELETE' }),
};

// ── Cart ───────────────────────────────────────────────────
export const cart = {
  get: () => req<CartItem[]>('/cart'),
  add: (product_id: string, quantity = 1) =>
    req<CartItem>('/cart', { method: 'POST', body: JSON.stringify({ product_id, quantity }) }),
  update: (id: string, quantity: number) =>
    req<CartItem>(`/cart/${id}`, { method: 'PATCH', body: JSON.stringify({ quantity }) }),
  remove: (id: string) => req<void>(`/cart/${id}`, { method: 'DELETE' }),
  clear: () => req<void>('/cart', { method: 'DELETE' }),
};

// ── Orders ─────────────────────────────────────────────────
export const orders = {
  place: (d: { delivery_address: string; payment_method: string }) =>
    req<Order[]>('/orders', { method: 'POST', body: JSON.stringify(d) }),
  mine: () => req<Order[]>('/orders/mine'),
  sellerOrders: () => req<Order[]>('/orders/seller'),
  updateStatus: (id: string, status: string) =>
    req<Order>(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ── Payments ───────────────────────────────────────────────
export const payments = {
  initiate: (d: { order_id: string; phone: string; operator: string }) =>
    req<{ payment_url: string; payment_id: string }>('/payments/initiate', { method: 'POST', body: JSON.stringify(d) }),
  status: (order_id: string) =>
    req<{ status: string; operator?: string }>(`/payments/status/${order_id}`),
};

// ── Upload ────────────────────────────────────────────────
export const upload = {
  image: async (file: File): Promise<string> => {
    const form = new FormData();
    form.append('image', file);
    const res = await fetch(`${BASE}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token()}` }, // no Content-Type — browser sets multipart boundary
      body: form,
    });
    if (!res.ok) throw new Error('Image upload failed');
    const data = await res.json();
    return data.url as string; // Cloudinary secure_url
  },
};

// ── Admin ──────────────────────────────────────────────────
export const admin = {
  sellers: () => req<Seller[]>('/admin/sellers'),
  approveSeller: (id: string, approved: boolean) =>
    req<Seller>(`/admin/sellers/${id}/approve`, { method: 'PATCH', body: JSON.stringify({ approved }) }),
  users: () => req<User[]>('/admin/users'),
  allOrders: () => req<Order[]>('/orders/admin/all'),
  deleteProduct: (id: string) => req<void>(`/admin/products/${id}`, { method: 'DELETE' }),
};

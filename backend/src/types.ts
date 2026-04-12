export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  created_at: string;
}

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  shop_name: string;
  shop_desc?: string;
  is_approved: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  name_fr: string;
  description: string;
  description_fr: string;
  price: number;
  category: string;
  image_url: string;
  in_stock: boolean;
  stock_qty: number;
  created_at: string;
  // joined
  seller_name?: string;
  seller_phone?: string;
  seller_whatsapp?: string;
  shop_name?: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  // joined
  name?: string;
  name_fr?: string;
  price?: number;
  image_url?: string;
  in_stock?: boolean;
  shop_name?: string;
}

export interface Order {
  id: string;
  user_id: string;
  seller_id: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_status: 'unpaid' | 'paid' | 'failed' | 'refunded';
  payment_method?: string;
  delivery_address?: string;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  monetbil_ref?: string;
  amount: number;
  phone: string;
  operator?: string;
  status: 'pending' | 'success' | 'failed';
  created_at: string;
}

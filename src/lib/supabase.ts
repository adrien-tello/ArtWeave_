import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Product = {
  id: string;
  name: string;
  name_fr: string;
  description: string;
  description_fr: string;
  price: number;
  category: string;
  image_url: string;
  in_stock: boolean;
  created_at: string;
};

export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  product_id: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
};
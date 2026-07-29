export type ProductType = 'pdf' | 'course' | 'pack';
export type OrderStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Profile {
  id: string;
  email: string;
  full_name?: string | null;
  billing_address?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  price_cents: number;
  currency: string;
  type: ProductType;
  stripe_price_id?: string | null;
  storage_file_path?: string | null;
  is_published: boolean;
  is_preorder: boolean;
  release_date?: string | null;
  preorder_limit?: number | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id?: string | null;
  stripe_session_id: string;
  stripe_payment_intent_id?: string | null;
  total_amount_cents: number;
  currency: string;
  status: OrderStatus;
  customer_details?: Record<string, any> | null;
  created_at: string;
}

export interface UserAccess {
  id: string;
  user_id: string;
  product_id: string;
  order_id?: string | null;
  granted_at: string;
  available_from: string;
  products?: Product;
}

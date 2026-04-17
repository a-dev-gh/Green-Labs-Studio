export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  images: string[];
  care_guide: string | null;
  category_id: string | null;
  light_needs: 'low' | 'medium' | 'high' | null;
  water_needs: 'low' | 'medium' | 'high' | null;
  is_featured: boolean;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Order {
  id: string;
  user_id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  notes: string | null;
  whatsapp_sent: boolean;
  whatsapp_sent_at: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_time: number;
  created_at: string;
  product?: Product;
}

export interface CartItem {
  id: string;
  user_id: string | null;
  session_id: string | null;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Wishlist {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
  updated_at: string;
  items?: WishlistItem[];
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Service {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_range: string | null;
  images: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SouvenirPackage {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  items_included: string[];
  min_quantity: number;
  images: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number;
  avatar_url: string | null;
  is_featured: boolean;
  sort_order: number;
  status: 'pending' | 'approved' | 'rejected';
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CmsContent {
  id: string;
  page: string;
  section: string;
  content: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  product_ids: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  products?: Product[];
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  created_at: string;
  user_type?: 'customer' | 'delivery' | 'admin';
  is_online?: boolean;
  vehicle_type?: string;
  current_location?: {
    latitude: number;
    longitude: number;
  };
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image_url: string;
  rating: number;
  delivery_time: string;
  minimum_order: number;
  delivery_fee: number;
  cuisine_type: string;
  address: string;
  created_at: string;
}

export interface MenuItem {
  id: string;
  restaurant_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  is_available: boolean;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  restaurant_id: string;
  delivery_person_id?: string;
  items: OrderItem[];
  total_amount: number;
  delivery_fee: number;
  service_fee: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'picked_up' | 'out_for_delivery' | 'delivered' | 'cancelled';
  delivery_address: string;
  customer_phone: string;
  restaurant: {
    name: string;
    address: string;
    phone: string;
  };
  customer?: User;
  delivery_person?: User;
  created_at: string;
}

export interface OrderItem {
  menu_item_id: string;
  quantity: number;
  price: number;
}

export interface DeliveryEarnings {
  daily: number;
  weekly: number;
  monthly: number;
  total_deliveries: number;
}

export interface AdminStats {
  totalRevenue: number;
  totalCommission: number;
  totalOrders: number;
  activeCustomers: number;
  activeDeliveryPersons: number;
  ordersByStatus: {
    [key: string]: number;
  };
  recentOrders: Order[];
}
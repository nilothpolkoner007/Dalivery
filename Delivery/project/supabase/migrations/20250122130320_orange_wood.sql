/*
  # Initial Schema Setup for Food Delivery App

  1. New Tables
    - users (extends auth.users)
      - id (uuid, primary key)
      - full_name (text)
      - phone (text, optional)
      - address (text, optional)
      - created_at (timestamp)
    
    - restaurants
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - image_url (text)
      - rating (numeric)
      - delivery_time (text)
      - minimum_order (numeric)
      - delivery_fee (numeric)
      - cuisine_type (text)
      - address (text)
      - created_at (timestamp)
    
    - menu_items
      - id (uuid, primary key)
      - restaurant_id (uuid, foreign key)
      - name (text)
      - description (text)
      - price (numeric)
      - image_url (text)
      - category (text)
      - is_available (boolean)
      - created_at (timestamp)
    
    - orders
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - restaurant_id (uuid, foreign key)
      - total_amount (numeric)
      - status (text)
      - delivery_address (text)
      - created_at (timestamp)
    
    - order_items
      - id (uuid, primary key)
      - order_id (uuid, foreign key)
      - menu_item_id (uuid, foreign key)
      - quantity (integer)
      - price (numeric)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table (extends auth.users)
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text NOT NULL,
  phone text,
  address text,
  created_at timestamptz DEFAULT now()
);

-- Restaurants table
CREATE TABLE restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  image_url text,
  rating numeric DEFAULT 0,
  delivery_time text,
  minimum_order numeric DEFAULT 0,
  delivery_fee numeric DEFAULT 0,
  cuisine_type text,
  address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Menu items table
CREATE TABLE menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  price numeric NOT NULL,
  image_url text,
  category text,
  is_available boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  restaurant_id uuid REFERENCES restaurants(id),
  total_amount numeric NOT NULL,
  status text DEFAULT 'pending',
  delivery_address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid REFERENCES menu_items(id),
  quantity integer NOT NULL,
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policies for users table
CREATE POLICY "Users can view their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Policies for restaurants table
CREATE POLICY "Anyone can view restaurants"
  ON restaurants
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for menu_items table
CREATE POLICY "Anyone can view menu items"
  ON menu_items
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for orders table
CREATE POLICY "Users can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for order_items table
CREATE POLICY "Users can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );
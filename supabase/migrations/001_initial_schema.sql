-- TopWhite Catalog Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types/enums
CREATE TYPE product_category AS ENUM (
  'plain', 'printed', 'embossed', 'embroidered', 
  'collar', 'knitted', 'silicon', 'patch', 'downshoulder'
);

CREATE TYPE product_tag AS ENUM ('new', 'hot', 'bestseller');

CREATE TYPE app_role AS ENUM ('admin');

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_name VARCHAR(100) NOT NULL,
  fabric_name VARCHAR(50) NOT NULL,
  gsm INTEGER NOT NULL CHECK (gsm >= 100 AND gsm <= 400),
  sizes TEXT[] NOT NULL DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  price_min DECIMAL(10,2) NOT NULL CHECK (price_min >= 0),
  price_max DECIMAL(10,2) CHECK (price_max IS NULL OR price_max >= price_min),
  min_order INTEGER NOT NULL DEFAULT 50 CHECK (min_order >= 1),
  description TEXT,
  category product_category NOT NULL,
  tag product_tag,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product Images Table
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Roles Table (for admin access)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings Table
CREATE TABLE site_settings (
  key VARCHAR(50) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_product_images_display_order ON product_images(display_order);
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);

-- Function to check if user has a role
CREATE OR REPLACE FUNCTION has_role(_role app_role, _user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM user_roles 
    WHERE user_id = _user_id AND role = _role
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Products: Anyone can read active products
CREATE POLICY "Public can view active products" ON products
  FOR SELECT USING (is_active = true);

-- Products: Admins can do everything
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (has_role('admin', auth.uid()));

-- Product Images: Anyone can view
CREATE POLICY "Public can view product images" ON product_images
  FOR SELECT USING (true);

-- Product Images: Admins can manage
CREATE POLICY "Admins can manage product images" ON product_images
  FOR ALL USING (has_role('admin', auth.uid()));

-- User Roles: Only admins can view/manage roles
CREATE POLICY "Admins can view roles" ON user_roles
  FOR SELECT USING (has_role('admin', auth.uid()) OR user_id = auth.uid());

CREATE POLICY "Admins can manage roles" ON user_roles
  FOR ALL USING (has_role('admin', auth.uid()));

-- Site Settings: Anyone can read
CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT USING (true);

-- Site Settings: Admins can update
CREATE POLICY "Admins can manage site settings" ON site_settings
  FOR ALL USING (has_role('admin', auth.uid()));

-- Insert default site settings
INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_primary', '919599965931'),
  ('whatsapp_secondary', '919582142143'),
  ('business_name', 'Tom White'),
  ('business_address', 'H-16/86 Gali No 4, Tank Road, Near Bhalle Wale, Karol Bagh, New Delhi - 110005'),
  ('business_email', ''),
  ('currency_symbol', '₹'),
  ('min_order_default', '50')
ON CONFLICT (key) DO NOTHING;

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can view product images
CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Storage policy: Authenticated users can upload
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Storage policy: Authenticated users can update/delete their uploads
CREATE POLICY "Authenticated users can manage product images" ON storage.objects
  FOR ALL USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');

/*
  # Green Nepal - Complete Database Schema
  
  1. New Tables
    - `profiles` - User profiles with Rotary member info
    - `donations` - All donation records with eSewa integration
    - `planting_sites` - Tree planting locations
    - `site_admins` - Site-specific administrators
    - `trees` - Individual tree records
    - `payment_transactions` - eSewa payment tracking
    - `admin_users` - System administrators
    - `rotary_members` - Rotary Club member information
    - `impact_metrics` - Environmental impact calculations
    - `site_updates` - Planting site progress updates

  2. Security
    - Enable RLS on all tables
    - Role-based access control
    - Site-specific admin permissions
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('donor', 'site_admin', 'main_admin', 'rotary_member');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE site_status AS ENUM ('planning', 'active', 'completed', 'maintenance');
CREATE TYPE tree_status AS ENUM ('planted', 'growing', 'mature', 'deceased');

-- Profiles table (enhanced)
DROP TABLE IF EXISTS profiles CASCADE;
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  role user_role DEFAULT 'donor',
  is_rotary_member boolean DEFAULT false,
  rotary_member_id text,
  address text,
  city text DEFAULT 'Kathmandu',
  country text DEFAULT 'Nepal',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Rotary members table
CREATE TABLE rotary_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  member_id text UNIQUE NOT NULL,
  club_name text DEFAULT 'Rotary Club of Kasthamandap',
  position text,
  join_date date,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Planting sites table
CREATE TABLE planting_sites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  latitude decimal(10, 8) NOT NULL,
  longitude decimal(11, 8) NOT NULL,
  address text,
  target_trees integer DEFAULT 0,
  planted_trees integer DEFAULT 0,
  site_area decimal(10, 2), -- in square meters
  status site_status DEFAULT 'planning',
  site_admin_id uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Site admins table (for site-specific permissions)
CREATE TABLE site_admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  site_id uuid REFERENCES planting_sites(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES profiles(id),
  is_active boolean DEFAULT true,
  UNIQUE(profile_id, site_id)
);

-- Enhanced donations table
DROP TABLE IF EXISTS donations CASCADE;
CREATE TABLE donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  site_id uuid REFERENCES planting_sites(id),
  amount decimal(10, 2) NOT NULL CHECK (amount > 0),
  trees_count integer NOT NULL CHECK (trees_count > 0),
  tree_species text NOT NULL,
  payment_method text DEFAULT 'esewa',
  payment_status payment_status DEFAULT 'pending',
  esewa_transaction_id text,
  esewa_ref_id text,
  donation_message text,
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Payment transactions table
CREATE TABLE payment_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid REFERENCES donations(id) ON DELETE CASCADE,
  esewa_transaction_id text UNIQUE,
  esewa_ref_id text,
  amount decimal(10, 2) NOT NULL,
  status payment_status DEFAULT 'pending',
  gateway_response jsonb,
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Trees table (individual tree tracking)
CREATE TABLE trees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_id uuid REFERENCES donations(id) ON DELETE CASCADE,
  site_id uuid REFERENCES planting_sites(id) ON DELETE CASCADE,
  species text NOT NULL,
  planted_date date,
  latitude decimal(10, 8),
  longitude decimal(11, 8),
  status tree_status DEFAULT 'planted',
  height_cm integer,
  diameter_cm decimal(5, 2),
  health_score integer CHECK (health_score >= 1 AND health_score <= 10),
  notes text,
  planted_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Impact metrics table
CREATE TABLE impact_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid REFERENCES planting_sites(id),
  metric_date date DEFAULT CURRENT_DATE,
  co2_absorbed_kg decimal(10, 2) DEFAULT 0,
  oxygen_produced_kg decimal(10, 2) DEFAULT 0,
  water_filtered_liters decimal(12, 2) DEFAULT 0,
  soil_improved_sqm decimal(10, 2) DEFAULT 0,
  wildlife_species_count integer DEFAULT 0,
  calculated_at timestamptz DEFAULT now()
);

-- Site updates table
CREATE TABLE site_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid REFERENCES planting_sites(id) ON DELETE CASCADE,
  admin_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  update_type text DEFAULT 'general', -- 'planting', 'maintenance', 'progress', 'general'
  images text[], -- Array of image URLs
  trees_planted_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Admin users table
CREATE TABLE admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  admin_level text DEFAULT 'site_admin', -- 'main_admin', 'site_admin'
  permissions jsonb DEFAULT '{}',
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rotary_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE planting_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Public can view basic profile info" ON profiles FOR SELECT TO anon USING (true);

-- RLS Policies for donations
CREATE POLICY "Users can view own donations" ON donations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own donations" ON donations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all donations" ON donations FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM admin_users au JOIN profiles p ON au.profile_id = p.id WHERE p.id = auth.uid())
);
CREATE POLICY "Public can view completed donations" ON donations FOR SELECT TO anon USING (payment_status = 'completed' AND NOT is_anonymous);

-- RLS Policies for planting sites
CREATE POLICY "Anyone can view planting sites" ON planting_sites FOR SELECT TO anon USING (true);
CREATE POLICY "Site admins can update their sites" ON planting_sites FOR UPDATE TO authenticated USING (
  site_admin_id = auth.uid() OR 
  EXISTS (SELECT 1 FROM site_admins sa WHERE sa.site_id = id AND sa.profile_id = auth.uid() AND sa.is_active = true)
);

-- RLS Policies for trees
CREATE POLICY "Anyone can view trees" ON trees FOR SELECT TO anon USING (true);
CREATE POLICY "Site admins can manage trees" ON trees FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM site_admins sa WHERE sa.site_id = trees.site_id AND sa.profile_id = auth.uid() AND sa.is_active = true) OR
  EXISTS (SELECT 1 FROM admin_users au WHERE au.profile_id = auth.uid())
);

-- RLS Policies for site updates
CREATE POLICY "Anyone can view site updates" ON site_updates FOR SELECT TO anon USING (true);
CREATE POLICY "Site admins can create updates" ON site_updates FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM site_admins sa WHERE sa.site_id = site_updates.site_id AND sa.profile_id = auth.uid() AND sa.is_active = true) OR
  EXISTS (SELECT 1 FROM admin_users au WHERE au.profile_id = auth.uid())
);

-- Create indexes for performance
CREATE INDEX idx_donations_user_id ON donations(user_id);
CREATE INDEX idx_donations_site_id ON donations(site_id);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);
CREATE INDEX idx_donations_status ON donations(payment_status);
CREATE INDEX idx_trees_site_id ON trees(site_id);
CREATE INDEX idx_trees_donation_id ON trees(donation_id);
CREATE INDEX idx_site_updates_site_id ON site_updates(site_id);
CREATE INDEX idx_site_updates_created_at ON site_updates(created_at DESC);
CREATE INDEX idx_planting_sites_status ON planting_sites(status);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_planting_sites_updated_at BEFORE UPDATE ON planting_sites FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trees_updated_at BEFORE UPDATE ON trees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for Green Nepal
INSERT INTO planting_sites (name, description, latitude, longitude, address, target_trees, status) VALUES
('Shivapuri National Park', 'Primary conservation area with diverse native species for watershed protection', 27.8167, 85.3833, 'Shivapuri Nagarjun National Park, Kathmandu', 5000, 'active'),
('Pashupatinath Temple Grounds', 'Sacred temple area restoration with religious and cultural significance', 27.7106, 85.3481, 'Pashupatinath Temple, Kathmandu', 1000, 'active'),
('Swayambhunath Heritage Site', 'UNESCO World Heritage site environmental restoration project', 27.7149, 85.2906, 'Swayambhunath Stupa, Kathmandu', 800, 'active'),
('Tribhuvan University Campus', 'Educational institution campus greening initiative with student participation', 27.6781, 85.3167, 'Tribhuvan University, Kirtipur', 2000, 'active'),
('Godavari Botanical Garden', 'Research and conservation botanical garden expansion project', 27.5833, 85.3833, 'Godavari, Lalitpur', 3000, 'active'),
('Chandragiri Hills', 'Hill station reforestation for eco-tourism and biodiversity conservation', 27.6167, 85.2167, 'Chandragiri, Kathmandu', 2500, 'planning');

-- Insert sample impact metrics
INSERT INTO impact_metrics (site_id, co2_absorbed_kg, oxygen_produced_kg, water_filtered_liters, soil_improved_sqm, wildlife_species_count)
SELECT 
  id,
  planted_trees * 22.0, -- 22kg CO2 per tree per year
  planted_trees * 16.0, -- 16kg oxygen per tree per year
  planted_trees * 120.0, -- 120 liters water filtered per tree per year
  planted_trees * 4.0, -- 4 sqm soil improved per tree
  CASE WHEN planted_trees > 0 THEN (planted_trees / 10) + 5 ELSE 0 END -- Wildlife species supported
FROM planting_sites;
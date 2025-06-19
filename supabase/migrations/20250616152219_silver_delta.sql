/*
  # Add Contribution Rooms System

  1. New Tables
    - `contribution_rooms`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `goal_amount` (numeric)
      - `current_amount` (numeric, default 0)
      - `target_trees` (integer)
      - `tree_species` (text)
      - `site_id` (uuid, references planting_sites)
      - `created_by` (uuid, references profiles)
      - `status` (enum: 'active', 'completed', 'cancelled')
      - `deadline` (timestamp)
      - `created_at` (timestamp)
      - `completed_at` (timestamp)

    - `room_contributions`
      - `id` (uuid, primary key)
      - `room_id` (uuid, references contribution_rooms)
      - `user_id` (uuid, references profiles)
      - `amount` (numeric)
      - `payment_status` (enum)
      - `esewa_transaction_id` (text)
      - `message` (text)
      - `created_at` (timestamp)

    - `site_notifications`
      - `id` (uuid, primary key)
      - `site_id` (uuid, references planting_sites)
      - `admin_id` (uuid, references profiles)
      - `donation_id` (uuid, references donations)
      - `room_id` (uuid, references contribution_rooms)
      - `notification_type` (enum: 'donation', 'room_completed')
      - `message` (text)
      - `is_read` (boolean, default false)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all new tables
    - Add appropriate policies
*/

-- Create new enums
CREATE TYPE room_status AS ENUM ('active', 'completed', 'cancelled');
CREATE TYPE notification_type AS ENUM ('donation', 'room_completed', 'tree_planted');

-- Contribution rooms table
CREATE TABLE IF NOT EXISTS contribution_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  goal_amount numeric(10,2) NOT NULL CHECK (goal_amount > 0),
  current_amount numeric(10,2) DEFAULT 0 CHECK (current_amount >= 0),
  target_trees integer NOT NULL CHECK (target_trees > 0),
  tree_species text NOT NULL,
  site_id uuid REFERENCES planting_sites(id) NOT NULL,
  created_by uuid REFERENCES profiles(id) NOT NULL,
  status room_status DEFAULT 'active',
  deadline timestamptz,
  image_url text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Room contributions table
CREATE TABLE IF NOT EXISTS room_contributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES contribution_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount numeric(10,2) NOT NULL CHECK (amount >= 10), -- Minimum 10 NPR
  payment_status payment_status DEFAULT 'pending',
  esewa_transaction_id text,
  esewa_ref_id text,
  message text,
  is_anonymous boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Site notifications table
CREATE TABLE IF NOT EXISTS site_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_id uuid REFERENCES planting_sites(id) ON DELETE CASCADE NOT NULL,
  admin_id uuid REFERENCES profiles(id) NOT NULL,
  donation_id uuid REFERENCES donations(id) ON DELETE CASCADE,
  room_id uuid REFERENCES contribution_rooms(id) ON DELETE CASCADE,
  notification_type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE contribution_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contribution_rooms
CREATE POLICY "Anyone can view active rooms" ON contribution_rooms 
  FOR SELECT USING (status = 'active' OR status = 'completed');

CREATE POLICY "Authenticated users can create rooms" ON contribution_rooms 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Room creators can update their rooms" ON contribution_rooms 
  FOR UPDATE TO authenticated USING (auth.uid() = created_by);

-- RLS Policies for room_contributions
CREATE POLICY "Users can view room contributions" ON room_contributions 
  FOR SELECT USING (true);

CREATE POLICY "Users can insert own contributions" ON room_contributions 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own contributions" ON room_contributions 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for site_notifications
CREATE POLICY "Site admins can view their notifications" ON site_notifications 
  FOR SELECT TO authenticated USING (
    auth.uid() = admin_id OR
    EXISTS (SELECT 1 FROM site_admins sa WHERE sa.site_id = site_notifications.site_id AND sa.profile_id = auth.uid() AND sa.is_active = true) OR
    EXISTS (SELECT 1 FROM admin_users au WHERE au.profile_id = auth.uid())
  );

CREATE POLICY "System can insert notifications" ON site_notifications 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can update their notifications" ON site_notifications 
  FOR UPDATE TO authenticated USING (
    auth.uid() = admin_id OR
    EXISTS (SELECT 1 FROM site_admins sa WHERE sa.site_id = site_notifications.site_id AND sa.profile_id = auth.uid() AND sa.is_active = true)
  );

-- Create indexes
CREATE INDEX idx_contribution_rooms_status ON contribution_rooms(status);
CREATE INDEX idx_contribution_rooms_site_id ON contribution_rooms(site_id);
CREATE INDEX idx_contribution_rooms_created_at ON contribution_rooms(created_at DESC);
CREATE INDEX idx_room_contributions_room_id ON room_contributions(room_id);
CREATE INDEX idx_room_contributions_user_id ON room_contributions(user_id);
CREATE INDEX idx_site_notifications_admin_id ON site_notifications(admin_id);
CREATE INDEX idx_site_notifications_site_id ON site_notifications(site_id);
CREATE INDEX idx_site_notifications_is_read ON site_notifications(is_read);

-- Function to update room current_amount when contribution is made
CREATE OR REPLACE FUNCTION update_room_amount()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    UPDATE contribution_rooms 
    SET current_amount = current_amount + NEW.amount,
        status = CASE 
          WHEN current_amount + NEW.amount >= goal_amount THEN 'completed'::room_status
          ELSE status
        END,
        completed_at = CASE 
          WHEN current_amount + NEW.amount >= goal_amount THEN now()
          ELSE completed_at
        END
    WHERE id = NEW.room_id;
    
    -- Create notification for site admin when room is completed
    IF (SELECT current_amount >= goal_amount FROM contribution_rooms WHERE id = NEW.room_id) THEN
      INSERT INTO site_notifications (site_id, admin_id, room_id, notification_type, title, message)
      SELECT 
        cr.site_id,
        ps.site_admin_id,
        cr.id,
        'room_completed'::notification_type,
        'Contribution Room Completed!',
        'The contribution room "' || cr.title || '" has reached its goal of NPR ' || cr.goal_amount || '. Ready to plant ' || cr.target_trees || ' trees!'
      FROM contribution_rooms cr
      JOIN planting_sites ps ON cr.site_id = ps.id
      WHERE cr.id = NEW.room_id AND ps.site_admin_id IS NOT NULL;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_room_amount_trigger
  AFTER INSERT OR UPDATE ON room_contributions
  FOR EACH ROW
  EXECUTE FUNCTION update_room_amount();

-- Function to create notification when individual donation is made
CREATE OR REPLACE FUNCTION create_donation_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    INSERT INTO site_notifications (site_id, admin_id, donation_id, notification_type, title, message)
    SELECT 
      NEW.site_id,
      ps.site_admin_id,
      NEW.id,
      'donation'::notification_type,
      'New Tree Donation Received!',
      'A donation of NPR ' || NEW.amount || ' for ' || NEW.trees_count || ' ' || NEW.tree_species || ' trees has been received.'
    FROM planting_sites ps
    WHERE ps.id = NEW.site_id AND ps.site_admin_id IS NOT NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER create_donation_notification_trigger
  AFTER INSERT OR UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION create_donation_notification();

-- Insert sample contribution rooms
INSERT INTO contribution_rooms (title, description, goal_amount, target_trees, tree_species, site_id, created_by, deadline) 
SELECT 
  'Community Forest Revival',
  'Join hands to plant native trees in Shivapuri National Park. Every small contribution counts towards our green future!',
  50000,
  250,
  'Mixed Native Species',
  ps.id,
  p.id,
  now() + interval '30 days'
FROM planting_sites ps, profiles p 
WHERE ps.name = 'Shivapuri National Park' 
AND p.role = 'main_admin'
LIMIT 1;

INSERT INTO contribution_rooms (title, description, goal_amount, target_trees, tree_species, site_id, created_by, deadline, current_amount) 
SELECT 
  'Sacred Grove Restoration',
  'Help restore the sacred groves around Pashupatinath Temple with traditional tree species.',
  25000,
  125,
  'Sacred Fig (Peepal)',
  ps.id,
  p.id,
  now() + interval '45 days',
  15000
FROM planting_sites ps, profiles p 
WHERE ps.name = 'Pashupatinath Temple Grounds' 
AND p.role = 'main_admin'
LIMIT 1;

INSERT INTO contribution_rooms (title, description, goal_amount, target_trees, tree_species, site_id, created_by, deadline, current_amount) 
SELECT 
  'University Campus Greening',
  'Students and community members unite to make Tribhuvan University campus greener!',
  40000,
  200,
  'Himalayan Oak',
  ps.id,
  p.id,
  now() + interval '60 days',
  28000
FROM planting_sites ps, profiles p 
WHERE ps.name = 'Tribhuvan University Campus' 
AND p.role = 'main_admin'
LIMIT 1;
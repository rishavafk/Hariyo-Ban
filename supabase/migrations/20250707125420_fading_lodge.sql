/*
  # Set up Site Admins for Planting Sites

  1. Create site admin assignments
    - Assign predetermined site admins to planting sites
    - Update planting sites with site_admin_id

  2. Create sample admin users
    - Add site admin profiles
    - Link them to specific planting sites

  3. Update notification system
    - Ensure notifications are sent to site admins when donations are made
*/

-- First, let's create some site admin profiles
INSERT INTO profiles (id, email, full_name, role, city, country) VALUES
(gen_random_uuid(), 'admin.shivapuri@rotaryroots.org', 'Ramesh Shrestha', 'site_admin', 'Kathmandu', 'Nepal'),
(gen_random_uuid(), 'admin.pashupatinath@rotaryroots.org', 'Sita Maharjan', 'site_admin', 'Kathmandu', 'Nepal'),
(gen_random_uuid(), 'admin.swayambhunath@rotaryroots.org', 'Bikash Tamang', 'site_admin', 'Kathmandu', 'Nepal'),
(gen_random_uuid(), 'admin.tribhuvan@rotaryroots.org', 'Dr. Anita Sharma', 'site_admin', 'Kirtipur', 'Nepal'),
(gen_random_uuid(), 'admin.godavari@rotaryroots.org', 'Prakash Thapa', 'site_admin', 'Lalitpur', 'Nepal'),
(gen_random_uuid(), 'admin.chandragiri@rotaryroots.org', 'Maya Gurung', 'site_admin', 'Kathmandu', 'Nepal');

-- Update planting sites with their respective site admins
UPDATE planting_sites 
SET site_admin_id = (SELECT id FROM profiles WHERE email = 'admin.shivapuri@rotaryroots.org')
WHERE name = 'Shivapuri National Park';

UPDATE planting_sites 
SET site_admin_id = (SELECT id FROM profiles WHERE email = 'admin.pashupatinath@rotaryroots.org')
WHERE name = 'Pashupatinath Temple Grounds';

UPDATE planting_sites 
SET site_admin_id = (SELECT id FROM profiles WHERE email = 'admin.swayambhunath@rotaryroots.org')
WHERE name = 'Swayambhunath Heritage Site';

UPDATE planting_sites 
SET site_admin_id = (SELECT id FROM profiles WHERE email = 'admin.tribhuvan@rotaryroots.org')
WHERE name = 'Tribhuvan University Campus';

UPDATE planting_sites 
SET site_admin_id = (SELECT id FROM profiles WHERE email = 'admin.godavari@rotaryroots.org')
WHERE name = 'Godavari Botanical Garden';

UPDATE planting_sites 
SET site_admin_id = (SELECT id FROM profiles WHERE email = 'admin.chandragiri@rotaryroots.org')
WHERE name = 'Chandragiri Hills';

-- Create site_admins entries for the assignments
INSERT INTO site_admins (profile_id, site_id, assigned_by, is_active)
SELECT 
  p.id as profile_id,
  ps.id as site_id,
  (SELECT id FROM profiles WHERE role = 'main_admin' LIMIT 1) as assigned_by,
  true as is_active
FROM profiles p
JOIN planting_sites ps ON ps.site_admin_id = p.id
WHERE p.role = 'site_admin';

-- Add these site admins to admin_users table
INSERT INTO admin_users (profile_id, admin_level, permissions, created_by)
SELECT 
  p.id,
  'site_admin',
  '{"manage_site": true, "view_donations": true, "create_updates": true, "manage_trees": true}'::jsonb,
  (SELECT id FROM profiles WHERE role = 'main_admin' LIMIT 1)
FROM profiles p
WHERE p.role = 'site_admin';

-- Create a function to increment planted trees count
CREATE OR REPLACE FUNCTION increment_planted_trees(site_id uuid, count integer)
RETURNS void AS $$
BEGIN
  UPDATE planting_sites 
  SET planted_trees = planted_trees + count
  WHERE id = site_id;
END;
$$ LANGUAGE plpgsql;

-- Update the donation notification function to ensure it works properly
CREATE OR REPLACE FUNCTION create_donation_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'completed' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'completed') THEN
    -- Notify the site admin
    INSERT INTO site_notifications (site_id, admin_id, donation_id, notification_type, title, message)
    SELECT 
      NEW.site_id,
      ps.site_admin_id,
      NEW.id,
      'donation'::notification_type,
      'New Tree Donation Received!',
      'A donation of NPR ' || NEW.amount || ' for ' || NEW.trees_count || ' ' || NEW.tree_species || ' trees has been received from ' || 
      CASE 
        WHEN NEW.is_anonymous THEN 'an anonymous donor'
        ELSE (SELECT full_name FROM profiles WHERE id = NEW.user_id)
      END || '.'
    FROM planting_sites ps
    WHERE ps.id = NEW.site_id AND ps.site_admin_id IS NOT NULL;

    -- Also notify all site admins assigned to this site
    INSERT INTO site_notifications (site_id, admin_id, donation_id, notification_type, title, message)
    SELECT 
      NEW.site_id,
      sa.profile_id,
      NEW.id,
      'donation'::notification_type,
      'New Tree Donation Received!',
      'A donation of NPR ' || NEW.amount || ' for ' || NEW.trees_count || ' ' || NEW.tree_species || ' trees has been received from ' || 
      CASE 
        WHEN NEW.is_anonymous THEN 'an anonymous donor'
        ELSE (SELECT full_name FROM profiles WHERE id = NEW.user_id)
      END || '.'
    FROM site_admins sa
    WHERE sa.site_id = NEW.site_id 
      AND sa.is_active = true 
      AND sa.profile_id != (SELECT site_admin_id FROM planting_sites WHERE id = NEW.site_id); -- Avoid duplicate notifications
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update planted trees count for existing sites (sample data)
UPDATE planting_sites SET planted_trees = 2847 WHERE name = 'Shivapuri National Park';
UPDATE planting_sites SET planted_trees = 1263 WHERE name = 'Pashupatinath Temple Grounds';
UPDATE planting_sites SET planted_trees = 892 WHERE name = 'Swayambhunath Heritage Site';
UPDATE planting_sites SET planted_trees = 1823 WHERE name = 'Tribhuvan University Campus';
UPDATE planting_sites SET planted_trees = 2156 WHERE name = 'Godavari Botanical Garden';
UPDATE planting_sites SET planted_trees = 987 WHERE name = 'Chandragiri Hills';
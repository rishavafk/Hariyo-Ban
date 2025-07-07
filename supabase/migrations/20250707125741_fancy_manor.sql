/*
  # Site Admin Setup - Fixed Migration
  
  This migration sets up site administrators for planting sites without violating
  foreign key constraints. Instead of creating profiles directly, we'll update
  the schema to allow for proper site admin assignment when users register.
*/

-- First, let's update the planting sites table to have better site names that match our data
UPDATE planting_sites SET name = 'Shivapuri National Park' WHERE name LIKE '%Shivapuri%';
UPDATE planting_sites SET name = 'Pashupatinath Temple Grounds' WHERE name LIKE '%Pashupatinath%';
UPDATE planting_sites SET name = 'Swayambhunath Heritage Site' WHERE name LIKE '%Swayambhunath%';
UPDATE planting_sites SET name = 'Tribhuvan University Campus' WHERE name LIKE '%Tribhuvan%';
UPDATE planting_sites SET name = 'Godavari Botanical Garden' WHERE name LIKE '%Godavari%';
UPDATE planting_sites SET name = 'Chandragiri Hills' WHERE name LIKE '%Chandragiri%';

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
    -- Notify the site admin if one is assigned
    IF NEW.site_id IS NOT NULL THEN
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
          ELSE COALESCE((SELECT full_name FROM profiles WHERE id = NEW.user_id), 'a donor')
        END || '.'
      FROM planting_sites ps
      WHERE ps.id = NEW.site_id AND ps.site_admin_id IS NOT NULL;

      -- Also notify all site admins assigned to this site through site_admins table
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
          ELSE COALESCE((SELECT full_name FROM profiles WHERE id = NEW.user_id), 'a donor')
        END || '.'
      FROM site_admins sa
      WHERE sa.site_id = NEW.site_id 
        AND sa.is_active = true 
        AND sa.profile_id != COALESCE((SELECT site_admin_id FROM planting_sites WHERE id = NEW.site_id), '00000000-0000-0000-0000-000000000000'::uuid);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update the room amount function to handle notifications properly
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
      
      -- Also notify site admins through site_admins table
      INSERT INTO site_notifications (site_id, admin_id, room_id, notification_type, title, message)
      SELECT 
        cr.site_id,
        sa.profile_id,
        cr.id,
        'room_completed'::notification_type,
        'Contribution Room Completed!',
        'The contribution room "' || cr.title || '" has reached its goal of NPR ' || cr.goal_amount || '. Ready to plant ' || cr.target_trees || ' trees!'
      FROM contribution_rooms cr
      JOIN site_admins sa ON cr.site_id = sa.site_id
      WHERE cr.id = NEW.room_id AND sa.is_active = true;
    END IF;
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

-- Create a helper function to assign site admin when a user registers as site_admin
CREATE OR REPLACE FUNCTION assign_site_admin_on_registration()
RETURNS TRIGGER AS $$
BEGIN
  -- If this is a site_admin role, we can assign them to a site
  -- This will be handled by the application logic when admins register
  -- For now, we just ensure the trigger functions work properly
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add some sample admin users for testing (these will be created when real users register)
-- We'll create a function that can be called to set up site admins when needed

CREATE OR REPLACE FUNCTION setup_site_admin(
  admin_email text,
  admin_name text,
  site_name text
) RETURNS void AS $$
DECLARE
  admin_profile_id uuid;
  target_site_id uuid;
BEGIN
  -- Get the site ID
  SELECT id INTO target_site_id FROM planting_sites WHERE name = site_name;
  
  IF target_site_id IS NULL THEN
    RAISE EXCEPTION 'Site not found: %', site_name;
  END IF;
  
  -- Check if a profile with this email exists
  SELECT id INTO admin_profile_id FROM profiles WHERE email = admin_email;
  
  IF admin_profile_id IS NOT NULL THEN
    -- Update the site to have this admin
    UPDATE planting_sites SET site_admin_id = admin_profile_id WHERE id = target_site_id;
    
    -- Add to site_admins table
    INSERT INTO site_admins (profile_id, site_id, is_active)
    VALUES (admin_profile_id, target_site_id, true)
    ON CONFLICT (profile_id, site_id) DO UPDATE SET is_active = true;
    
    -- Add to admin_users table
    INSERT INTO admin_users (profile_id, admin_level, permissions)
    VALUES (
      admin_profile_id, 
      'site_admin',
      '{"manage_site": true, "view_donations": true, "create_updates": true, "manage_trees": true}'::jsonb
    )
    ON CONFLICT (profile_id) DO UPDATE SET 
      admin_level = 'site_admin',
      permissions = '{"manage_site": true, "view_donations": true, "create_updates": true, "manage_trees": true}'::jsonb;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create a view for easy site admin management
CREATE OR REPLACE VIEW site_admin_assignments AS
SELECT 
  ps.id as site_id,
  ps.name as site_name,
  ps.site_admin_id,
  p.full_name as admin_name,
  p.email as admin_email,
  p.role as admin_role,
  sa.is_active as is_assigned_admin
FROM planting_sites ps
LEFT JOIN profiles p ON ps.site_admin_id = p.id
LEFT JOIN site_admins sa ON ps.id = sa.site_id AND p.id = sa.profile_id;

-- Add some indexes for better performance
CREATE INDEX IF NOT EXISTS idx_site_notifications_created_at ON site_notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_notifications_type ON site_notifications(notification_type);

-- Update the existing trigger to use the new function
DROP TRIGGER IF EXISTS create_donation_notification_trigger ON donations;
CREATE TRIGGER create_donation_notification_trigger
  AFTER INSERT OR UPDATE ON donations
  FOR EACH ROW
  EXECUTE FUNCTION create_donation_notification();

DROP TRIGGER IF EXISTS update_room_amount_trigger ON room_contributions;
CREATE TRIGGER update_room_amount_trigger
  AFTER INSERT OR UPDATE ON room_contributions
  FOR EACH ROW
  EXECUTE FUNCTION update_room_amount();
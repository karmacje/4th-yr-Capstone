/*
  # Bantay Baboy - Seed Data Script
  
  This script provides comprehensive test data for the Bantay Baboy application.
  
  ## Instructions:
  1. Run this script in your Supabase SQL Editor after setting up the main schema
  2. Replace 'your-auth-user-id-here' with actual user IDs from auth.users table
  3. Modify email addresses and other data as needed for testing
  
  ## Test Data Includes:
  - Sample user profiles
  - Multiple pigpens with different configurations
  - Sensor nodes with varying statuses
  - Historical sensor readings with different ammonia levels
  - Alert notifications
  - Maintenance schedules
  - Notification preferences
*/

-- First, you'll need to create test users through the Supabase Auth interface or your app
-- Then replace the UUIDs below with the actual user IDs from auth.users

-- Sample User IDs (replace these with actual auth.users IDs)
-- User 1: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' (john@example.com)
-- User 2: 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff' (jane@example.com)

-- Insert sample pigpens
INSERT INTO pigpens (pigpen_id, user_id, name, location_description) VALUES
  ('11111111-2222-3333-4444-555555555555', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'Pigpen A - North', 'North section of the farm, near the main entrance'),
  ('22222222-3333-4444-5555-666666666666', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'Pigpen B - East', 'Eastern section with good ventilation'),
  ('33333333-4444-5555-6666-777777777777', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'Pigpen C - South', 'Southern section with automated feeding'),
  ('44444444-5555-6666-7777-888888888888', 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', 'Pigpen D - West', 'Western section for breeding sows'),
  ('55555555-6666-7777-8888-999999999999', 'bbbbbbbb-cccc-dddd-eeee-ffffffffffff', 'Premium Pen 1', 'High-tech facility with climate control');

-- Insert sensor nodes
INSERT INTO sensor_nodes (sensor_id, pigpen_id, node_label, status, battery_level) VALUES
  ('aaaaaaaa-1111-2222-3333-444444444444', '11111111-2222-3333-4444-555555555555', 'Sensor-A1', 'online', 85),
  ('bbbbbbbb-2222-3333-4444-555555555555', '22222222-3333-4444-5555-666666666666', 'Sensor-B1', 'online', 92),
  ('cccccccc-3333-4444-5555-666666666666', '33333333-4444-5555-6666-777777777777', 'Sensor-C1', 'offline', 15),
  ('dddddddd-4444-5555-6666-777777777777', '44444444-5555-6666-7777-888888888888', 'Sensor-D1', 'online', 67),
  ('eeeeeeee-5555-6666-7777-888888888888', '55555555-6666-7777-8888-999999999999', 'Sensor-P1', 'error', 45);

-- Insert historical sensor readings (last 7 days)
INSERT INTO sensor_readings (sensor_id, timestamp, value_ppm, category) VALUES
  -- Pigpen A readings (generally good)
  ('aaaaaaaa-1111-2222-3333-444444444444', NOW() - INTERVAL '1 hour', 8.5, 'Low'),
  ('aaaaaaaa-1111-2222-3333-444444444444', NOW() - INTERVAL '2 hours', 12.3, 'Medium'),
  ('aaaaaaaa-1111-2222-3333-444444444444', NOW() - INTERVAL '3 hours', 9.1, 'Low'),
  ('aaaaaaaa-1111-2222-3333-444444444444', NOW() - INTERVAL '6 hours', 15.7, 'Medium'),
  ('aaaaaaaa-1111-2222-3333-444444444444', NOW() - INTERVAL '12 hours', 7.2, 'Low'),
  ('aaaaaaaa-1111-2222-3333-444444444444', NOW() - INTERVAL '1 day', 11.8, 'Medium'),
  ('aaaaaaaa-1111-2222-3333-444444444444', NOW() - INTERVAL '2 days', 6.9, 'Low'),
  
  -- Pigpen B readings (some high levels)
  ('bbbbbbbb-2222-3333-4444-555555555555', NOW() - INTERVAL '30 minutes', 28.4, 'High'),
  ('bbbbbbbb-2222-3333-4444-555555555555', NOW() - INTERVAL '1 hour', 32.1, 'High'),
  ('bbbbbbbb-2222-3333-4444-555555555555', NOW() - INTERVAL '2 hours', 19.6, 'Medium'),
  ('bbbbbbbb-2222-3333-4444-555555555555', NOW() - INTERVAL '4 hours', 45.8, 'High'),
  ('bbbbbbbb-2222-3333-4444-555555555555', NOW() - INTERVAL '8 hours', 22.3, 'Medium'),
  ('bbbbbbbb-2222-3333-4444-555555555555', NOW() - INTERVAL '1 day', 38.7, 'High'),
  
  -- Pigpen D readings (critical levels)
  ('dddddddd-4444-5555-6666-777777777777', NOW() - INTERVAL '15 minutes', 78.9, 'Critical'),
  ('dddddddd-4444-5555-6666-777777777777', NOW() - INTERVAL '45 minutes', 82.3, 'Critical'),
  ('dddddddd-4444-5555-6666-777777777777', NOW() - INTERVAL '1 hour', 65.4, 'Critical'),
  ('dddddddd-4444-5555-6666-777777777777', NOW() - INTERVAL '2 hours', 71.2, 'Critical'),
  ('dddddddd-4444-5555-6666-777777777777', NOW() - INTERVAL '3 hours', 58.7, 'High'),
  
  -- Premium Pen readings (excellent)
  ('eeeeeeee-5555-6666-7777-888888888888', NOW() - INTERVAL '20 minutes', 4.2, 'Low'),
  ('eeeeeeee-5555-6666-7777-888888888888', NOW() - INTERVAL '1 hour', 5.8, 'Low'),
  ('eeeeeeee-5555-6666-7777-888888888888', NOW() - INTERVAL '2 hours', 3.9, 'Low'),
  ('eeeeeeee-5555-6666-7777-888888888888', NOW() - INTERVAL '4 hours', 6.1, 'Low'),
  ('eeeeeeee-5555-6666-7777-888888888888', NOW() - INTERVAL '8 hours', 7.3, 'Low');

-- Insert alerts for critical readings
INSERT INTO alerts (reading_id, sent_via_sms, notes) 
SELECT 
  sr.reading_id,
  CASE WHEN sr.category = 'Critical' THEN true ELSE false END,
  CASE 
    WHEN sr.category = 'Critical' THEN 'Immediate attention required - ventilation system check needed'
    WHEN sr.category = 'High' THEN 'Monitor closely - consider increasing ventilation'
    ELSE 'Routine monitoring alert'
  END
FROM sensor_readings sr 
WHERE sr.category IN ('Critical', 'High')
AND sr.timestamp > NOW() - INTERVAL '24 hours';

-- Insert maintenance schedules
INSERT INTO maintenance_schedules (pigpen_id, title, description, due_date, is_recurring, completed) VALUES
  -- Today's tasks
  ('11111111-2222-3333-4444-555555555555', 'Daily Cleaning', 'Clean feeding areas and water systems', NOW() + INTERVAL '2 hours', true, false),
  ('22222222-3333-4444-5555-666666666666', 'Ventilation Check', 'Inspect and clean ventilation fans', NOW() + INTERVAL '4 hours', false, false),
  ('44444444-5555-6666-7777-888888888888', 'Emergency Maintenance', 'Fix ventilation system - critical ammonia levels detected', NOW() + INTERVAL '30 minutes', false, false),
  
  -- Tomorrow's tasks
  ('33333333-4444-5555-6666-777777777777', 'Weekly Deep Clean', 'Complete sanitization of pen area', NOW() + INTERVAL '1 day', true, false),
  ('11111111-2222-3333-4444-555555555555', 'Sensor Calibration', 'Calibrate ammonia sensors', NOW() + INTERVAL '1 day 3 hours', false, false),
  
  -- This week's tasks
  ('22222222-3333-4444-5555-666666666666', 'Feed System Maintenance', 'Service automated feeding equipment', NOW() + INTERVAL '3 days', true, false),
  ('55555555-6666-7777-8888-999999999999', 'Climate Control Service', 'Annual service of HVAC system', NOW() + INTERVAL '5 days', false, false),
  
  -- Completed tasks (for testing)
  ('11111111-2222-3333-4444-555555555555', 'Morning Feed Check', 'Verify all feeding systems operational', NOW() - INTERVAL '2 hours', true, true),
  ('22222222-3333-4444-5555-666666666666', 'Water Quality Test', 'Test water pH and cleanliness', NOW() - INTERVAL '1 day', false, true);

-- Update notification preferences for test users
INSERT INTO notification_preferences (user_id, notify_sms, notify_push, alert_threshold_custom) VALUES
  ('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee', true, true, '{"low": 10, "medium": 25, "high": 50, "critical": 75}'),
  ('bbbbbbbb-cccc-dddd-eeee-ffffffffffff', false, true, '{"low": 8, "medium": 20, "high": 45, "critical": 70}')
ON CONFLICT (user_id) DO UPDATE SET
  notify_sms = EXCLUDED.notify_sms,
  notify_push = EXCLUDED.notify_push,
  alert_threshold_custom = EXCLUDED.alert_threshold_custom;

-- Add some additional historical data for analytics (past week)
DO $$
DECLARE
  sensor_ids UUID[] := ARRAY[
    'aaaaaaaa-1111-2222-3333-444444444444',
    'bbbbbbbb-2222-3333-4444-555555555555',
    'dddddddd-4444-5555-6666-777777777777',
    'eeeeeeee-5555-6666-7777-888888888888'
  ];
  sensor_id UUID;
  day_offset INTEGER;
  hour_offset INTEGER;
  random_ppm NUMERIC;
  reading_category TEXT;
BEGIN
  -- Generate readings for the past 7 days
  FOREACH sensor_id IN ARRAY sensor_ids LOOP
    FOR day_offset IN 1..7 LOOP
      FOR hour_offset IN 0..23 BY 2 LOOP -- Every 2 hours
        -- Generate random but realistic ammonia levels
        random_ppm := CASE 
          WHEN sensor_id = 'aaaaaaaa-1111-2222-3333-444444444444' THEN (RANDOM() * 20 + 5)::NUMERIC(5,2) -- 5-25 ppm
          WHEN sensor_id = 'bbbbbbbb-2222-3333-4444-555555555555' THEN (RANDOM() * 35 + 15)::NUMERIC(5,2) -- 15-50 ppm
          WHEN sensor_id = 'dddddddd-4444-5555-6666-777777777777' THEN (RANDOM() * 40 + 40)::NUMERIC(5,2) -- 40-80 ppm
          ELSE (RANDOM() * 10 + 2)::NUMERIC(5,2) -- 2-12 ppm
        END;
        
        -- Categorize the reading
        reading_category := CASE 
          WHEN random_ppm <= 10 THEN 'Low'
          WHEN random_ppm <= 25 THEN 'Medium'
          WHEN random_ppm <= 50 THEN 'High'
          ELSE 'Critical'
        END;
        
        INSERT INTO sensor_readings (sensor_id, timestamp, value_ppm, category) VALUES
          (sensor_id, NOW() - INTERVAL '1 day' * day_offset - INTERVAL '1 hour' * hour_offset, random_ppm, reading_category);
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

/*
  ## Test User Accounts
  
  Create these test accounts through your Supabase Auth interface or app registration:
  
  1. Primary Test User:
     - Email: john.farmer@example.com
     - Password: TestPass123!
     - Name: John Farmer
     - Phone: +1-555-0123
  
  2. Secondary Test User:
     - Email: jane.manager@example.com
     - Password: TestPass456!
     - Name: Jane Manager
     - Phone: +1-555-0456
  
  ## Data Verification Queries
  
  Run these queries to verify the seed data was inserted correctly:
  
  -- Check pigpens and their sensors
  SELECT p.name, p.location_description, sn.node_label, sn.status, sn.battery_level
  FROM pigpens p
  LEFT JOIN sensor_nodes sn ON p.pigpen_id = sn.pigpen_id
  ORDER BY p.name;
  
  -- Check recent sensor readings
  SELECT p.name, sr.value_ppm, sr.category, sr.timestamp
  FROM sensor_readings sr
  JOIN sensor_nodes sn ON sr.sensor_id = sn.sensor_id
  JOIN pigpens p ON sn.pigpen_id = p.pigpen_id
  WHERE sr.timestamp > NOW() - INTERVAL '24 hours'
  ORDER BY sr.timestamp DESC;
  
  -- Check alerts
  SELECT COUNT(*) as total_alerts, 
         COUNT(CASE WHEN sent_via_sms THEN 1 END) as sms_alerts
  FROM alerts;
  
  -- Check maintenance schedules
  SELECT p.name, ms.title, ms.due_date, ms.completed
  FROM maintenance_schedules ms
  JOIN pigpens p ON ms.pigpen_id = p.pigpen_id
  ORDER BY ms.due_date;
  
  ## Expected Results:
  - 5 pigpens across 2 users
  - 5 sensor nodes with varying statuses
  - 100+ sensor readings spanning 7 days
  - Multiple alerts for high/critical readings
  - 9 maintenance tasks (some completed, some pending)
  - Notification preferences for both users
*/
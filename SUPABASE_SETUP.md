# Supabase Database Setup for Bantay Baboy

This README provides step-by-step instructions to set up your Supabase database for the Bantay Baboy pig farm monitoring application.

## 📋 Prerequisites

1. A Supabase account and project
2. Access to the Supabase SQL Editor
3. Basic understanding of SQL

## 🗄️ Database Schema Overview

The application uses the following main tables:
- **users** - User profiles and information
- **pigpens** - Pig pen locations and details
- **sensor_nodes** - IoT sensor devices
- **sensor_readings** - Ammonia level measurements
- **alerts** - Critical alert notifications
- **maintenance_schedules** - Farm maintenance tasks
- **notification_preferences** - User notification settings

## 🚀 Setup Instructions

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Create a new query or use the existing editor

### Step 2: Execute SQL Commands

Copy and paste each SQL block below into the SQL Editor and execute them **one by one** in the order provided.

---

## 📊 SQL Commands

### 1. Create Users Table

```sql
-- Create users table to extend Supabase auth.users
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  phone_number text,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);
```

### 2. Create Pigpens Table

```sql
-- Create pigpens table
CREATE TABLE IF NOT EXISTS pigpens (
  pigpen_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  location_description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pigpens ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own pigpens"
  ON pigpens
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());
```

### 3. Create Sensor Nodes Table

```sql
-- Create sensor_nodes table
CREATE TABLE IF NOT EXISTS sensor_nodes (
  sensor_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pigpen_id uuid NOT NULL REFERENCES pigpens(pigpen_id) ON DELETE CASCADE,
  node_label text NOT NULL,
  status text NOT NULL DEFAULT 'offline' CHECK (status IN ('online', 'offline', 'error')),
  battery_level integer NOT NULL DEFAULT 100 CHECK (battery_level >= 0 AND battery_level <= 100),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sensor_nodes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage sensors for own pigpens"
  ON sensor_nodes
  FOR ALL
  TO authenticated
  USING (
    pigpen_id IN (
      SELECT pigpen_id FROM pigpens WHERE user_id = auth.uid()
    )
  );
```

### 4. Create Sensor Readings Table

```sql
-- Create sensor_readings table
CREATE TABLE IF NOT EXISTS sensor_readings (
  reading_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id uuid NOT NULL REFERENCES sensor_nodes(sensor_id) ON DELETE CASCADE,
  timestamp timestamptz DEFAULT now(),
  value_ppm numeric(5,2) NOT NULL CHECK (value_ppm >= 0),
  category text NOT NULL DEFAULT 'Low' CHECK (category IN ('Low', 'Medium', 'High', 'Critical'))
);

-- Enable RLS
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read readings from own sensors"
  ON sensor_readings
  FOR SELECT
  TO authenticated
  USING (
    sensor_id IN (
      SELECT sn.sensor_id 
      FROM sensor_nodes sn 
      JOIN pigpens p ON sn.pigpen_id = p.pigpen_id 
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Sensors can insert readings"
  ON sensor_readings
  FOR INSERT
  TO authenticated
  WITH CHECK (true); -- Allow IoT devices to insert readings

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
```

### 5. Create Alerts Table

```sql
-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  alert_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id uuid NOT NULL REFERENCES sensor_readings(reading_id) ON DELETE CASCADE,
  sent_via_sms boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read alerts from own sensors"
  ON alerts
  FOR SELECT
  TO authenticated
  USING (
    reading_id IN (
      SELECT sr.reading_id 
      FROM sensor_readings sr
      JOIN sensor_nodes sn ON sr.sensor_id = sn.sensor_id
      JOIN pigpens p ON sn.pigpen_id = p.pigpen_id 
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert alerts"
  ON alerts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
```

### 6. Create Maintenance Schedules Table

```sql
-- Create maintenance_schedules table
CREATE TABLE IF NOT EXISTS maintenance_schedules (
  schedule_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pigpen_id uuid NOT NULL REFERENCES pigpens(pigpen_id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  due_date timestamptz NOT NULL,
  is_recurring boolean DEFAULT false,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage schedules for own pigpens"
  ON maintenance_schedules
  FOR ALL
  TO authenticated
  USING (
    pigpen_id IN (
      SELECT pigpen_id FROM pigpens WHERE user_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_maintenance_schedules_due_date ON maintenance_schedules(due_date);
```

### 7. Create Notification Preferences Table

```sql
-- Create notification_preferences table
CREATE TABLE IF NOT EXISTS notification_preferences (
  preference_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  notify_sms boolean DEFAULT true,
  notify_push boolean DEFAULT true,
  alert_threshold_custom jsonb DEFAULT '{
    "low": 10,
    "medium": 25,
    "high": 50,
    "critical": 75
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage own notification preferences"
  ON notification_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());
```

### 8. Create Useful Functions

```sql
-- Function to automatically categorize ammonia readings
CREATE OR REPLACE FUNCTION categorize_ammonia_level(ppm numeric)
RETURNS text AS $$
BEGIN
  IF ppm <= 10 THEN
    RETURN 'Low';
  ELSIF ppm <= 25 THEN
    RETURN 'Medium';
  ELSIF ppm <= 50 THEN
    RETURN 'High';
  ELSE
    RETURN 'Critical';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO users (id, email, name, phone_number)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    NEW.raw_user_meta_data->>'phone_number'
  );
  
  -- Create default notification preferences
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 9. Insert Sample Data (Optional)

```sql
-- Insert sample data for testing (optional)
-- Note: Replace the user_id with your actual auth user ID

-- Sample pigpens (you'll need to replace 'your-user-id-here' with actual user ID)
/*
INSERT INTO pigpens (user_id, name, location_description) VALUES
  ('your-user-id-here', 'Pigpen A', 'North Section'),
  ('your-user-id-here', 'Pigpen B', 'East Section'),
  ('your-user-id-here', 'Pigpen C', 'South Section'),
  ('your-user-id-here', 'Pigpen D', 'West Section');
*/
```

---

## 🔧 Verification Steps

After executing all SQL commands, verify your setup:

1. **Check Tables**: Go to **Table Editor** and confirm all tables are created
2. **Check RLS**: Ensure Row Level Security is enabled on all tables
3. **Test Authentication**: Try registering a new user to see if the trigger works
4. **Check Policies**: Verify that policies are created for each table

## 📱 Next Steps

1. Update your React Native app's Supabase client configuration
2. Test user registration and login
3. Start adding pigpens and sensor data through your app
4. Monitor the database for proper data insertion and RLS enforcement

## 🚨 Important Notes

- **Row Level Security (RLS)** is enabled on all tables for data security
- **Triggers** automatically create user profiles and notification preferences
- **Indexes** are added for better query performance
- **Foreign Key Constraints** ensure data integrity
- **Check Constraints** validate data ranges (e.g., battery level 0-100)

## 🔍 Troubleshooting

If you encounter issues:

1. **Permission Errors**: Ensure you're running commands as the project owner
2. **RLS Issues**: Check that policies are correctly defined
3. **Trigger Errors**: Verify the trigger function is created before the trigger
4. **Data Issues**: Check foreign key relationships and constraints

---

**Ready to proceed?** Once you've executed all SQL commands successfully, your Supabase backend will be ready for the Bantay Baboy application!
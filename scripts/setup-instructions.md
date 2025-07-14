# Bantay Baboy - Complete Setup Instructions

## Prerequisites
- Supabase account and project
- Expo CLI installed
- Node.js 18+ installed

## 1. Environment Setup

Create a `.env` file in the project root with your Supabase credentials:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. Database Setup

### Step 1: Create Database Schema
1. Open your Supabase project dashboard
2. Go to SQL Editor
3. Run the complete schema from `SUPABASE_SETUP.md`

### Step 2: Seed Test Data
1. In Supabase SQL Editor, run the script from `scripts/seed-data.sql`
2. **Important**: Replace the placeholder UUIDs with actual user IDs from your auth.users table

## 3. Create Test Users

### Option A: Through the App
1. Run the app: `npm run dev`
2. Register new accounts with these credentials:
   - Email: `john.farmer@example.com`, Password: `TestPass123!`
   - Email: `jane.manager@example.com`, Password: `TestPass456!`

### Option B: Through Supabase Dashboard
1. Go to Authentication > Users in Supabase
2. Create users manually with the above credentials

## 4. Update Seed Data with Real User IDs

After creating test users:

1. Get the user IDs from Supabase Authentication > Users
2. Update the seed script by replacing:
   - `'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee'` with John's user ID
   - `'bbbbbbbb-cccc-dddd-eeee-ffffffffffff'` with Jane's user ID
3. Re-run the seed script

## 5. Install Dependencies

```bash
npm install
```

## 6. Run the Application

```bash
npm run dev
```

## 7. Testing Checklist

### Authentication Flow
- [ ] Welcome screen displays correctly
- [ ] User registration works
- [ ] User login works
- [ ] Auto-navigation after auth works

### Dashboard
- [ ] Sensor data displays
- [ ] Status cards show correct counts
- [ ] Recent alerts appear
- [ ] Today's schedule loads

### Pigpens Tab
- [ ] All pigpens display
- [ ] Sensor status indicators work
- [ ] Ammonia level colors are correct
- [ ] Battery levels display properly

### Analytics Tab
- [ ] Charts render with data
- [ ] Time range filters work
- [ ] Statistics calculate correctly
- [ ] Insights display

### Schedule Tab
- [ ] Calendar shows marked dates
- [ ] Tasks display for selected dates
- [ ] Add task modal works
- [ ] Task completion toggle works

### Profile Tab
- [ ] User information displays
- [ ] Settings can be modified
- [ ] Notification preferences work
- [ ] Logout functionality works

## 8. Troubleshooting

### Common Issues

**Environment Variables Not Loading:**
- Ensure `.env` file is in project root
- Restart the development server
- Check variable names match exactly

**Database Connection Issues:**
- Verify Supabase URL and keys
- Check RLS policies are enabled
- Ensure user has proper permissions

**Navigation Issues:**
- Clear Expo cache: `expo start -c`
- Check all route files exist
- Verify tab configuration

**Data Not Displaying:**
- Check browser console for errors
- Verify seed data was inserted
- Test database queries in Supabase SQL Editor

### Debug Queries

```sql
-- Check if users exist
SELECT id, email, created_at FROM auth.users;

-- Check pigpens for a user
SELECT * FROM pigpens WHERE user_id = 'your-user-id';

-- Check recent sensor readings
SELECT sr.*, sn.node_label, p.name 
FROM sensor_readings sr
JOIN sensor_nodes sn ON sr.sensor_id = sn.sensor_id
JOIN pigpens p ON sn.pigpen_id = p.pigpen_id
ORDER BY sr.timestamp DESC
LIMIT 10;
```

## 9. Production Deployment

### Before Going Live:
1. Update environment variables for production
2. Review and tighten RLS policies
3. Set up proper backup procedures
4. Configure monitoring and alerts
5. Test with real IoT sensor data

### Security Checklist:
- [ ] RLS enabled on all tables
- [ ] API keys secured
- [ ] User data properly isolated
- [ ] Input validation in place
- [ ] Error handling implemented

## Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review Supabase logs in the dashboard
3. Check Expo development tools console
4. Verify all dependencies are correctly installed
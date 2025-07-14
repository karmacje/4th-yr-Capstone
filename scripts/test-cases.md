# Bantay Baboy - Test Cases

## Authentication Tests

### TC001: User Registration
**Objective:** Verify new user can register successfully
**Steps:**
1. Open app and navigate to registration
2. Fill in valid user details
3. Submit registration form
**Expected Result:** User account created, redirected to dashboard
**Test Data:** Use `john.farmer@example.com` with password `TestPass123!`

### TC002: User Login
**Objective:** Verify existing user can login
**Steps:**
1. Navigate to login screen
2. Enter valid credentials
3. Submit login form
**Expected Result:** User authenticated, redirected to dashboard
**Test Data:** Use seeded user credentials

### TC003: Invalid Login
**Objective:** Verify error handling for invalid credentials
**Steps:**
1. Enter incorrect email/password
2. Submit login form
**Expected Result:** Error message displayed, user remains on login screen

## Dashboard Tests

### TC004: Dashboard Data Loading
**Objective:** Verify dashboard displays current farm status
**Steps:**
1. Login as test user
2. Observe dashboard content
**Expected Result:** 
- Status cards show correct counts
- Recent alerts display
- Sensor overview shows all pigpens
- Today's schedule appears

### TC005: Critical Alert Display
**Objective:** Verify critical alerts are prominently displayed
**Steps:**
1. Ensure test data includes critical readings
2. Check dashboard status cards
**Expected Result:** Critical alerts count > 0, displayed in red

## Pigpens Management Tests

### TC006: Pigpen List Display
**Objective:** Verify all user's pigpens are displayed
**Steps:**
1. Navigate to Pigpens tab
2. Observe pigpen list
**Expected Result:** All 4 test pigpens displayed with correct information

### TC007: Sensor Status Indicators
**Objective:** Verify sensor status is correctly indicated
**Steps:**
1. Check each pigpen's sensor status
2. Verify color coding matches status
**Expected Result:** 
- Online sensors: green indicator
- Offline sensors: gray indicator
- Error sensors: red indicator

### TC008: Ammonia Level Color Coding
**Objective:** Verify ammonia levels use correct color coding
**Steps:**
1. Check ammonia readings for each pigpen
2. Verify colors match categories
**Expected Result:**
- Low (≤10 ppm): Green
- Medium (11-25 ppm): Yellow
- High (26-50 ppm): Orange
- Critical (>50 ppm): Red

## Analytics Tests

### TC009: Chart Data Display
**Objective:** Verify analytics charts display historical data
**Steps:**
1. Navigate to Analytics tab
2. Check chart displays data
3. Test time range filters
**Expected Result:** Charts show data for selected time periods

### TC010: Statistics Calculation
**Objective:** Verify statistics are calculated correctly
**Steps:**
1. Check average, min, max values
2. Verify critical events count
**Expected Result:** Statistics match expected values from test data

### TC011: Filter Functionality
**Objective:** Verify filters work correctly
**Steps:**
1. Change time range filter
2. Change pigpen filter
3. Observe chart updates
**Expected Result:** Charts update to reflect filter selections

## Schedule Management Tests

### TC012: Calendar Display
**Objective:** Verify calendar shows scheduled tasks
**Steps:**
1. Navigate to Schedule tab
2. Check calendar for marked dates
**Expected Result:** Dates with tasks are marked with dots

### TC013: Task List for Selected Date
**Objective:** Verify tasks display for selected calendar date
**Steps:**
1. Select a date with scheduled tasks
2. Check task list below calendar
**Expected Result:** All tasks for selected date are displayed

### TC014: Add New Task
**Objective:** Verify new tasks can be created
**Steps:**
1. Tap + button to add task
2. Fill in task details
3. Save task
**Expected Result:** Task created and appears in schedule

### TC015: Task Completion Toggle
**Objective:** Verify tasks can be marked complete/incomplete
**Steps:**
1. Tap checkbox next to a task
2. Observe status change
**Expected Result:** Task status toggles, visual indication updates

## Profile Management Tests

### TC016: Profile Information Display
**Objective:** Verify user profile information is displayed
**Steps:**
1. Navigate to Profile tab
2. Check user information fields
**Expected Result:** Name, email, phone number displayed correctly

### TC017: Profile Editing
**Objective:** Verify user can edit profile information
**Steps:**
1. Tap Edit button
2. Modify user information
3. Save changes
**Expected Result:** Profile updated successfully

### TC018: Notification Settings
**Objective:** Verify notification preferences can be modified
**Steps:**
1. Toggle push notification setting
2. Toggle SMS notification setting
3. Modify threshold values
**Expected Result:** Settings saved and applied

### TC019: Logout Functionality
**Objective:** Verify user can logout successfully
**Steps:**
1. Tap logout button
2. Confirm logout action
**Expected Result:** User logged out, redirected to welcome screen

## Data Integrity Tests

### TC020: Real-time Data Updates
**Objective:** Verify app reflects database changes
**Steps:**
1. Add new sensor reading via SQL
2. Refresh app or wait for auto-refresh
**Expected Result:** New data appears in dashboard and analytics

### TC021: Cross-screen Data Consistency
**Objective:** Verify same data appears consistently across screens
**Steps:**
1. Note ammonia level on dashboard
2. Check same pigpen in Pigpens tab
3. Verify analytics shows same recent reading
**Expected Result:** Data is consistent across all screens

### TC022: User Data Isolation
**Objective:** Verify users only see their own data
**Steps:**
1. Login as first test user
2. Note visible pigpens
3. Login as second test user
4. Check visible pigpens
**Expected Result:** Each user sees only their own pigpens

## Performance Tests

### TC023: App Loading Time
**Objective:** Verify app loads within acceptable time
**Steps:**
1. Launch app
2. Measure time to dashboard display
**Expected Result:** Dashboard loads within 3 seconds

### TC024: Navigation Responsiveness
**Objective:** Verify smooth navigation between tabs
**Steps:**
1. Navigate between all tabs multiple times
2. Observe transition smoothness
**Expected Result:** No lag or stuttering during navigation

## Error Handling Tests

### TC025: Network Error Handling
**Objective:** Verify graceful handling of network issues
**Steps:**
1. Disconnect from internet
2. Try to refresh data
**Expected Result:** Appropriate error message displayed

### TC026: Invalid Data Handling
**Objective:** Verify app handles corrupted/invalid data
**Steps:**
1. Insert invalid data via SQL
2. Check app behavior
**Expected Result:** App doesn't crash, shows appropriate fallback

## Test Data Validation

### Expected Test Data Counts:
- **Users:** 2 test users
- **Pigpens:** 5 total (4 for user 1, 1 for user 2)
- **Sensor Nodes:** 5 (one per pigpen)
- **Sensor Readings:** 100+ historical readings
- **Alerts:** Multiple alerts for high/critical readings
- **Maintenance Schedules:** 9 tasks (mix of completed/pending)

### Data Quality Checks:
```sql
-- Verify user data
SELECT COUNT(*) as user_count FROM users;

-- Verify pigpen distribution
SELECT user_id, COUNT(*) as pigpen_count 
FROM pigpens 
GROUP BY user_id;

-- Verify sensor readings distribution
SELECT category, COUNT(*) as reading_count 
FROM sensor_readings 
GROUP BY category;

-- Verify recent data exists
SELECT COUNT(*) as recent_readings 
FROM sensor_readings 
WHERE timestamp > NOW() - INTERVAL '24 hours';
```

## Automated Testing Setup

### Unit Tests (Future Implementation)
- Component rendering tests
- Utility function tests
- Navigation logic tests

### Integration Tests (Future Implementation)
- API integration tests
- Database query tests
- Authentication flow tests

### End-to-End Tests (Future Implementation)
- Complete user journey tests
- Cross-platform compatibility tests
- Performance benchmarking
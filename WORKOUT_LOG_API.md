# Workout Log API Implementation

## Overview
This document describes the implementation of the workout logging API that saves user workout data to the database. The system automatically saves workout sets as users enter data, with proper normalization following the database schema.

## Database Schema (WorkoutLog)

Each set is saved as a **separate row** in the `WorkoutLog` table:

```prisma
model WorkoutLog {
  id         Int      @id @default(autoincrement())
  templateId Int      // References ExercisePlan.id
  setNo      Int      // Set number (1, 2, 3, ...)
  weight     Float?   // Weight in lbs
  reps       Int?     // Number of reps
  userId     Int      // User who logged this
  date       DateTime // Date of workout
  createdAt  DateTime
  updatedAt  DateTime
}
```

### Data Normalization
- **Same exercise, different sets** = Multiple rows with same `templateId`, `userId`, `date` but different `setNo`
- Each set is independent and can be updated/deleted separately
- Unique constraint: `[templateId, setNo, userId, date]` prevents duplicate sets

## API Implementation

### File Structure
```
src/app/api/workout-log/
└── actions.ts          # Server actions for workout logging
```

### Available Actions

#### 1. `saveWorkoutSet()`
Saves or updates a single workout set.

**Parameters:**
- `exerciseId` (number): ID of the exercise
- `muscleGroupName` (string): Name of muscle group (e.g., "Chest", "Back")
- `setNo` (number): Set number (1, 2, 3, etc.)
- `weight` (number | null): Weight used in lbs
- `reps` (number | null): Number of reps performed
- `date` (string): Date in ISO format (YYYY-MM-DD)

**Process:**
1. Authenticates user via NextAuth session
2. Finds or creates `ExercisePlan` entry (template)
3. Upserts `WorkoutLog` entry (update if exists, create if not)
4. Returns success/error response

**Example:**
```typescript
const result = await saveWorkoutSet(
  12,        // exerciseId
  "Chest",   // muscleGroupName
  1,         // setNo
  135.5,     // weight
  10,        // reps
  "2025-10-12" // date
)
```

#### 2. `deleteWorkoutSet()`
Deletes a specific workout set.

**Parameters:**
- `exerciseId` (number)
- `muscleGroupName` (string)
- `setNo` (number)
- `date` (string)

**Process:**
1. Authenticates user
2. Finds the corresponding `ExercisePlan`
3. Deletes the specific `WorkoutLog` entry
4. Returns success/error response

#### 3. `getWorkoutLogsByDate()`
Retrieves all workout logs for a specific date.

**Parameters:**
- `date` (string): Date in ISO format

**Returns:**
Array of workout sets with exercise and muscle group details

**Example Response:**
```typescript
{
  success: true,
  data: [
    {
      id: "set-123",
      exerciseId: 12,
      exerciseName: "Bench Press",
      muscleGroup: "Chest",
      setNo: 1,
      weight: 135.5,
      reps: 10,
      completed: true
    },
    // ... more sets
  ]
}
```

## Frontend Integration

### Component: `log-workout-today.tsx`

#### Auto-Save Feature
The component implements **debounced auto-save** that automatically saves data as users type:

1. **User types weight/reps** → Updates local state immediately (optimistic UI)
2. **Debounce timer** → Waits 1 second after user stops typing
3. **API call** → Automatically saves to database
4. **Loading indicator** → Shows "Saving..." while request is in progress
5. **Error handling** → Shows toast notification if save fails

```typescript
// Debounced auto-save implementation
const updateExerciseSet = (setId: string, updates: Partial<ExerciseSet>) => {
  // Update UI immediately
  setCurrentWorkoutSession(prev => { /* ... */ })
  
  // Clear existing timer
  if (existingTimer) clearTimeout(existingTimer)
  
  // Set saving state
  setSavingSetIds(prev => new Set(prev).add(setId))
  
  // Debounced save after 1 second
  const timer = setTimeout(async () => {
    await saveSetToAPI(updatedSet)
    setSavingSetIds(prev => { /* remove from saving */ })
  }, 1000)
}
```

#### Data Flow

1. **Start Workout** → Loads any existing workout data for today
2. **Select Muscle Group** → Shows available exercises
3. **Select Exercise** → Shows set logging interface
4. **Add Set** → Creates new set with `setNo` auto-incremented
5. **Enter Weight/Reps** → Auto-saves after 1 second of inactivity
6. **Delete Set** → Removes from UI and database (with optimistic updates)

#### Error Handling

**Save Failures:**
- Shows error toast notification
- Console logs error for debugging
- Data remains in local state (can retry)

**Delete Failures:**
- Shows error toast
- Restores deleted set to UI (rollback)
- Maintains data consistency

**Loading Failures:**
- Shows error toast
- Still allows user to start fresh workout
- Graceful degradation

## Key Features

### ✅ Automatic Saving
- No "Save" button needed
- Saves automatically when user leaves input field
- Debounced to prevent excessive API calls

### ✅ Data Persistence
- Loads existing workout data when session starts
- User can close and reopen app without losing data
- All changes saved to database in real-time

### ✅ Proper Normalization
- Each set is a separate database row
- Follows third normal form (3NF)
- Efficient queries and updates

### ✅ User Experience
- **Optimistic UI updates** - Changes appear instantly
- **Loading indicators** - Shows "Saving..." during API calls
- **Toast notifications** - User feedback for errors
- **Rollback on errors** - Restores state if operations fail

## Testing the Implementation

### Manual Testing Steps

1. **Start a workout:**
   ```
   - Navigate to /log-workout
   - Click "Start Today's Workout"
   - Verify existing data loads (if any)
   ```

2. **Add and save sets:**
   ```
   - Select a muscle group (e.g., Chest)
   - Select an exercise (e.g., Bench Press)
   - Click "Add Set"
   - Enter weight (e.g., 135)
   - Enter reps (e.g., 10)
   - Wait 1 second
   - Verify "Saving..." indicator appears then disappears
   ```

3. **Verify database:**
   ```sql
   SELECT * FROM workout_log 
   WHERE user_id = <user_id> 
   AND date = CURRENT_DATE;
   ```

4. **Test auto-save:**
   ```
   - Change weight value
   - Wait 1 second
   - Check database - value should update
   ```

5. **Test delete:**
   ```
   - Click trash icon on a set
   - Verify set disappears from UI
   - Check database - row should be deleted
   ```

6. **Test persistence:**
   ```
   - Add several sets
   - Refresh the page
   - Click "Start Today's Workout"
   - Verify all sets load back
   ```

## Database Queries

### Get all sets for a user on a specific date:
```sql
SELECT 
  wl.*,
  e.exercise_name,
  mg.name as muscle_group
FROM workout_log wl
JOIN exercise_plan ep ON wl.template_id = ep.id
JOIN exercises e ON ep.exercise_id = e.id
JOIN muscle_group mg ON ep.exercise_group_id = mg.id
WHERE wl.user_id = <user_id>
AND wl.date = '<date>'
ORDER BY mg.name, e.exercise_name, wl.set_no;
```

### Get workout summary for a date:
```sql
SELECT 
  mg.name as muscle_group,
  e.exercise_name,
  COUNT(*) as total_sets,
  SUM(wl.reps) as total_reps,
  AVG(wl.weight) as avg_weight
FROM workout_log wl
JOIN exercise_plan ep ON wl.template_id = ep.id
JOIN exercises e ON ep.exercise_id = e.id
JOIN muscle_group mg ON ep.exercise_group_id = mg.id
WHERE wl.user_id = <user_id>
AND wl.date = '<date>'
GROUP BY mg.name, e.exercise_name;
```

## Future Enhancements

### Potential Improvements:
1. **Rest timer** - Countdown timer between sets
2. **Previous workout data** - Show last workout's weight/reps as reference
3. **Personal records** - Track and highlight PRs
4. **Workout templates** - Save and reuse common workout routines
5. **Notes field** - Add notes per set (e.g., "felt easy", "good form")
6. **Volume tracking** - Calculate total volume (sets × reps × weight)
7. **Workout duration** - Track start/end time of workout
8. **Exercise history** - View all historical data for an exercise
9. **Charts/graphs** - Visualize progress over time
10. **Export data** - Download workout history as CSV

## Security Considerations

### Current Implementation:
- ✅ **Authentication required** - All actions check user session
- ✅ **User isolation** - Users can only access their own data
- ✅ **SQL injection protection** - Using Prisma ORM with parameterized queries
- ✅ **Input validation** - Type checking via TypeScript
- ✅ **CSRF protection** - NextAuth handles CSRF tokens

### Recommendations:
- Add rate limiting to prevent API abuse
- Add input validation for weight/reps ranges
- Log suspicious activities
- Add data backup/recovery mechanisms

## Troubleshooting

### Common Issues:

**Problem:** Sets not saving
- Check browser console for errors
- Verify user is authenticated (session exists)
- Check database connection
- Verify `ExercisePlan` exists for the exercise

**Problem:** Duplicate sets created
- Check unique constraint in database
- Verify `setNo` is being calculated correctly
- Check for race conditions in concurrent saves

**Problem:** Data not loading on refresh
- Check `getWorkoutLogsByDate()` function
- Verify date format is correct (YYYY-MM-DD)
- Check database timezone settings

**Problem:** Auto-save too slow/fast
- Adjust debounce timeout in component (currently 1000ms)
- Consider network conditions
- Check server response times

## Conclusion

This implementation provides a robust, user-friendly workout logging system with:
- ✅ Automatic data persistence
- ✅ Proper database normalization
- ✅ Excellent user experience
- ✅ Error handling and recovery
- ✅ Scalable architecture

The system is production-ready and can handle multiple users logging workouts simultaneously with proper data isolation and consistency.


-- ===========================================================
-- 1️⃣ ENUM TYPES
-- ===========================================================
CREATE TYPE muscle_group_enum AS ENUM (
  'Chest', 'Back', 'Shoulder', 'Legs', 'Bicep', 'Tricep', 'Abs', 'Cardio'
);

CREATE TYPE activity_status_enum AS ENUM (
  'pending', 'completed'
);

-- ===========================================================
-- 2️⃣ USERS
-- ===========================================================
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  image TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================================
-- 3️⃣ MUSCLE GROUP
-- ===========================================================
CREATE TABLE muscle_group (
  id SERIAL PRIMARY KEY,
  name muscle_group_enum UNIQUE NOT NULL
);

-- ===========================================================
-- 4️⃣ EXERCISES (Master list of exercises)
-- ===========================================================
CREATE TABLE exercises (
  id SERIAL PRIMARY KEY,
  muscle_group_id INT NOT NULL REFERENCES muscle_group(id) ON DELETE CASCADE,
  exercise_name VARCHAR(100) NOT NULL,
  image TEXT,
  added_by INT REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================================
-- 5️⃣ EXERCISE TEMPLATE (User’s custom workout plan per muscle group)
-- ===========================================================
CREATE TABLE exercise_template (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  exercise_group_id INT NOT NULL REFERENCES muscle_group(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (user_id, exercise_group_id)
);

-- ===========================================================
-- 6️⃣ EXERCISE SET (User’s workout logs)
-- ===========================================================
CREATE TABLE exercise_set (
  id SERIAL PRIMARY KEY,
  template_id INT NOT NULL REFERENCES exercise_template(id) ON DELETE CASCADE,
  set_no INT NOT NULL,
  weight FLOAT,
  reps INT,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (template_id, set_no, user_id, date)
);

-- ===========================================================
-- 7️⃣ ACTIVITY TEMPLATE (User’s daily activity plan)
-- ===========================================================
CREATE TABLE activity_template (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  activities TEXT[] NOT NULL, -- e.g. ['10K steps', '8 glass water']
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================================
-- 8️⃣ ACTIVITIES (Tracking completion status)
-- ===========================================================
CREATE TABLE activities (
  id SERIAL PRIMARY KEY,
  activity_template_id INT NOT NULL REFERENCES activity_template(id) ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status activity_status_enum DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================================
-- ✅ Optional Indexes (for performance)
-- ===========================================================
CREATE INDEX idx_exercise_user ON exercises(added_by);
CREATE INDEX idx_exercise_template_user ON exercise_template(user_id);
CREATE INDEX idx_exercise_set_user ON exercise_set(user_id);
CREATE INDEX idx_activity_template_user ON activity_template(user_id);
CREATE INDEX idx_activities_user ON activities(user_id);

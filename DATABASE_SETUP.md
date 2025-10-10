# 🗄️ Database Setup Guide

This guide walks you through setting up and using Prisma with your PostgreSQL database.

---

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Database Commands](#database-commands)
4. [File Structure](#file-structure)
5. [Usage Examples](#usage-examples)
6. [Common Issues](#common-issues)

---

## 🔧 Prerequisites

Make sure your `.env` file is properly configured with:

```env
DATABASE_URL="postgres://your-connection-string"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

---

## 🚀 Initial Setup

### Step 1: Generate Prisma Client
This creates the TypeScript types and client code from your schema.

```bash
npm run db:generate
```

**What it does:**
- Reads `prisma/schema.prisma`
- Generates `@prisma/client` with TypeScript types
- Creates methods for all your models (User, Exercise, etc.)

### Step 2: Push Schema to Database
This syncs your Prisma schema with your actual database.

```bash
npm run db:push
```

**What it does:**
- Creates/updates tables in your PostgreSQL database
- Does NOT create migration files (quick for dev)
- Ideal for prototyping

**Alternative: Use Migrations (Production Recommended)**
```bash
npm run db:migrate
```
This creates migration files in `prisma/migrations/` for version control.

### Step 3: Seed Initial Data (Optional)
Populate your database with test data.

```bash
npm run db:seed
```

**What it seeds:**
- All 8 muscle groups (Chest, Back, Shoulder, etc.)
- Test user: `test@example.com` / `password123`
- Sample exercises (Bench Press, Pull-ups, etc.)

---

## 🛠️ Database Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `npm run db:generate` | Generate Prisma Client | After changing schema.prisma |
| `npm run db:push` | Sync schema to database | Development (quick prototyping) |
| `npm run db:migrate` | Create migration files | Production (version control) |
| `npm run db:studio` | Open visual database browser | View/edit data visually |
| `npm run db:seed` | Populate initial data | First setup or reset |

---

## 📁 File Structure

```
building-tracker/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── seed.ts                # Seed script for initial data
├── src/
│   └── lib/
│       ├── db.ts              # Prisma client singleton
│       └── auth.ts            # NextAuth config with DB
└── .env                       # Database connection string
```

---

## 💻 Usage Examples

### Import the Database Client

```typescript
import { db } from '@/lib/db'
```

### 1️⃣ Create a New User

```typescript
const newUser = await db.user.create({
  data: {
    email: 'john@example.com',
    name: 'John Doe',
    password: 'hashedPassword123' // Use bcrypt in production!
  }
})
```

### 2️⃣ Find a User by Email

```typescript
const user = await db.user.findUnique({
  where: { email: 'john@example.com' }
})
```

### 3️⃣ Get All Muscle Groups

```typescript
const muscleGroups = await db.muscleGroup.findMany()
```

### 4️⃣ Create Exercise Template with Sets

```typescript
const template = await db.exerciseTemplate.create({
  data: {
    name: 'Chest Day Workout',
    userId: 1,
    exerciseGroupId: 1, // Chest
    exerciseSets: {
      create: [
        { setNo: 1, weight: 60, reps: 10, userId: 1, date: new Date() },
        { setNo: 2, weight: 65, reps: 8, userId: 1, date: new Date() }
      ]
    }
  },
  include: {
    exerciseSets: true
  }
})
```

### 5️⃣ Get User's Workout History

```typescript
const workoutHistory = await db.exerciseSet.findMany({
  where: {
    userId: 1,
    date: {
      gte: new Date('2025-10-01'),
      lte: new Date('2025-10-31')
    }
  },
  include: {
    template: {
      include: {
        muscleGroup: true
      }
    }
  },
  orderBy: {
    date: 'desc'
  }
})
```

### 6️⃣ Create Activity Template

```typescript
const activityTemplate = await db.activityTemplate.create({
  data: {
    userId: 1,
    date: new Date(),
    activities: ['10K steps', '8 glasses of water', '7 hours sleep']
  }
})
```

### 7️⃣ Update Activity Status

```typescript
await db.activity.update({
  where: { id: 1 },
  data: { status: 'completed' }
})
```

---

## 🔍 Prisma Studio (Visual Database Browser)

View and edit your database visually:

```bash
npm run db:studio
```

This opens a browser at `http://localhost:5555` where you can:
- ✅ View all tables and data
- ✅ Add/edit/delete records
- ✅ Filter and search data
- ✅ See relationships visually

---

## 🐛 Common Issues

### Issue 1: "Environment variable not found: DATABASE_URL"

**Solution:** Make sure your `.env` file exists and contains `DATABASE_URL`.

```bash
cp env.example .env
# Edit .env with your actual database credentials
```

### Issue 2: "Can't reach database server"

**Solution:** Check your database connection string and ensure the database is running.

### Issue 3: Type errors after schema changes

**Solution:** Regenerate Prisma Client:

```bash
npm run db:generate
```

### Issue 4: Migration conflicts

**Solution:** Reset database (⚠️ WARNING: Deletes all data):

```bash
npx prisma migrate reset
```

---

## 🔐 Security Best Practices

### ⚠️ IMPORTANT: Password Hashing

The current setup uses plain text passwords (INSECURE). For production:

1. Install bcrypt:
```bash
npm install bcrypt
npm install -D @types/bcrypt
```

2. Hash passwords when creating users:
```typescript
import bcrypt from 'bcrypt'

const hashedPassword = await bcrypt.hash(password, 10)
const user = await db.user.create({
  data: {
    email,
    name,
    password: hashedPassword
  }
})
```

3. Compare passwords in auth.ts:
```typescript
const isValid = await bcrypt.compare(credentials.password, user.password)
```

### Other Security Tips:
- ✅ Never commit `.env` to git
- ✅ Use strong `NEXTAUTH_SECRET` (generate with `openssl rand -base64 32`)
- ✅ Add rate limiting to login endpoints
- ✅ Validate and sanitize all user inputs
- ✅ Use prepared statements (Prisma does this automatically)

---

## 📚 Learn More

- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)

---

## 🎉 You're Ready!

Your database is now configured and ready to use. Start your dev server:

```bash
npm run dev
```

Visit `http://localhost:3000` and try logging in with:
- **Email:** test@example.com
- **Password:** password123

Happy coding! 🚀


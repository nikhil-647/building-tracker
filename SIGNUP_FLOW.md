# 🔐 Signup Flow Documentation

Complete guide to understanding and using the signup functionality.

---

## 📋 Overview

The signup flow uses:
- ✅ **Next.js Server Actions** - For secure server-side processing
- ✅ **Zod Validation** - Type-safe schema validation
- ✅ **Prisma ORM** - Database operations
- ✅ **NextAuth** - Automatic authentication after signup
- ✅ **React Form Hooks** - Progressive enhancement with `useFormState`

---

## 🏗️ Architecture

```
User fills form (signup/page.tsx)
    ↓
Submits via Server Action (signup/actions.ts)
    ↓
Zod validates data
    ↓
Check for existing user (Prisma)
    ↓
Create new user in database
    ↓
Auto sign-in with NextAuth
    ↓
Redirect to dashboard
```

---

## 📁 File Structure

```
src/
├── app/
│   └── signup/
│       ├── page.tsx          # Signup UI with form
│       └── actions.ts        # Server action with validation
└── lib/
    ├── db.ts                 # Prisma client
    └── auth.ts               # NextAuth configuration
```

---

## 🔍 Code Breakdown

### 1. Signup Page (`src/app/signup/page.tsx`)

**Key Features:**
- Uses `useFormState` for server-side validation errors
- Uses `useFormStatus` for loading states
- Shows field-level and form-level errors
- Progressive enhancement (works without JS)

**Important Parts:**

```typescript
// Hook to manage form state and errors
const [state, formAction] = useFormState(signup, { errors: {} });

// Submit button with loading state
function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>
    {pending ? "Creating account..." : "Create Account"}
  </Button>
}

// Form submission (no onSubmit needed!)
<form action={formAction}>
  <Input name="email" /> {/* name attribute is crucial! */}
  {state.errors?.email && <p>{state.errors.email[0]}</p>}
</form>
```

**Why this approach?**
- ✅ Works without JavaScript (progressive enhancement)
- ✅ Server-side validation (secure)
- ✅ Automatic error handling
- ✅ Built-in loading states

---

### 2. Signup Action (`src/app/signup/actions.ts`)

**Key Features:**
- Server-side only ("use server" directive)
- Zod validation with custom error messages
- Duplicate email checking
- Automatic sign-in after registration

**Validation Schema:**

```typescript
const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
})
```

**Flow Steps:**

1. **Extract form data**
   ```typescript
   const rawFormData = {
     name: formData.get('name'),
     email: formData.get('email'),
     password: formData.get('password'),
     confirmPassword: formData.get('confirmPassword')
   }
   ```

2. **Validate with Zod**
   ```typescript
   const validatedFields = signupSchema.safeParse(rawFormData)
   if (!validatedFields.success) {
     return { errors: validatedFields.error.flatten().fieldErrors }
   }
   ```

3. **Check for existing user**
   ```typescript
   const existingUser = await db.user.findUnique({
     where: { email }
   })
   if (existingUser) {
     return { errors: { email: ['Email already exists'] } }
   }
   ```

4. **Create user**
   ```typescript
   const newUser = await db.user.create({
     data: { name, email, password: hashedPassword }
   })
   ```

5. **Auto sign-in**
   ```typescript
   await signIn('credentials', {
     email,
     password,
     redirect: false
   })
   ```

6. **Redirect to dashboard**
   ```typescript
   redirect('/dashboard')
   ```

---

## 🎯 Validation Rules

| Field | Rules | Error Messages |
|-------|-------|----------------|
| **Name** | Min 2 characters | "Name must be at least 2 characters" |
| **Email** | Valid email format | "Invalid email address" |
| **Password** | Min 8 characters | "Password must be at least 8 characters" |
| **Confirm Password** | Must match password | "Passwords don't match" |

**Additional Checks:**
- Email uniqueness (no duplicates)
- All fields required

---

## 🧪 Testing Guide

### Test Case 1: Valid Signup
**Steps:**
1. Navigate to `/signup`
2. Fill in:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "password123"
   - Confirm: "password123"
3. Click "Create Account"

**Expected:**
- ✅ User created in database
- ✅ Automatically signed in
- ✅ Redirected to `/dashboard`

### Test Case 2: Duplicate Email
**Steps:**
1. Try signing up with existing email

**Expected:**
- ❌ Error: "An account with this email already exists"
- ❌ Form not submitted

### Test Case 3: Password Mismatch
**Steps:**
1. Enter different passwords in password fields

**Expected:**
- ❌ Error under Confirm Password: "Passwords don't match"

### Test Case 4: Invalid Email
**Steps:**
1. Enter "notanemail" in email field

**Expected:**
- ❌ Error: "Invalid email address"

### Test Case 5: Short Password
**Steps:**
1. Enter "pass" in password field

**Expected:**
- ❌ Error: "Password must be at least 8 characters"

### Test Case 6: Short Name
**Steps:**
1. Enter "J" in name field

**Expected:**
- ❌ Error: "Name must be at least 2 characters"

---

## 🔐 Security Considerations

### ⚠️ CURRENT STATE (Development)

**Plain Text Passwords:**
```typescript
// ❌ INSECURE - Current implementation
const hashedPassword = password
```

This is **ONLY FOR DEVELOPMENT**. Never use in production!

### ✅ PRODUCTION READY (Recommended)

**Install bcrypt:**
```bash
npm install bcrypt
npm install -D @types/bcrypt
```

**Update `signup/actions.ts`:**
```typescript
import bcrypt from 'bcrypt'

// Hash password before storing
const hashedPassword = await bcrypt.hash(password, 10)

const newUser = await db.user.create({
  data: {
    name,
    email,
    password: hashedPassword // Store hashed version
  }
})
```

**Update `lib/auth.ts`:**
```typescript
// Compare hashed password
const isPasswordValid = await bcrypt.compare(
  credentials.password,
  user.password
)
```

### Other Security Best Practices

1. **Rate Limiting**
   - Limit signup attempts per IP
   - Prevent spam registrations
   - Use packages like `express-rate-limit` or Vercel's edge rate limiting

2. **Email Verification**
   - Send verification email after signup
   - Don't allow login until verified
   - Prevents fake account creation

3. **CAPTCHA**
   - Add reCAPTCHA or hCaptcha
   - Prevents bot signups
   - Add to form submission

4. **Strong Password Policy**
   ```typescript
   password: z.string()
     .min(8)
     .regex(/[A-Z]/, 'Must contain uppercase')
     .regex(/[a-z]/, 'Must contain lowercase')
     .regex(/[0-9]/, 'Must contain number')
     .regex(/[^A-Za-z0-9]/, 'Must contain special character')
   ```

5. **Sanitize Inputs**
   - Zod handles type validation
   - Consider adding XSS protection for name field
   - Prisma prevents SQL injection automatically

---

## 🐛 Error Handling

### Field-Level Errors
Display below each input:
```tsx
{state.errors?.email && (
  <p className="text-sm text-red-600">
    {state.errors.email[0]}
  </p>
)}
```

### Form-Level Errors
Display at top of form:
```tsx
{state.errors?._form && (
  <div className="bg-red-50 border border-red-200">
    {state.errors._form.map((error) => (
      <p>{error}</p>
    ))}
  </div>
)}
```

### Database Errors
Caught in try-catch:
```typescript
try {
  // database operations
} catch (error) {
  return {
    errors: {
      _form: ['Something went wrong. Please try again.']
    }
  }
}
```

---

## 🎨 UI/UX Features

### Loading States
- ✅ Button shows "Creating account..." while submitting
- ✅ Button disabled during submission
- ✅ Prevents double submissions

### Error Styling
- ✅ Red border on invalid inputs: `border-red-500`
- ✅ Error icon (AlertCircle) next to messages
- ✅ Error banner for form-level issues

### Progressive Enhancement
- ✅ Works without JavaScript
- ✅ Form submits via server action
- ✅ Validation happens server-side
- ✅ Enhanced with client-side feedback

---

## 🚀 Usage Examples

### Basic Signup Flow

1. **User visits `/signup`**
2. **User fills out form**
3. **User clicks "Create Account"**
4. **Server validates data**
5. **If valid:**
   - User created
   - Automatically signed in
   - Redirected to dashboard
6. **If invalid:**
   - Errors shown below fields
   - Form not submitted
   - User can correct and retry

### Programmatic User Creation

If you need to create users programmatically (e.g., seed data):

```typescript
import { db } from '@/lib/db'
// import bcrypt from 'bcrypt' // For production

async function createUser(name: string, email: string, password: string) {
  // Hash password (production)
  // const hashedPassword = await bcrypt.hash(password, 10)
  
  const user = await db.user.create({
    data: {
      name,
      email,
      password // Use hashedPassword in production
    }
  })
  
  return user
}
```

---

## 📊 Database Schema

The `users` table stores:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique @db.VarChar(100)
  name      String   @db.VarChar(100)
  password  String   @db.VarChar(255)
  image     String?  @db.Text
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

---

## 🔄 Next Steps

### Recommended Enhancements

1. **Add bcrypt password hashing** ⚠️ CRITICAL
2. **Email verification system**
3. **Password strength meter**
4. **Social OAuth (Google, GitHub)**
5. **Terms of service acceptance**
6. **CAPTCHA integration**
7. **Rate limiting**
8. **Welcome email**

### Related Features to Build

- Password reset flow
- Profile editing
- Account deletion
- Two-factor authentication
- Session management
- Activity logging

---

## 📚 Learn More

- [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations)
- [Zod Documentation](https://zod.dev)
- [NextAuth.js Guide](https://next-auth.js.org)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)

---

## ✅ Checklist Before Production

- [ ] Implement bcrypt password hashing
- [ ] Add email verification
- [ ] Set up rate limiting
- [ ] Add CAPTCHA
- [ ] Configure proper error logging (Sentry, etc.)
- [ ] Add terms of service acceptance
- [ ] Test all validation scenarios
- [ ] Implement password strength requirements
- [ ] Add monitoring/analytics
- [ ] Set up proper environment variables

---

**🎉 Your signup flow is now complete and ready for testing!**

Visit `/signup` to try it out. Make sure your database is set up (see `DATABASE_SETUP.md`).


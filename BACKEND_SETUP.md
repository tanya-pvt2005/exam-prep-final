# 🚀 Backend Setup & MySQL Connection Guide

## ✅ Backend Files Status

All backend files have been created successfully:

```
✓ index.js                    - Main server file
✓ controller/authController.js      - Authentication logic
✓ controller/topicController.js     - Topics CRUD
✓ controller/quizController.js      - Quiz management
✓ routes/authRoute.js              - Auth endpoints
✓ routes/topicRoute.js             - Topic endpoints
✓ routes/quizRoute.js              - Quiz endpoints
✓ middleware/authMiddleware.js      - JWT verification
✓ prisma/schema.prisma             - Database schema
✓ .env                             - Configuration (UPDATE WITH YOUR PASSWORD)
✓ package.json                     - Dependencies
```

## 🔧 MySQL Connection Setup

### Current `.env` Configuration:
```properties
DATABASE_URL="mysql://root:root@localhost:3306/exam_prep_db"
JWT_SECRET="exam_prep_secret_key_2025_secure_token"
PORT=5000
```

### Prerequisites:
1. **MySQL Server** must be installed and running
2. **Node.js** (v14+) installed
3. **npm** or yarn

---

## 📋 Step-by-Step Connection Guide

### Step 1️⃣: Install MySQL (if not already installed)

**Windows:**
- Download: https://dev.mysql.com/downloads/mysql/
- Run installer and follow prompts
- Note the root password you set

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
```

### Step 2️⃣: Create Database

Open Terminal/Command Prompt and run:
```bash
mysql -u root -p
```

Enter your MySQL root password, then execute:

```sql
CREATE DATABASE exam_prep_db;
EXIT;
```

### Step 3️⃣: Update `.env` File (if needed)

If you set a different password during MySQL installation, update:

```
DATABASE_URL="mysql://root:YOUR_ACTUAL_PASSWORD@localhost:3306/exam_prep_db"
```

### Step 4️⃣: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- express (web framework)
- @prisma/client (database ORM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT auth)
- cors (cross-origin support)
- dotenv (environment variables)

### Step 5️⃣: Initialize Database with Prisma

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema to MySQL database (creates all tables)
npm run prisma:push
```

**Expected output:**
```
Prisma schema loaded from prisma/schema.prisma
✔ Warnings validating datasource `db`: verified
✔ Datasource `db`: SQLite (file)
Database created!
✔ Tables created!
```

### Step 6️⃣: Verify Database Connection

Option A - Using Prisma Studio (Recommended):
```bash
npm run prisma:studio
```
Opens http://localhost:5555 - You should see empty User, Topic, Quiz, Question, QuizResult tables.

Option B - Using MySQL directly:
```bash
mysql -u root -p exam_prep_db
SHOW TABLES;
```

### Step 7️⃣: Start the Backend Server

```bash
# Development mode (with auto-reload)
npm run dev

# Or production mode
npm start
```

**Expected output:**
```
Server is running on http://localhost:5000
```

---

## ✅ Testing the Connection

### Test 1: Backend Server Status
```
GET http://localhost:5000/
Expected Response: { "message": "ExamPrep App Backend is running!" }
```

### Test 2: User Registration
```
POST http://localhost:5000/api/auth/register
Body: {
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123"
}
Expected Response: { "token": "...", "user": { "id": 1, ... } }
```

### Test 3: Check Database
```bash
npm run prisma:studio
# Should show user created in User table
```

---

## 🐛 Troubleshooting

### ❌ "Access denied for user 'root'"
**Solution:**
```bash
# Verify MySQL is running
mysql -u root -p

# If denied, reset password
# Windows: https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html
# macOS/Linux: https://dev.mysql.com/doc/refman/8.0/en/resetting-permissions.html
```

### ❌ "Cannot connect to MySQL server"
**Solution:**
```bash
# Start MySQL
# Windows: NET START MySQL80
# macOS: brew services start mysql
# Linux: sudo systemctl start mysql
```

### ❌ "Database 'exam_prep_db' does not exist"
**Solution:**
```bash
mysql -u root -p
CREATE DATABASE exam_prep_db;
EXIT;
```

### ❌ "@prisma/client" not found
**Solution:**
```bash
npm install
npm run prisma:generate
```

### ❌ "Port 5000 already in use"
**Solution:**
```bash
# Change PORT in .env
PORT=5001

# Or find and kill process using port 5000
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -i :5000
```

---

## 📚 Database Schema

### Tables Created:

1. **User** - Stores user accounts
   - id, name, email, password (hashed), createdAt, updatedAt

2. **Topic** - User's study notes
   - id, title, notes, userId, createdAt, updatedAt

3. **Quiz** - Quizzes created by users
   - id, title, userId, createdAt, updatedAt

4. **Question** - Questions in quizzes
   - id, question, optionA, optionB, optionC, optionD, correct, quizId, createdAt, updatedAt

5. **QuizResult** - Quiz attempt results
   - id, userId, quizId, score, totalQuestions, answers (JSON), createdAt, updatedAt

---

## 🎯 Next Steps

After successful MySQL connection:

1. ✅ Verify all tables are created: `npm run prisma:studio`
2. ✅ Backend running: http://localhost:5000
3. ✅ Test API endpoints (see API_TESTING.md)
4. ✅ Setup frontend: `cd ../frontend && npm install && npm run dev`
5. ✅ Access app: http://localhost:5173

---

## 📝 Quick Reference Commands

```bash
# Backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Create migration (for schema changes)
npm run prisma:migrate

# Push schema to database
npm run prisma:push

# View database UI
npm run prisma:studio

# Start development server
npm run dev

# Start production server
npm start
```

---

## 🔐 Security Notes

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens for authentication
- ✅ CORS enabled
- ✅ Input validation
- ✅ Error handling

**For Production:**
- Change `JWT_SECRET` to a strong random string
- Use HTTPS
- Set appropriate CORS origins
- Store secrets in secure vaults

---

## 📖 Environment Variables Reference

```properties
# MySQL Connection String
# Format: mysql://username:password@host:port/database
DATABASE_URL="mysql://root:root@localhost:3306/exam_prep_db"

# JWT Secret (change to random string in production)
JWT_SECRET="exam_prep_secret_key_2025_secure_token"

# Server Port
PORT=5000
```

---

**You're all set! Start the backend with: `npm run dev`** 🎉
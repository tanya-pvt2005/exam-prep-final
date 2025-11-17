# MySQL Setup Instructions

## Step 1: Install MySQL

### Windows
1. Download MySQL from: https://dev.mysql.com/downloads/mysql/
2. Run the installer (mysql-installer-community-8.0.x.msi)
3. Choose "Setup Type": Developer Default
4. During configuration:
   - Port: 3306 (default)
   - MySQL Server Type: Development Machine
   - Connectivity: TCP/IP enabled
   - Root password: **set a password** (e.g., "root")
5. Complete the installation

### macOS
```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install mysql-server
sudo mysql_secure_installation
```

## Step 2: Create Database and User

Open MySQL Command Line:
```bash
mysql -u root -p
```
Enter your root password

Then execute these SQL commands:

```sql
-- Create database
CREATE DATABASE exam_prep_db;

-- Create user (optional but recommended)
CREATE USER 'exam_prep'@'localhost' IDENTIFIED BY 'exam_prep_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON exam_prep_db.* TO 'exam_prep'@'localhost';

-- Refresh privileges
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

## Step 3: Update .env File

Edit `backend/.env`:

```
DATABASE_URL="mysql://root:your_password@localhost:3306/exam_prep_db"
JWT_SECRET="your_secret_key_here"
PORT=5000
```

Replace `your_password` with your MySQL root password.

## Step 4: Initialize Database with Prisma

From the backend directory:

```bash
# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Push schema to database (creates tables)
npm run prisma:push
```

## Step 5: Verify Connection

Check Prisma Studio:
```bash
npm run prisma:studio
```

This opens a UI at http://localhost:5555 to view your database.

## Troubleshooting

### "Access denied for user 'root'@'localhost'"
- Check your password in DATABASE_URL
- Verify MySQL is running
- Reset MySQL password if forgotten

### "Database does not exist"
- Make sure you created the database with:
  `CREATE DATABASE exam_prep_db;`

### "Connection refused"
- Start MySQL: `mysql.server start` (macOS) or `NET START MySQL80` (Windows)
- Check if port 3306 is not in use

### "Unknown collation"
- Add to connection string: `?charset=utf8mb4`
- Full URL: `mysql://root:password@localhost:3306/exam_prep_db?charset=utf8mb4`

## Current Configuration

Your `.env` is already set to:
```
DATABASE_URL="mysql://root:root@localhost:3306/exam_prep_db"
JWT_SECRET="exam_prep_secret_key_2025_secure_token"
PORT=5000
```

## Next Steps

1. Install MySQL if not already installed
2. Create the database and user using the SQL commands above
3. Update `.env` with your actual MySQL password
4. Run: `npm run prisma:push` from the backend directory
5. Start the backend: `npm run dev`

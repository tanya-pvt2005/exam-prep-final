# Exam Prep Backend - MySQL + Prisma Setup

This is a complete backend setup for an Exam Prep application using Node.js, Express, Prisma ORM, and MySQL database.

## Features

- **User Authentication**: Registration and login with JWT tokens
- **Topics Management**: Create, read, update, and delete study notes/topics
- **Quiz Management**: Create quizzes with multiple-choice questions, submit answers, and track results
- **Database**: MySQL with Prisma ORM for type-safe database operations
- **Security**: Password hashing with bcryptjs, JWT authentication middleware

## Project Structure

```
backend/
├── controller/
│   ├── authController.js      # Authentication logic (register, login)
│   ├── topicController.js     # Topics CRUD operations
│   └── quizController.js      # Quiz management and submission
├── routes/
│   ├── authRoute.js           # Auth endpoints
│   ├── topicRoute.js          # Topic endpoints
│   └── quizRoute.js           # Quiz endpoints
├── middleware/
│   └── authMiddleware.js      # JWT verification middleware
├── prisma/
│   └── schema.prisma          # Database schema definition
├── index.js                   # Server entry point
├── package.json               # Dependencies
└── .env.example               # Environment variables template
```

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server (v5.7 or higher)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env
   
   # Edit .env with your database credentials
   # Example:
   # DATABASE_URL="mysql://root:password@localhost:3306/exam_prep_db"
   # JWT_SECRET="your_secret_key"
   ```

4. **Create MySQL database**
   ```bash
   # Using MySQL CLI
   mysql -u root -p
   CREATE DATABASE exam_prep_db;
   EXIT;
   ```

5. **Run Prisma migrations**
   ```bash
   npm run prisma:push
   # or for development migration
   npm run prisma:migrate
   ```

6. **Generate Prisma Client**
   ```bash
   npm run prisma:generate
   ```

## Running the Server

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` by default.

## API Endpoints

### Authentication Routes (`/api/auth`)

- **POST /api/auth/register**
  - Register a new user
  - Body: `{ name, email, password }`
  - Returns: `{ token, user: { id, name, email } }`

- **POST /api/auth/login**
  - Login user
  - Body: `{ email, password }`
  - Returns: `{ token, user: { id, name, email } }`

### Topics Routes (`/api/topics`) - Protected

- **POST /api/topics**
  - Create a new topic
  - Body: `{ title, notes }`
  - Returns: Created topic object

- **GET /api/topics**
  - Get all topics for authenticated user
  - Returns: Array of topics

- **GET /api/topics/:id**
  - Get a specific topic
  - Returns: Topic object

- **PUT /api/topics/:id**
  - Update a topic
  - Body: `{ title, notes }`
  - Returns: `{ message: "Topic updated successfully" }`

- **DELETE /api/topics/:id**
  - Delete a topic
  - Returns: `{ message: "Topic deleted successfully" }`

### Quiz Routes (`/api/quizzes`) - Protected

- **POST /api/quizzes**
  - Create a new quiz with questions
  - Body:
    ```json
    {
      "title": "Quiz Title",
      "questions": [
        {
          "question": "What is 2+2?",
          "optionA": "3",
          "optionB": "4",
          "optionC": "5",
          "optionD": "6",
          "correct": "4"
        }
      ]
    }
    ```
  - Returns: Created quiz with questions

- **GET /api/quizzes**
  - Get all quizzes for authenticated user
  - Returns: Array of quizzes with questions

- **GET /api/quizzes/:id**
  - Get a specific quiz with questions
  - Returns: Quiz object with questions array

- **POST /api/quizzes/:id/submit**
  - Submit quiz answers and get score
  - Body: `{ answers: { questionId: selectedAnswer, ... } }`
  - Returns: `{ score, totalQuestions, percentage, result }`

- **PUT /api/quizzes/:id**
  - Update a quiz
  - Body: `{ title, questions }`
  - Returns: Updated quiz object

- **DELETE /api/quizzes/:id**
  - Delete a quiz
  - Returns: `{ message: "Quiz deleted successfully" }`

- **GET /api/quizzes/results**
  - Get all quiz results for user
  - Query params: `?quizId=optional`
  - Returns: Array of quiz results

## Database Schema

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String   (hashed)
  topics    Topic[]
  quizzes   Quiz[]
  results   QuizResult[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Topic Model
```prisma
model Topic {
  id        Int      @id @default(autoincrement())
  title     String
  notes     String   (LongText for large content)
  userId    Int
  user      User     @relation(...)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Quiz Model
```prisma
model Quiz {
  id        Int      @id @default(autoincrement())
  title     String
  userId    Int
  user      User     @relation(...)
  questions Question[]
  results   QuizResult[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Question Model
```prisma
model Question {
  id        Int     @id @default(autoincrement())
  question  String
  optionA   String
  optionB   String
  optionC   String
  optionD   String
  correct   String  (correct answer)
  quizId    Int
  quiz      Quiz    @relation(...)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### QuizResult Model
```prisma
model QuizResult {
  id        Int      @id @default(autoincrement())
  userId    Int
  user      User     @relation(...)
  quizId    Int
  quiz      Quiz     @relation(...)
  score     Int
  totalQuestions Int
  answers   Json     (stores user answers)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

The token is obtained from the login endpoint and expires in 24 hours.

## Prisma Commands

### View Database UI
```bash
npm run prisma:studio
```

### Create a Migration
```bash
npm run prisma:migrate
# Enter migration name when prompted
```

### Push Schema to Database (without migrations)
```bash
npm run prisma:push
```

### Generate Prisma Client
```bash
npm run prisma:generate
```

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

Status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (missing/invalid data)
- `401`: Unauthorized (no token or invalid token)
- `404`: Not Found
- `409`: Conflict (email already exists)
- `500`: Internal Server Error

## Development Notes

- Passwords are hashed using bcryptjs with salt rounds of 10
- JWT tokens expire after 24 hours
- All timestamps are stored in UTC
- Cascade deletes are enabled (deleting user deletes their topics/quizzes)
- Proper indexing on foreign keys for optimal queries

## Environment Variables

```
DATABASE_URL    # MySQL connection string
JWT_SECRET      # Secret key for JWT signing (change in production)
PORT            # Server port (default: 5000)
```

## Frontend Integration

The frontend expects the API to be available at `http://localhost:5000/api/`.

Example API call from frontend:

```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
const data = await response.json();
const token = data.token;

const response = await fetch('http://localhost:5000/api/topics', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check DATABASE_URL format
- Ensure database exists

### Migration Issues
- Run `npm run prisma:push` to sync schema
- Check Prisma logs for details

### Token Errors
- Ensure JWT_SECRET is set in .env
- Verify token is included in Authorization header

## Future Enhancements

- Add email verification
- Implement refresh tokens
- Add admin dashboard
- Implement quiz templates
- Add analytics for quiz performance
- Implement quiz categories/tags
- Add real-time collaboration features

## License

MIT License - feel free to use this project as a template

## Support

For issues and questions, please check the frontend integration guide or create an issue in the repository.
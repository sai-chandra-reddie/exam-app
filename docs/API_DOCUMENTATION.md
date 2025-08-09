# Exam Taking Application API Documentation

## Base URL
```
http://localhost:8000
```

## Authentication
The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Endpoints

### Authentication Endpoints

#### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "created_at": "2024-01-01T00:00:00"
}
```

**Error Responses:**
- `400` - Email already registered
- `400` - Username already taken

#### 2. Login User
**POST** `/auth/login`

Authenticate user and get access token.

**Request Body (form-data):**
```
username: username
password: password123
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Error Responses:**
- `401` - Incorrect username or password

### Exam Endpoints

#### 3. Start Exam
**GET** `/exams/start`

Start a new exam and get randomized questions.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "question_text": "What is the capital of France?",
    "option_a": "London",
    "option_b": "Paris",
    "option_c": "Berlin",
    "option_d": "Madrid",
    "created_at": "2024-01-01T00:00:00"
  }
]
```

**Error Responses:**
- `400` - User already has an active exam
- `500` - Not enough questions in database

#### 4. Submit Exam
**POST** `/exams/submit`

Submit exam answers and get results.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "answers": [
    {
      "question_id": 1,
      "selected_answer": "A"
    },
    {
      "question_id": 2,
      "selected_answer": "B"
    }
  ]
}
```

**Response:**
```json
{
  "exam_id": 1,
  "score": 85.0,
  "total_questions": 10,
  "correct_answers": 8,
  "percentage": 85.0
}
```

**Error Responses:**
- `400` - No active exam found

#### 5. Get Exam Results
**GET** `/exams/results/{exam_id}`

Get detailed results for a specific exam.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "exam_id": 1,
  "score": 85.0,
  "total_questions": 10,
  "correct_answers": 8,
  "percentage": 85.0,
  "start_time": "2024-01-01T10:00:00",
  "end_time": "2024-01-01T10:25:00"
}
```

**Error Responses:**
- `404` - Exam not found
- `400` - Exam not completed yet

#### 6. Get Exam History
**GET** `/exams/history`

Get all completed exams for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "start_time": "2024-01-01T10:00:00",
    "end_time": "2024-01-01T10:25:00",
    "is_completed": true,
    "score": 85.0,
    "total_questions": 10,
    "correct_answers": 8
  }
]
```

### Utility Endpoints

#### 7. Health Check
**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy"
}
```

#### 8. Root Endpoint
**GET** `/`

Get API information.

**Response:**
```json
{
  "message": "Welcome to Exam Taking Application API"
}
```

## Data Models

### User
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "username",
  "created_at": "2024-01-01T00:00:00"
}
```

### Question
```json
{
  "id": 1,
  "question_text": "What is the capital of France?",
  "option_a": "London",
  "option_b": "Paris",
  "option_c": "Berlin",
  "option_d": "Madrid",
  "created_at": "2024-01-01T00:00:00"
}
```

### Answer
```json
{
  "question_id": 1,
  "selected_answer": "A"
}
```

### Exam Result
```json
{
  "exam_id": 1,
  "score": 85.0,
  "total_questions": 10,
  "correct_answers": 8,
  "percentage": 85.0,
  "start_time": "2024-01-01T10:00:00",
  "end_time": "2024-01-01T10:25:00"
}
```

## Error Responses

All error responses follow this format:
```json
{
  "detail": "Error message description"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Testing with Postman

1. Import the provided Postman collection
2. Set the `base_url` variable to `http://localhost:8000`
3. Run the "Register User" request to create an account
4. Run the "Login User" request to get an access token
5. The token will be automatically set for subsequent requests
6. Test the exam endpoints with the authenticated requests

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider implementing rate limiting for security.

## Security Notes

- Passwords are hashed using bcrypt
- JWT tokens expire after 30 minutes
- CORS is configured for localhost development
- Input validation is implemented for all endpoints

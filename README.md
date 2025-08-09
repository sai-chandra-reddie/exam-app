# Exam Taking Application

A full-stack exam-taking interface built with React.js frontend and Python FastAPI backend with PostgreSQL database.

## Features

- User registration and login with JWT authentication
- Start Exam interface with randomized questions
- Multiple choice questions with navigation (Next/Previous)
- Countdown timer (30 minutes) with auto-submit
- Submit exam functionality with score calculation
- Result display page
- Responsive and modern UI

## Technology Stack

- **Frontend**: React.js with TypeScript
- **Backend**: Python FastAPI
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Styling**: Tailwind CSS

## Project Structure

```
exam-app/
├── frontend/          # React.js application
├── backend/           # FastAPI application
├── database/          # Database setup and migrations
└── docs/             # API documentation and Postman collection
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Python (v3.8 or higher)
- PostgreSQL (v12 or higher)
- Git

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

5. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` file with your database credentials and JWT secret.

6. Run database migrations:
   ```bash
   alembic upgrade head
   ```

7. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:3000`

### Database Setup

1. Create a PostgreSQL database named `exam_app`
2. Update the database connection string in `backend/.env`
3. Run migrations to create tables

## API Testing

A Postman collection is provided in `docs/postman_collection.json` for testing all API endpoints.

### Key API Endpoints

- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /exams/start` - Start exam and get questions
- `POST /exams/submit` - Submit exam answers
- `GET /exams/results/{exam_id}` - Get exam results

## Features Implementation

### Authentication
- JWT-based authentication with secure token handling
- Password hashing using bcrypt
- Token refresh mechanism

### Exam Interface
- Randomized question selection from database
- Real-time countdown timer with auto-submit
- Question navigation with progress tracking
- Responsive design for mobile and desktop

### Backend Architecture
- Modular API design with proper separation of concerns
- Database models with relationships
- Input validation and error handling
- Secure password handling and JWT implementation

## Development Notes

- The application uses TypeScript for better type safety
- Tailwind CSS for modern, responsive styling
- FastAPI for high-performance API development
- SQLAlchemy for database ORM
- Alembic for database migrations

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable management

## License

MIT License

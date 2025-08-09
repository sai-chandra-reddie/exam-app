# Quick Start Guide

This guide will help you get the Exam Taking Application running in minutes.

## Prerequisites

- Python 3.8 or higher
- Node.js 16 or higher
- PostgreSQL 12 or higher
- Git

## Quick Setup

### 1. Clone and Setup

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd exam-app

# Run the setup script
python setup.py
```

### 2. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE exam_app;
```

2. Update the database connection in `backend/.env`:
```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/exam_app
```

### 3. Start the Application

#### Backend (Terminal 1)
```bash
cd backend

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Start the server
python -m uvicorn main:app --reload
```

#### Frontend (Terminal 2)
```bash
cd frontend
npm start
```

### 4. Seed the Database

In a new terminal:
```bash
cd backend

# Activate virtual environment (if not already activated)
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Seed the database with sample questions
python seed_data.py
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## Test the Application

1. Open http://localhost:3000 in your browser
2. Register a new account
3. Login with your credentials
4. Click "Start Exam" to begin
5. Answer the questions and submit
6. View your results

## API Testing with Postman

1. Import the Postman collection from `docs/postman_collection.json`
2. Set the `base_url` variable to `http://localhost:8000`
3. Run the requests in order:
   - Register User
   - Login User (this will automatically set the token)
   - Start Exam
   - Submit Exam
   - Get Results

## Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Make sure PostgreSQL is running
   - Verify the DATABASE_URL in `backend/.env`
   - Ensure the database `exam_app` exists

2. **Port Already in Use**
   - Backend: Change the port in the uvicorn command
   - Frontend: React will automatically suggest an alternative port

3. **Module Not Found Errors**
   - Make sure you're in the virtual environment
   - Reinstall dependencies: `pip install -r requirements.txt`

4. **CORS Errors**
   - Ensure both frontend and backend are running
   - Check that the frontend URL is in the ALLOWED_HOSTS in `backend/.env`

### Getting Help

- Check the full README.md for detailed documentation
- Review the API documentation in `docs/API_DOCUMENTATION.md`
- Use the Postman collection for API testing

## Development

### Backend Development
- The backend uses FastAPI with automatic API documentation
- Access interactive docs at http://localhost:8000/docs
- Code is organized in modules: `routers/`, `models/`, `schemas/`

### Frontend Development
- React with TypeScript for type safety
- Tailwind CSS for styling
- Context API for state management
- React Router for navigation

### Database
- SQLAlchemy ORM with PostgreSQL
- Alembic for migrations (if needed)
- Sample data seeding script included

## Production Deployment

For production deployment, consider:

1. **Security**
   - Change the JWT secret key
   - Use environment variables for sensitive data
   - Enable HTTPS
   - Implement rate limiting

2. **Database**
   - Use a production PostgreSQL instance
   - Set up proper backups
   - Configure connection pooling

3. **Frontend**
   - Build for production: `npm run build`
   - Serve with a production web server (nginx, Apache)

4. **Backend**
   - Use a production ASGI server (Gunicorn with Uvicorn workers)
   - Set up reverse proxy (nginx)
   - Configure logging and monitoring

#!/usr/bin/env python3

import os
import sys
import subprocess
from pathlib import Path

def run_command(command, cwd=None):
    try:
        result = subprocess.run(command, shell=True, cwd=cwd, capture_output=True, text=True)
        if result.returncode != 0:
            print(f"Error running command: {command}")
            print(f"Error: {result.stderr}")
            return False
        print(f"Success: {command}")
        return True
    except Exception as e:
        print(f"Exception running command: {command}")
        print(f"Error: {e}")
        return False

def setup_backend():
    print("\n=== Setting up Backend ===")
    
    backend_dir = Path("backend")
    if not backend_dir.exists():
        print("Backend directory not found!")
        return False
    
    print("Creating virtual environment...")
    if not run_command("python -m venv venv", cwd=backend_dir):
        return False
    
    print("Installing Python dependencies...")
    if os.name == 'nt':
        pip_cmd = "venv\\Scripts\\pip"
    else:
        pip_cmd = "venv/bin/pip"
    
    if not run_command(f"{pip_cmd} install -r requirements.txt", cwd=backend_dir):
        return False
    
    env_file = backend_dir / ".env"
    if not env_file.exists():
        print("Creating .env file...")
        env_content = """DATABASE_URL=postgresql://username:password@localhost:5432/exam_app

JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

DEBUG=True
ALLOWED_HOSTS=["http://localhost:3000", "http://127.0.0.1:3000"]
"""
        with open(env_file, 'w') as f:
            f.write(env_content)
        print("Created .env file. Please update the DATABASE_URL with your PostgreSQL credentials.")
    
    return True

def setup_frontend():
    print("\n=== Setting up Frontend ===")
    
    frontend_dir = Path("frontend")
    if not frontend_dir.exists():
        print("Frontend directory not found!")
        return False
    
    print("Installing Node.js dependencies...")
    if not run_command("npm install", cwd=frontend_dir):
        return False
    
    return True

def seed_database():
    print("\n=== Seeding Database ===")
    
    backend_dir = Path("backend")
    if os.name == 'nt':
        python_cmd = "venv\\Scripts\\python"
    else:
        python_cmd = "venv/bin/python"
    
    if not run_command(f"{python_cmd} seed_data.py", cwd=backend_dir):
        print("Failed to seed database. Make sure the backend is running and database is accessible.")
        return False
    
    return True

def main():
    print("Exam Taking Application Setup")
    print("=" * 40)
    
    if not Path("README.md").exists():
        print("Please run this script from the project root directory.")
        sys.exit(1)
    
    if not setup_backend():
        print("Backend setup failed!")
        sys.exit(1)
    
    if not setup_frontend():
        print("Frontend setup failed!")
        sys.exit(1)
    
    print("\n=== Setup Complete ===")
    print("\nNext steps:")
    print("1. Update the DATABASE_URL in backend/.env with your PostgreSQL credentials")
    print("2. Create a PostgreSQL database named 'exam_app'")
    print("3. Start the backend server: cd backend && python -m uvicorn main:app --reload")
    print("4. Start the frontend server: cd frontend && npm start")
    print("5. Run the seed script to populate the database: cd backend && python seed_data.py")
    print("\nThe application will be available at:")
    print("- Frontend: http://localhost:3000")
    print("- Backend API: http://localhost:8000")
    print("- API Documentation: http://localhost:8000/docs")

if __name__ == "__main__":
    main()

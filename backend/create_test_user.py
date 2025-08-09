from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from auth import get_password_hash

def create_test_user():
    db = SessionLocal()
    
    test_user = {
        "email": "test@example.com",
        "username": "testuser",
        "password": "testpass123"
    }
    
    try:
        existing_user = db.query(User).filter(User.username == test_user["username"]).first()
        if existing_user:
            print(f"User '{test_user['username']}' already exists.")
            return
        
        hashed_password = get_password_hash(test_user["password"])
        db_user = User(
            email=test_user["email"],
            username=test_user["username"],
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        print(f"Successfully created test user:")
        print(f"Username: {test_user['username']}")
        print(f"Password: {test_user['password']}")
        print(f"Email: {test_user['email']}")
        
    except Exception as e:
        print(f"Error creating test user: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()

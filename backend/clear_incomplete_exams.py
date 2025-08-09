from sqlalchemy.orm import Session
from database import SessionLocal
from models import Exam, ExamAnswer

def clear_incomplete_exams(username: str = "testuser"):
    db = SessionLocal()
    
    try:
        from models import User
        user = db.query(User).filter(User.username == username).first()
        
        if not user:
            print(f"User '{username}' not found")
            return
        
        incomplete_exams = db.query(Exam).filter(
            Exam.user_id == user.id,
            Exam.is_completed == False
        ).all()
        
        if not incomplete_exams:
            print(f"No incomplete exams found for user '{username}'")
            return
        
        print(f"Found {len(incomplete_exams)} incomplete exam(s) for user '{username}'")
        
        for exam in incomplete_exams:
            exam_answers = db.query(ExamAnswer).filter(ExamAnswer.exam_id == exam.id).all()
            for answer in exam_answers:
                db.delete(answer)
            print(f"Deleted {len(exam_answers)} answers for exam {exam.id}")
        
        for exam in incomplete_exams:
            db.delete(exam)
        
        db.commit()
        print(f"Successfully cleared {len(incomplete_exams)} incomplete exam(s) for user '{username}'")
        
    except Exception as e:
        print(f"Error clearing incomplete exams: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    clear_incomplete_exams()

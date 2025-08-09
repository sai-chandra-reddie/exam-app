from sqlalchemy.orm import Session
from database import SessionLocal
from models import Question

def seed_questions():
    db = SessionLocal()
    
    questions = [
        {
            "question_text": "What is the capital of France?",
            "option_a": "London",
            "option_b": "Paris",
            "option_c": "Berlin",
            "option_d": "Madrid",
            "correct_answer": "B"
        },
        {
            "question_text": "Which planet is known as the Red Planet?",
            "option_a": "Venus",
            "option_b": "Mars",
            "option_c": "Jupiter",
            "option_d": "Saturn",
            "correct_answer": "B"
        },
        {
            "question_text": "What is the largest ocean on Earth?",
            "option_a": "Atlantic Ocean",
            "option_b": "Indian Ocean",
            "option_c": "Arctic Ocean",
            "option_d": "Pacific Ocean",
            "correct_answer": "D"
        },
        {
            "question_text": "Who wrote 'Romeo and Juliet'?",
            "option_a": "Charles Dickens",
            "option_b": "William Shakespeare",
            "option_c": "Jane Austen",
            "option_d": "Mark Twain",
            "correct_answer": "B"
        },
        {
            "question_text": "What is the chemical symbol for gold?",
            "option_a": "Ag",
            "option_b": "Au",
            "option_c": "Fe",
            "option_d": "Cu",
            "correct_answer": "B"
        },
        {
            "question_text": "Which programming language is known as the 'language of the web'?",
            "option_a": "Python",
            "option_b": "Java",
            "option_c": "JavaScript",
            "option_d": "C++",
            "correct_answer": "C"
        },
        {
            "question_text": "What year did World War II end?",
            "option_a": "1943",
            "option_b": "1944",
            "option_c": "1945",
            "option_d": "1946",
            "correct_answer": "C"
        },
        {
            "question_text": "What is the largest mammal in the world?",
            "option_a": "African Elephant",
            "option_b": "Blue Whale",
            "option_c": "Giraffe",
            "option_d": "Hippopotamus",
            "correct_answer": "B"
        },
        {
            "question_text": "Which country is home to the kangaroo?",
            "option_a": "New Zealand",
            "option_b": "South Africa",
            "option_c": "Australia",
            "option_d": "India",
            "correct_answer": "C"
        },
        {
            "question_text": "What is the square root of 144?",
            "option_a": "10",
            "option_b": "11",
            "option_c": "12",
            "option_d": "13",
            "correct_answer": "C"
        },
        {
            "question_text": "Which element has the chemical symbol 'O'?",
            "option_a": "Osmium",
            "option_b": "Oxygen",
            "option_c": "Oganesson",
            "option_d": "Osmium",
            "correct_answer": "B"
        },
        {
            "question_text": "What is the main component of the sun?",
            "option_a": "Liquid Lava",
            "option_b": "Molten Iron",
            "option_c": "Hot Gases",
            "option_d": "Solid Rock",
            "correct_answer": "C"
        },
        {
            "question_text": "Which country has the largest population in the world?",
            "option_a": "India",
            "option_b": "China",
            "option_c": "United States",
            "option_d": "Russia",
            "correct_answer": "B"
        },
        {
            "question_text": "What is the speed of light?",
            "option_a": "299,792 km/s",
            "option_b": "199,792 km/s",
            "option_c": "399,792 km/s",
            "option_d": "499,792 km/s",
            "correct_answer": "A"
        },
        {
            "question_text": "Who painted the Mona Lisa?",
            "option_a": "Vincent van Gogh",
            "option_b": "Pablo Picasso",
            "option_c": "Leonardo da Vinci",
            "option_d": "Michelangelo",
            "correct_answer": "C"
        }
    ]
    
    try:
        existing_questions = db.query(Question).count()
        if existing_questions > 0:
            print(f"Database already contains {existing_questions} questions. Skipping seed.")
            return
        
        for question_data in questions:
            question = Question(**question_data)
            db.add(question)
        
        db.commit()
        print(f"Successfully seeded {len(questions)} questions to the database.")
        
    except Exception as e:
        print(f"Error seeding questions: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_questions()

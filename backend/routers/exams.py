from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
import random
from typing import List
from database import get_db
from models import User, Question, Exam, ExamAnswer
from schemas import Question as QuestionSchema, ExamSubmission, ExamResult
from auth import get_current_user

router = APIRouter()

@router.get("/start", response_model=List[QuestionSchema])
def start_exam(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    active_exam = db.query(Exam).filter(
        Exam.user_id == current_user.id,
        Exam.is_completed == False
        
    ).first()
    
    if active_exam:
        raise HTTPException(status_code=400, detail="You already have an active exam")
    
    questions = db.query(Question).order_by(func.random()).limit(10).all()
    
    if len(questions) < 10:
        raise HTTPException(status_code=500, detail="Not enough questions in database")
    
    exam = Exam(
        user_id=current_user.id,
        total_questions=len(questions)
    )
    db.add(exam)
    db.commit()
    db.refresh(exam)
    
    return questions

@router.post("/submit")
def submit_exam(
    submission: ExamSubmission,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exam = db.query(Exam).filter(
        Exam.user_id == current_user.id,
        Exam.is_completed == False
    ).first()
    
    if not exam:
        raise HTTPException(status_code=400, detail="No active exam found")
    
    questions = db.query(Question).all()
    question_dict = {q.id: q for q in questions}
    
    correct_answers = 0
    total_questions = len(submission.answers)
    
    for answer_data in submission.answers:
        question = question_dict.get(answer_data.question_id)
        if not question:
            continue
            
        is_correct = answer_data.selected_answer == question.correct_answer
        if is_correct:
            correct_answers += 1
        
        exam_answer = ExamAnswer(
            exam_id=exam.id,
            question_id=answer_data.question_id,
            selected_answer=answer_data.selected_answer,
            is_correct=is_correct
        )
        db.add(exam_answer)
    
    score = (correct_answers / total_questions) * 100 if total_questions > 0 else 0
    
    exam.is_completed = True
    exam.end_time = datetime.utcnow()
    exam.score = score
    exam.correct_answers = correct_answers
    
    db.commit()
    db.refresh(exam)
    
    return {
        "exam_id": exam.id,
        "score": score,
        "total_questions": total_questions,
        "correct_answers": correct_answers,
        "percentage": round(score, 2)
    }

@router.get("/results/{exam_id}", response_model=ExamResult)
def get_exam_results(
    exam_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exam = db.query(Exam).filter(
        Exam.id == exam_id,
        Exam.user_id == current_user.id
    ).first()
    
    if not exam:
        raise HTTPException(status_code=404, detail="Exam not found")
    
    if not exam.is_completed:
        raise HTTPException(status_code=400, detail="Exam not completed yet")
    
    return ExamResult(
        exam_id=exam.id,
        score=exam.score,
        total_questions=exam.total_questions,
        correct_answers=exam.correct_answers,
        percentage=round(exam.score, 2) if exam.score else 0,
        start_time=exam.start_time,
        end_time=exam.end_time
    )

@router.get("/history")
def get_exam_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    exams = db.query(Exam).filter(
        Exam.user_id == current_user.id,
        Exam.is_completed == True
    ).order_by(Exam.end_time.desc()).all()
    
    return exams

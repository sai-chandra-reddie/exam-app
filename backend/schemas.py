from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    username: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class QuestionBase(BaseModel):
    question_text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str

class Question(QuestionBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class QuestionWithAnswer(Question):
    correct_answer: str

class ExamBase(BaseModel):
    pass

class ExamCreate(ExamBase):
    pass

class Exam(ExamBase):
    id: int
    user_id: int
    start_time: datetime
    end_time: Optional[datetime]
    is_completed: bool
    score: Optional[float]
    total_questions: int
    correct_answers: int
    
    class Config:
        from_attributes = True

class AnswerBase(BaseModel):
    question_id: int
    selected_answer: str

class AnswerCreate(AnswerBase):
    pass

class Answer(AnswerBase):
    id: int
    exam_id: int
    is_correct: Optional[bool]
    
    class Config:
        from_attributes = True

class ExamSubmission(BaseModel):
    answers: List[AnswerCreate]

class ExamResult(BaseModel):
    exam_id: int
    score: float
    total_questions: int
    correct_answers: int
    percentage: float
    start_time: datetime
    end_time: datetime

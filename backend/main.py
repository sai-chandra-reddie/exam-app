from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
from models import Base
from routers import auth, exams
from config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Exam Taking Application",
    description="A full-stack exam-taking interface with JWT authentication",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_hosts,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["authentication"])
app.include_router(exams.router, prefix="/exams", tags=["exams"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Exam Taking Application API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

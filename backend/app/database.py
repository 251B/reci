import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 환경 변수가 상대 경로인 경우 절대 경로로 변환
if settings.DATABASE_URL.startswith("sqlite:///./"):
    database_path = settings.DATABASE_URL.replace("sqlite:///./", "")
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{os.path.join(BASE_DIR, database_path)}"
else:
    SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# 데이터베이스 URL 설정
if settings.DATABASE_URL.startswith("sqlite:///"):
    # SQLite 설정 (개발 환경)
    if settings.DATABASE_URL.startswith("sqlite:///./"):
        database_path = settings.DATABASE_URL.replace("sqlite:///./", "")
        # storage 폴더로 경로 수정
        storage_path = os.path.join(os.path.dirname(BASE_DIR), "storage", database_path.split('/')[-1])
        SQLALCHEMY_DATABASE_URL = f"sqlite:///{storage_path}"
    else:
        SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
    
    # SQLite용 엔진 설정
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL 설정 (프로덕션 환경)
    SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL
    
    # PostgreSQL용 엔진 설정
    engine = create_engine(
        SQLALCHEMY_DATABASE_URL,
        pool_size=10,
        max_overflow=20,
        pool_pre_ping=True,
        pool_recycle=300
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

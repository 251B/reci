"""
공통 의존성 모듈
FastAPI 의존성 주입을 위한 공통 함수들을 정의합니다.
"""
from typing import Generator
from sqlalchemy.orm import Session
from .database import SessionLocal


def get_db() -> Generator[Session, None, None]:
    """
    데이터베이스 세션을 생성하고 반환합니다.
    FastAPI 의존성 주입에서 사용됩니다.
    
    Yields:
        Session: SQLAlchemy 데이터베이스 세션
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
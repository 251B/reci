"""
인증 서비스
사용자 인증 관련 비즈니스 로직을 처리합니다.
"""
import bcrypt
from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas import ConflictException, UnauthorizedException


class AuthService:
    """인증 서비스 클래스"""
    
    @staticmethod
    def create_user(email: str, password: str, db: Session) -> User:
        """
        새로운 사용자를 생성합니다.
        
        Args:
            email: 사용자 이메일
            password: 사용자 비밀번호
            db: 데이터베이스 세션
            
        Returns:
            User: 생성된 사용자 객체
            
        Raises:
            ConflictException: 이메일이 이미 존재하는 경우
        """
        email = email.strip().lower()
        
        # 중복 이메일 확인
        if db.query(User).filter(User.email == email).first():
            raise ConflictException("이미 존재하는 이메일입니다.")
        
        # 비밀번호 해시화
        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())
        
        # 사용자 생성
        user = User(email=email, password=hashed_password.decode("utf-8"))
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return user
    
    @staticmethod
    def authenticate_user(email: str, password: str, db: Session) -> User:
        """
        사용자를 인증합니다.
        
        Args:
            email: 사용자 이메일
            password: 사용자 비밀번호
            db: 데이터베이스 세션
            
        Returns:
            User: 인증된 사용자 객체
            
        Raises:
            UnauthorizedException: 인증에 실패한 경우
        """
        email = email.strip().lower()
        user = db.query(User).filter(User.email == email).first()
        
        if not user or not bcrypt.checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
            raise UnauthorizedException("이메일 또는 비밀번호가 잘못되었습니다.")
        
        return user
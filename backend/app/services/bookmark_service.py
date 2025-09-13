"""
북마크 서비스
사용자 북마크 관련 비즈니스 로직을 처리합니다.
"""
from typing import List
from sqlalchemy.orm import Session
from ..models import Bookmark
from ..schemas import ConflictException, NotFoundException


class BookmarkService:
    """북마크 서비스 클래스"""
    
    @staticmethod
    def add_bookmark(user_id: int, recipe_id: int, db: Session) -> Bookmark:
        """
        북마크를 추가합니다.
        
        Args:
            user_id: 사용자 ID
            recipe_id: 레시피 ID
            db: 데이터베이스 세션
            
        Returns:
            Bookmark: 생성된 북마크 객체
            
        Raises:
            ConflictException: 이미 북마크가 존재하는 경우
        """
        existing = db.query(Bookmark).filter_by(user_id=user_id, recipe_id=recipe_id).first()
        if existing:
            raise ConflictException("이미 찜한 레시피입니다.")

        new_bookmark = Bookmark(user_id=user_id, recipe_id=recipe_id)
        db.add(new_bookmark)
        db.commit()
        db.refresh(new_bookmark)
        
        return new_bookmark
    
    @staticmethod
    def remove_bookmark(user_id: int, recipe_id: int, db: Session) -> None:
        """
        북마크를 삭제합니다.
        
        Args:
            user_id: 사용자 ID
            recipe_id: 레시피 ID
            db: 데이터베이스 세션
            
        Raises:
            NotFoundException: 북마크가 존재하지 않는 경우
        """
        bookmark = db.query(Bookmark).filter_by(user_id=user_id, recipe_id=recipe_id).first()
        if not bookmark:
            raise NotFoundException("찜이 존재하지 않습니다.")

        db.delete(bookmark)
        db.commit()
    
    @staticmethod
    def get_user_bookmarks(user_id: int, db: Session) -> List[int]:
        """
        사용자의 북마크 목록을 조회합니다.
        
        Args:
            user_id: 사용자 ID
            db: 데이터베이스 세션
            
        Returns:
            List[int]: 북마크된 레시피 ID 목록
        """
        bookmarks = db.query(Bookmark).filter_by(user_id=user_id).all()
        return [b.recipe_id for b in bookmarks]
    
    @staticmethod
    def is_bookmarked(user_id: int, recipe_id: int, db: Session) -> bool:
        """
        특정 레시피가 북마크되어 있는지 확인합니다.
        
        Args:
            user_id: 사용자 ID
            recipe_id: 레시피 ID
            db: 데이터베이스 세션
            
        Returns:
            bool: 북마크 여부
        """
        exists = db.query(Bookmark).filter_by(user_id=user_id, recipe_id=recipe_id).first()
        return bool(exists)
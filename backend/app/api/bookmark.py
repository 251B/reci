from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import Query
from ..core.dependencies import get_db
from ..services import BookmarkService
from ..schemas import create_success_response

router = APIRouter()

# 찜 추가
@router.post("/{recipe_id}")
def add_bookmark(recipe_id: int, user_id: int = Query(...), db: Session = Depends(get_db)):
    BookmarkService.add_bookmark(user_id, recipe_id, db)
    return create_success_response(message="찜 추가 완료")

# 찜 삭제
@router.delete("/{recipe_id}")
def remove_bookmark(recipe_id: int, user_id: int = Query(...), db: Session = Depends(get_db)):
    BookmarkService.remove_bookmark(user_id, recipe_id, db)
    return create_success_response(message="찜 삭제 완료")

# 찜 목록 조회
@router.get("/")
def get_user_bookmarks(user_id: int = Query(...), db: Session = Depends(get_db)):
    recipe_ids = BookmarkService.get_user_bookmarks(user_id, db)
    
    return create_success_response(
        data={"recipe_ids": recipe_ids},
        message="찜 목록을 성공적으로 조회했습니다."
    )

@router.get("/check/{recipe_id}")
def check_bookmarked(recipe_id: int, user_id: int = Query(...), db: Session = Depends(get_db)):
    is_bookmarked = BookmarkService.is_bookmarked(user_id, recipe_id, db)
    
    return create_success_response(
        data={"bookmarked": is_bookmarked},
        message="북마크 상태를 확인했습니다."
    )
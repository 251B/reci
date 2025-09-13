from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from ..dependencies import get_db
from ..services import AuthService
from ..schemas import create_success_response

router = APIRouter()

class SignupRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@router.post("/signup")
def signup(req: SignupRequest, db: Session = Depends(get_db)):
    user = AuthService.create_user(req.email, req.password, db)
    
    return create_success_response(
        data={"userId": user.id},
        message="회원가입이 완료되었습니다."
    )

@router.post("/login")
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = AuthService.authenticate_user(req.email, req.password, db)
    
    return create_success_response(
        data={"userId": user.id},
        message="로그인에 성공했습니다."
    )

from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import time

# 설정 import
from app.core.config import settings

# DB 초기화
from app.models import User, Bookmark
from app.core.database import engine, Base

# 라우터 import
from app.api import auth, chat, category, recipe, title, filter, bookmark
from app.api.gpt import recommend, servings, substitute, custom

# FastAPI 앱 생성
app = FastAPI(
    title="ReciPICK API",
    description="AI 기반 레시피 추천 및 관리 플랫폼 API",
    version="1.0.0",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None
)

# 로깅 설정
logging.basicConfig(
    level=logging.INFO if settings.ENVIRONMENT == "production" else logging.DEBUG,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)
logger.info(f"DEBUG: {settings.DEBUG}")

# DB 테이블 생성
Base.metadata.create_all(bind=engine)

# 미들웨어 추가
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """요청 로깅 미들웨어"""
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    
    logger.info(
        f"{request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Time: {process_time:.4f}s"
    )
    return response

# 전역 예외 처리
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """전역 예외 처리기"""
    logger.error(f"Global exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "서버 내부 오류가 발생했습니다.",
            "data": None,
            "errors": ["Internal server error"] if settings.DEBUG else None
        }
    )

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(auth.router,       prefix="/auth")
app.include_router(chat.router,       prefix="/chat")
app.include_router(category.router,   prefix="/category")
app.include_router(recipe.router,     prefix="/recipe")
app.include_router(title.router,      prefix="/search")
app.include_router(filter.router,     prefix="/filter")
app.include_router(bookmark.router, prefix="/bookmark")

# GPT 기반 기능들
app.include_router(recommend.router,  prefix="/gpt")
app.include_router(servings.router,   prefix="/gpt")
app.include_router(substitute.router, prefix="/gpt")
app.include_router(custom.router, prefix="/gpt")

# 헬스 체크 엔드포인트
@app.get("/health")
async def health_check():
    """서버 상태 확인"""
    return {
        "status": "healthy",
        "message": "ReciPICK API 서버가 정상 작동 중입니다.",
        "version": "1.0.0"
    }

@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": "Welcome to ReciPICK API",
        "docs": "/docs",
        "health": "/health"
    }

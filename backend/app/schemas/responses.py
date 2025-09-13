"""
API 응답 표준화 모듈
일관된 API 응답 형식을 제공합니다.
"""
from typing import Any, Dict, Generic, List, Optional, TypeVar, Union
from pydantic import BaseModel
from fastapi import HTTPException, status

T = TypeVar('T')


class APIResponse(BaseModel, Generic[T]):
    """표준 API 응답 모델"""
    success: bool
    message: str
    data: Optional[T] = None
    errors: Optional[List[str]] = None

    class Config:
        json_schema_extra = {
            "example": {
                "success": True,
                "message": "요청이 성공적으로 처리되었습니다.",
                "data": {},
                "errors": None
            }
        }


class PaginatedResponse(BaseModel, Generic[T]):
    """페이지네이션 응답 모델"""
    items: List[T]
    total: int
    page: int
    per_page: int
    has_more: bool

    class Config:
        json_schema_extra = {
            "example": {
                "items": [],
                "total": 100,
                "page": 1,
                "per_page": 10,
                "has_more": True
            }
        }


class ErrorResponse(BaseModel):
    """에러 응답 모델"""
    success: bool = False
    message: str
    errors: Optional[List[str]] = None
    error_code: Optional[str] = None

    class Config:
        json_schema_extra = {
            "example": {
                "success": False,
                "message": "요청 처리 중 오류가 발생했습니다.",
                "errors": ["상세 오류 메시지"],
                "error_code": "VALIDATION_ERROR"
            }
        }


def create_success_response(
    data: Any = None, 
    message: str = "요청이 성공적으로 처리되었습니다."
) -> Dict[str, Any]:
    """성공 응답 생성"""
    return {
        "success": True,
        "message": message,
        "data": data,
        "errors": None
    }


def create_error_response(
    message: str,
    errors: Optional[List[str]] = None,
    error_code: Optional[str] = None
) -> Dict[str, Any]:
    """에러 응답 생성"""
    return {
        "success": False,
        "message": message,
        "data": None,
        "errors": errors,
        "error_code": error_code
    }


def create_paginated_response(
    items: List[Any],
    total: int,
    page: int,
    per_page: int
) -> Dict[str, Any]:
    """페이지네이션 응답 생성"""
    has_more = (page * per_page) < total
    
    return create_success_response({
        "items": items,
        "total": total,
        "page": page,
        "per_page": per_page,
        "has_more": has_more
    })


class AppHTTPException(HTTPException):
    """애플리케이션 커스텀 예외"""
    
    def __init__(
        self,
        status_code: int,
        message: str,
        errors: Optional[List[str]] = None,
        error_code: Optional[str] = None
    ):
        detail = create_error_response(message, errors, error_code)
        super().__init__(status_code=status_code, detail=detail)


# 자주 사용하는 예외들
class ValidationException(AppHTTPException):
    def __init__(self, message: str, errors: Optional[List[str]] = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            message=message,
            errors=errors,
            error_code="VALIDATION_ERROR"
        )


class NotFoundException(AppHTTPException):
    def __init__(self, message: str = "요청한 리소스를 찾을 수 없습니다."):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            message=message,
            error_code="NOT_FOUND"
        )


class UnauthorizedException(AppHTTPException):
    def __init__(self, message: str = "인증이 필요합니다."):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            message=message,
            error_code="UNAUTHORIZED"
        )


class ForbiddenException(AppHTTPException):
    def __init__(self, message: str = "접근 권한이 없습니다."):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            message=message,
            error_code="FORBIDDEN"
        )


class ConflictException(AppHTTPException):
    def __init__(self, message: str):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            message=message,
            error_code="CONFLICT"
        )
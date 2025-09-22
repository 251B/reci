from fastapi import APIRouter, Query
from typing import List
from app.services.client import client

router = APIRouter()

@router.get("/difficulty-time")
async def filter_by_difficulty_time(
    difficulty: str = Query(None),
    max_time: str = Query(None),
    cook_time: str = Query(None), 
    page: int = Query(1),
    per_page: int = Query(20),
    exclude_ids: List[str] = Query(None)
):
    filters = []

    # 난이도 필터 추가
    if difficulty:
        filters.append(f"difficulty:='{difficulty}'")

    # 최대 시간 필터 추가
    if max_time:
        import re
        match = re.match(r"(>=|<=|>|<)?(\d+)", str(max_time))
        if match:
            operator = match.group(1) or "<="
            value = match.group(2)
            filters.append(f"cook_time_minutes:{operator}{value}")

    # 조리 시간 필터 추가
    if cook_time:
        filters.append(f"cook_time:='{cook_time}'")

    # 제외할 ID 필터 추가
    if exclude_ids:
        for eid in exclude_ids:
            filters.append(f"id:!={eid}")

    # 필터 조건 조합
    filter_query = " && ".join(filters) if filters else ""

    try:
        # 타입센스 서버에 검색 요청
        result = client.collections["recipes_gpt"].documents.search({
            "q": "*",
            "query_by": "title",
            "filter_by": filter_query,
            "page": page,
            "per_page": per_page
        })

        # 검색 결과 처리
        recipes = [
            {
                "id": hit["document"]["id"],
                "title": hit["document"]["title"],
                "image_url": hit["document"]["image_url"]
            }
            for hit in result["hits"]
        ]

        return {"recipes": recipes}

    except Exception as e:
        return {"error": str(e)}

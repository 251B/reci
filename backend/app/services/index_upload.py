import os
import json
from app.services.client import client

def create_collection():
    schema = {
        "name": "recipes",
        "fields": [
            {"name": "id", "type": "string"},
            {"name": "title", "type": "string"},
            {"name": "category", "type": "string"},
            {"name": "serving", "type": "string"},
            {"name": "image_url", "type": "string"},
            {"name": "cook_time", "type": "string"},
            {"name": "cook_time_minutes", "type": "int32"},  
            {"name": "difficulty", "type": "string"},
            {"name": "ingredients", "type": "string[]"},
            {"name": "steps", "type": "string[]"}
        ]
    }
    try:
        client.collections.create(schema)
        print("Typesense 컬렉션 생성 완료!")
    except Exception as e:
        if 'already exists' in str(e):
            print("! 컬렉션이 이미 존재합니다. 삭제 후 재생성합니다.")
            try:
                client.collections['recipes'].delete()
                print("- 기존 컬렉션 삭제 완료. 재생성 시도...")
                client.collections.create(schema)
                print("Typesense 컬렉션 재생성 완료!")
            except Exception as e2:
                print(f"! 컬렉션 삭제/재생성 중 오류: {e2}")
        else:
            print(f"! 컬렉션 생성 중 오류: {e}")

def upsert_recipes(all_recipes):
    try:
        batch_size = 200
        for i in range(0, len(all_recipes), batch_size):
            batch = all_recipes[i:i+batch_size]
            documents = [
                {
                    "id": str(recipe.get("id")),
                    "title": recipe.get("title", ""),
                    "category": recipe.get("category", ""),
                    "serving": recipe.get("serving", ""),
                    "image_url": recipe.get("image_url", ""),
                    "cook_time": recipe.get("cook_time", ""),
                    "cook_time_minutes": recipe.get("cook_time_minutes", 0),  # 추가된 필드
                    "difficulty": recipe.get("difficulty", ""),
                    "ingredients": recipe.get("ingredients", []),
                    "steps": recipe.get("steps", [])
                }
                for recipe in batch
            ]
            jsonl = "\n".join([json.dumps(doc, ensure_ascii=False) for doc in documents])
            response = client.collections['recipes'].documents.import_(
                jsonl,
                {'action': 'upsert'}
            )
            print(f"upsert 완료! (batch {i//batch_size+1})")
    except Exception as e:
        print("! upsert 실패:", e)

def load_recipes_json():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.abspath(os.path.join(base_dir, "..", "..", "..", "data"))
    json_path = os.path.join(data_path, "recipes_with_minutes.json")  
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)

if __name__ == "__main__":
    all_recipes = load_recipes_json()
    print("데이터 로드 완료!")
    create_collection()
    upsert_recipes(all_recipes)

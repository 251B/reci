
from fastapi import APIRouter
from pydantic import BaseModel
import openai
import os
from dotenv import load_dotenv
import json

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")
router = APIRouter()

class ServingsRequest(BaseModel):
    title: str
    ingredients: list[str]
    steps: list[str]
    current_serving: str
    target_serving: str

@router.post("/servings")
async def convert_servings(req: ServingsRequest):
    try:
        ingredients_text = "\n".join(req.ingredients)
        steps_text = "\n".join(f"{i+1}. {s}" for i, s in enumerate(req.steps))

        prompt = (
            f"아래는 {req.current_serving} 기준으로 작성된 요리 레시피입니다.\n"
            f"이 레시피를 {req.target_serving} 기준으로 변환해 주세요.\n\n"
            f"지켜야 할 조건:\n"
            f"- 레시피 제목(title)은 절대 변경하지 말고, 아래의 원래 제목을 그대로 사용하세요.\n"
            f"- '적당량', '약간', '(비정량)' 등의 정량이 불분명한 재료는 그대로 유지합니다.\n"
            f"- 재료와 조리 순서 모두 {req.target_serving} 기준으로 자연스럽게 조정해야 합니다.\n"
            f"- 반드시 정량이 명시된 모든 재료의 양은 정확히 '{req.target_serving} ÷ {req.current_serving}'의 비율로 계산하세요.\n"
            f"- '1 1/2', '1과 1/2', '1 + 1/2' 같은 혼합분수 표현은 절대 사용하지 마세요. 이런 표현이 출력될 경우 잘못된 출력입니다.\n"
            f"- 반드시 혼합 표현은 소수로 변환하여 표현하세요. 예: 1.5스푼 (o) , 1과 1/2스푼 (x)\n"
            f"- 수량은 되도록 소수 첫째 자리까지 표현하세요. 단, 정수가 없는 **단일 분수**(예: 1/3, 2/3, 1/2)만 허용되며, 3/8, 5/6 등은 절대 사용하지 마세요.\n"
            f"-  금지된 예시: 3/8개, 5/6큰술\n"
            f"- (o)  허용된 예시: 0.8스푼, 1/2개, 2/3큰술\n"
            f"- 정수가 없는 단일 분수(예: 1/2, 2/3)만 허용되며, 기타 분수는 모두 소수로 표현하세요.\n"
            f"- (x) 금지된 예시: 1 1/2컵, 1과 1/3스푼, 2 2/3스푼\n"
            f"- (o) 허용된 예시: 1.5컵, 1.3스푼, 2.7스푼, 1/2스푼, 2/3스푼\n"
            f"- 출력은 반드시 아래 JSON 형식을 지켜야 하며, 한국어로 작성하세요.\n"
            f"- step에선 인분에 따라 조정된 표현이 자연스럽게 반영되도록 작성하세요.\n\n"
            f"출력 형식:\n"
            f"""
            {{\n\"title\": \"{req.title}\",\n\"serving\": \"{req.target_serving}\",\n\"ingredients\": [\"재료1: 양\", \"재료2: 양\"],\n\"steps\": [\"조리1\", \"조리2\"]\n}}\n"""
            f"\n레시피 제목: {req.title}\n\n"
            f"재료:\n{ingredients_text}\n\n"
            f"조리 순서:\n{steps_text}"
        )

        messages = [
            {
                "role": "system",
                "content": (
                    "당신은 요리 전문가입니다. 사용자의 레시피를 원하는 인분에 맞게 조정하고 JSON으로 출력해 주세요."
                )
            },
            {"role": "user", "content": prompt}
        ]

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.5,
            max_tokens=1000,
        )

        content = response.choices[0].message.content.strip()
        try:
            parsed = json.loads(content)
        except Exception:
            parsed = content

        parsed["title"] = req.title
        return {"result": parsed}
    except Exception as e:
        return {"error": str(e)}
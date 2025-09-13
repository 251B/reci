# ReciPICK 🍳

AI 기반 레시피 추천 및 관리 플랫폼

## 📁 프로젝트 구조

```
ReciPICK/
├── backend/                # FastAPI 백엔드
│   └── app/
│       ├── api/           # API 라우터
│       │   ├── gpt/       # GPT 관련 API
│       │   └── ...
│       ├── core/          # 핵심 설정
│       │   ├── config.py
│       │   ├── database.py
│       │   └── dependencies.py
│       ├── models/        # 데이터베이스 모델
│       │   ├── user.py
│       │   └── bookmark.py
│       ├── schemas/       # Pydantic 스키마
│       ├── services/      # 비즈니스 로직
│       └── storage/       # 데이터베이스 파일
├── frontend/              # React 프론트엔드
│   └── src/
│       ├── components/    # React 컴포넌트
│       │   ├── common/    # 공통 컴포넌트
│       │   ├── chat/      # 채팅 관련
│       │   ├── recipe/    # 레시피 관련
│       │   └── ui/        # UI 컴포넌트
│       ├── pages/         # 페이지 컴포넌트
│       ├── hooks/         # 커스텀 훅
│       └── utils/         # 유틸리티
├── data/                  # 레시피 데이터
├── scripts/               # 데이터 처리 스크립트
└── logs/                  # 로그 파일
```

## 🚀 시작하기

### 환경 설정

1. 환경 변수 설정:
   ```bash
   cp .env.example .env
   # .env 파일을 편집하여 필요한 값들을 설정하세요
   ```

### 백엔드 실행

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

## 🛠️ 기술 스택

**Backend:**
- FastAPI
- SQLAlchemy
- SQLite
- OpenAI GPT API

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Axios

## 📝 API 문서

백엔드 서버 실행 후 http://localhost:8000/docs 에서 Swagger 문서를 확인할 수 있습니다.

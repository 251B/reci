#!/bin/bash

# ReciPICK 프로젝트 배포 스크립트
# Oracle Cloud 서버에서 실행

echo "🚀 ReciPICK 프로젝트 배포를 시작합니다..."

# 환경 변수 설정
export PROJECT_DIR="/home/$USER/recipick"
export REPO_URL="https://github.com/251B/reci.git"  # GitHub 저장소 URL로 변경

# 프로젝트 디렉토리로 이동
cd $PROJECT_DIR

# Git 저장소 클론 또는 업데이트
if [ -d ".git" ]; then
    echo "📝 기존 저장소 업데이트 중..."
    git pull origin main
else
    echo "📥 저장소 클론 중..."
    git clone $REPO_URL .
fi

# 환경 변수 파일 생성
echo "⚙️ 환경 변수 설정 중..."

# Docker 이미지 빌드
echo "🐳 Docker 이미지 빌드 중..."
docker-compose down --remove-orphans
docker-compose build --no-cache

# 데이터베이스 초기화 (첫 실행 시)
echo "🗄️ 데이터베이스 초기화 중..."
docker-compose up -d db
sleep 10

# 애플리케이션 실행
echo "🚀 애플리케이션 실행 중..."
docker-compose up -d

# 상태 확인
echo "📊 서비스 상태 확인 중..."
sleep 5
docker-compose ps

# 로그 출력
echo "📋 애플리케이션 로그:"
docker-compose logs --tail=20

echo "✅ 배포가 완료되었습니다!"
echo ""
echo "서비스 접속 정보:"
echo "- Frontend: http://$(curl -s ifconfig.me):3000"
echo "- Backend API: http://$(curl -s ifconfig.me):8000"
echo "- API 문서: http://$(curl -s ifconfig.me):8000/docs"
echo ""
echo "유용한 명령어들:"
echo "- 로그 확인: docker-compose logs -f"
echo "- 서비스 재시작: docker-compose restart"
echo "- 서비스 중지: docker-compose down"
echo "- 시스템 모니터링: htop"
#!/bin/bash

# Oracle Cloud Ubuntu 22.04 서버 환경 구축 스크립트
# ReciPICK 프로젝트 배포용

echo "🚀 Oracle Cloud 서버 환경 구축을 시작합니다..."

# 시스템 업데이트
echo "📦 시스템 패키지 업데이트 중..."
sudo apt update && sudo apt upgrade -y

# 필수 패키지 설치
echo "🔧 필수 패키지 설치 중..."
sudo apt install -y curl wget git unzip vim htop

# Docker 설치
echo "🐳 Docker 설치 중..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Docker Compose 설치
echo "🐳 Docker Compose 설치 중..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Node.js 18 설치 (프론트엔드 빌드용)
echo "📦 Node.js 18 설치 중..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Python 3.10 및 pip 설치 (이미 설치되어 있지만 확인)
echo "🐍 Python 환경 확인 중..."
sudo apt install -y python3.10 python3-pip python3.10-venv

# PostgreSQL 클라이언트 설치
echo "🗄️ PostgreSQL 클라이언트 설치 중..."
sudo apt install -y postgresql-client

# Nginx 설치
echo "🌐 Nginx 설치 중..."
sudo apt install -y nginx

# UFW 방화벽 설정
echo "🔒 방화벽 설정 중..."
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 8000
sudo ufw allow 3000
sudo ufw --force enable

# Git 전역 설정 (옵션)
echo "📝 Git 설정..."
read -p "Git 사용자 이름을 입력하세요: " git_username
read -p "Git 이메일을 입력하세요: " git_email
git config --global user.name "$git_username"
git config --global user.email "$git_email"

# 프로젝트 디렉토리 생성
echo "📁 프로젝트 디렉토리 생성 중..."
mkdir -p /home/$USER/recipick
cd /home/$USER/recipick

# SSL 인증서 디렉토리 생성
sudo mkdir -p /etc/nginx/ssl

# Let's Encrypt 설치 (SSL용)
echo "🔐 Let's Encrypt 설치 중..."
sudo apt install -y certbot python3-certbot-nginx

# Docker 서비스 시작
echo "🚀 Docker 서비스 시작..."
sudo systemctl start docker
sudo systemctl enable docker

# Nginx 서비스 시작
echo "🌐 Nginx 서비스 시작..."
sudo systemctl start nginx
sudo systemctl enable nginx

echo "✅ 서버 환경 구축이 완료되었습니다!"
echo ""
echo "다음 단계:"
echo "1. 로그아웃 후 다시 로그인하여 Docker 권한 적용"
echo "2. GitHub에서 프로젝트 클론"
echo "3. 환경 변수 설정"
echo "4. Docker Compose로 애플리케이션 실행"
echo ""
echo "현재 설치된 버전들:"
echo "Docker: $(docker --version)"
echo "Docker Compose: $(docker-compose --version)"
echo "Node.js: $(node --version)"
echo "Python: $(python3 --version)"
echo "Nginx: $(nginx -v)"
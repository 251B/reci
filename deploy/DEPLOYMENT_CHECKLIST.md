# Oracle Cloud 배포 완료 체크리스트

## ✅ 배포 완료 확인 사항

### 1. Oracle Cloud 계정 및 인스턴스
- [ ] Oracle Cloud Free Tier 가입 완료
- [ ] VM.Standard.A1.Flex 인스턴스 생성 (2-4 OCPU, 12-24GB RAM)
- [ ] Ubuntu 22.04 이미지 설치
- [ ] 보안 그룹 포트 설정 (22, 80, 443, 8000, 3000)
- [ ] SSH 키 페어 다운로드 및 보관

### 2. 서버 환경 구축
- [ ] SSH 접속 성공
- [ ] setup-server.sh 스크립트 실행 완료
- [ ] Docker 및 Docker Compose 설치 확인
- [ ] Node.js, Python, Nginx 설치 확인
- [ ] 방화벽(UFW) 설정 완료

### 3. 프로젝트 배포
- [ ] GitHub 저장소에 코드 업로드
- [ ] deploy.sh 스크립트 실행 완료
- [ ] 환경 변수 파일(.env) 설정
- [ ] Docker 컨테이너 빌드 및 실행 성공
- [ ] PostgreSQL 데이터베이스 연결 확인

### 4. 서비스 접속 확인
- [ ] Frontend 접속: http://YOUR_IP:3000
- [ ] Backend API 접속: http://YOUR_IP:8000
- [ ] API 문서 접속: http://YOUR_IP:8000/docs
- [ ] 데이터베이스 연결 상태 확인

### 5. 추가 설정 (선택사항)
- [ ] 도메인 구매 및 DNS 설정
- [ ] SSL 인증서 설치 (Let's Encrypt)
- [ ] Nginx 프록시 설정 완료
- [ ] 모니터링 도구 설정

## 🚨 문제 해결

### 자주 발생하는 문제들

1. **Docker 권한 오류**
   ```bash
   sudo usermod -aG docker $USER
   exit  # 재로그인 필요
   ```

2. **포트 접속 불가**
   ```bash
   sudo ufw status
   sudo ufw allow 8000
   sudo ufw allow 3000
   ```

3. **컨테이너 실행 실패**
   ```bash
   docker-compose logs
   docker-compose down
   docker-compose up -d
   ```

4. **메모리 부족**
   ```bash
   free -h
   htop
   # 불필요한 프로세스 종료
   ```

## 📞 지원 정보

- Oracle Cloud 무료 한도: Arm 기반 VM 4 OCPU, 24GB RAM
- 지원 시간: 24/7 (커뮤니티)
- 문서: https://docs.oracle.com/en-us/iaas/

## 🔄 업데이트 방법

```bash
cd recipick
git pull origin main
docker-compose build --no-cache
docker-compose up -d
```
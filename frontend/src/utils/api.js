import axios from "axios";

const hostname = window.location.hostname;

const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

// 환경 변수에서 API URL 가져오기 (빌드 시 설정)
const API_URL = import.meta.env.VITE_API_URL;

const baseURL = API_URL || (isLocalhost
  ? "http://localhost:8000"
  : "https://yourdomain.com/api"); // 프로덕션 도메인으로 변경 예정
  
const api = axios.create({
  baseURL,
  withCredentials: true, 
});

export default api;

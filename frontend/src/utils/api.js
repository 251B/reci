import axios from "axios";

const hostname = window.location.hostname;

const isLocalhost = hostname === "localhost" || hostname === "127.0.0.1";

// 환경 변수에서 API URL 가져오기 (빌드 시 설정)
const API_URL = import.meta.env.VITE_API_URL;

const baseURL = API_URL || (isLocalhost
  ? "http://localhost:8000"
  : "http://144.24.94.13:8000/api"); // 실제 서버 도메인으로 변경
  
const api = axios.create({
  baseURL,
  withCredentials: true, 
});

export default api;

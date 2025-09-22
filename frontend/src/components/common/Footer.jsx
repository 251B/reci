import { Heart, Home, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react"; 
import CustomAlert from "./CustomAlert"; 

export default function Footer({ showAlert }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const goToBookmarks = () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      showAlert("로그인이 필요합니다."); // showAlert 호출
    } else {
      navigate("/bookmarks");
    }
  };

  return (
    <>
      {/* CustomAlert 컴포넌트 추가 */}
      <CustomAlert
        message={alertMessage}
        onClose={() => setAlertMessage("")} // 알림 닫기
      />

      <footer className="w-full max-w-[430px] mx-auto bg-[#FDA177] text-white flex justify-around items-center py-3">
        <button
          onClick={goToBookmarks}
          className={`flex flex-col items-center text-xs ${isActive("/bookmarks") ? "opacity-100" : "opacity-80"}`}
        >
          <Heart size={20} />
          <span>찜</span>
        </button>

        <button
          onClick={() => navigate("/")}
          className={`flex flex-col items-center text-xs ${isActive("/") ? "opacity-100" : "opacity-80"}`}
        >
          <Home size={20} />
          <span>홈</span>
        </button>

        <button
          onClick={() => navigate("/mypage")}
          className={`flex flex-col items-center text-xs ${isActive("/mypage") ? "opacity-100" : "opacity-80"}`}
        >
          <User size={20} />
          <span>마이</span>
        </button>
      </footer>
    </>
  );
}

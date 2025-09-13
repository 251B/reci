import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TopIngredients from "../components/TopIngredients";
import RecentRecipes from "../components/RecentRecipes";
import GptRecommendations from "../components/GptRecommendations";
import MemoSection from "../components/MemoSection";
import MemoModal from "../components/MemoModal";
import { 
  useMyPageData, 
  useGptRecommendations, 
  useMemos, 
  useRecentRecipes 
} from "../hooks";

export default function MyPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  // 사용자 ID 초기화
  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
  }, []);

  // 커스텀 훅들
  const { isLoggedIn, recentRecipes, topIngredients, cacheKey, handleLogout } = useMyPageData(userId);
  const { gptRecommendations, isLoading, handleGptClick } = useGptRecommendations(userId, cacheKey);
  const { memos, selectedMemo, openMemo, closeMemo, deleteMemo } = useMemos(userId);
  const { visibleRecent, handlePrev, handleNext } = useRecentRecipes(recentRecipes);

  return (
    <div className="flex flex-col min-h-screen items-center bg-[#f7f8fa]">
      <div className="w-full max-w-md flex-grow pb-[calc(60px+env(safe-area-inset-bottom))]">
        <Header title="마이페이지" showBack onBack={() => navigate(-1)} />
        
        {isLoggedIn ? (
          <div className="p-6 flex flex-col gap-4">
            {/* 자주 쓴 재료 */}
            <TopIngredients ingredients={topIngredients} />

            {/* 최근 본 레시피 */}
            <RecentRecipes 
              visibleRecent={visibleRecent}
              handlePrev={handlePrev}
              handleNext={handleNext}
            />

            <hr className="border-t border-gray-200 my-1" />

            {/* GPT 맞춤 추천 */}
            <GptRecommendations 
              recommendations={gptRecommendations}
              isLoading={isLoading}
              onGptClick={handleGptClick}
            />

            <hr className="border-t border-gray-200 my-2" />

            {/* 저장한 메모 */}
            <MemoSection 
              memos={memos}
              onMemoClick={openMemo}
              onDeleteMemo={deleteMemo}
              userId={userId}
            />

            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              className="text-xs text-red-400 underline my-2 self-center"
            >
              로그아웃
            </button>
          </div>
        ) : (
          <div className="p-6 mt-24 flex flex-col items-center gap-8">
            <button
              onClick={() => navigate("/login")}
              className="w-full border border-[#FDA177] text-[#FDA177] py-2 rounded-full text-sm font-semibold"
            >
              로그인
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="w-full bg-[#FDA177] text-white py-2 rounded-full text-sm font-semibold"
            >
              회원가입
            </button>
          </div>
        )}
      </div>
      
      {/* 메모 상세 모달 */}
      <MemoModal memo={selectedMemo} onClose={closeMemo} />
      
      {/* 푸터 */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
        <Footer />
      </div>
    </div>
  );
}

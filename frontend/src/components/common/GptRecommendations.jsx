import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./LoadingSpinner";

/**
 * GPT 맞춤 추천 섹션 컴포넌트
 * @param {Array} recommendations - GPT 추천 레시피들
 * @param {boolean} isLoading - 로딩 상태
 * @param {Function} onGptClick - GPT 추천 클릭 핸들러
 */
export default function GptRecommendations({ recommendations, isLoading, onGptClick }) {
  const navigate = useNavigate();

  return (
    <div className="mt-4">
      <h3
        onClick={onGptClick}
        className="text-base font-bold mb-3 cursor-pointer hover:underline"
      >
        🔍이런 레시피는 어떠세요?
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 flex justify-center">
            <LoadingSpinner message="레시피 서치 중..." />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="col-span-2 text-sm text-gray-400">
            클릭을 통해 내 취향에 맞는 레시피를 확인해보세요.
          </div>
        ) : (
          recommendations.slice(0, 6).map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow hover:shadow-md transition cursor-pointer flex flex-col"
              onClick={() => navigate(`/recipe/${rec.id}`)}
            >
              <img 
                src={rec.image_url} 
                alt={rec.title} 
                className="w-full h-24 object-cover" 
              />
              <div className="text-xs text-gray-700 font-bold px-2 pt-2 text-left leading-snug line-clamp-2 min-h-[2.75rem]">
                {rec.title}
              </div>
              <div className="text-[11px] text-gray-700 px-2 py-2 text-left leading-relaxed bg-[#ffe2d9] flex-grow">
                {rec.reason}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * 최근 본 레시피 섹션 컴포넌트
 * @param {Array} visibleRecent - 현재 표시할 레시피들
 * @param {Function} handlePrev - 이전 버튼 핸들러
 * @param {Function} handleNext - 다음 버튼 핸들러
 */
export default function RecentRecipes({ visibleRecent, handlePrev, handleNext }) {
  const navigate = useNavigate();

  if (visibleRecent.length === 0) return null;

  return (
    <>
      <hr className="border-t border-gray-200 my-2" />
      <div className="mt-1">
        <h3 className="text-base font-semibold mb-2">최근 본 레시피</h3>
        <div className="flex items-center gap-2">
          <button onClick={handlePrev}>
            <ChevronLeft size={20} />
          </button>

          <div className="grid grid-cols-2 gap-4 flex-1">
            {visibleRecent.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/recipe/${item.id}`)}
                className="cursor-pointer"
              >
                <img
                  src={item.image_url}
                  alt={item.title}
                  className="w-full h-32 object-cover rounded-md"
                />
                <div className="text-sm text-gray-800 text-center font-semibold h-[36px] leading-tight px-2 overflow-hidden text-ellipsis line-clamp-2">
                  {item.title}
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleNext}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
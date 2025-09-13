import { useNavigate } from "react-router-dom";

/**
 * 메모 상세 모달 컴포넌트
 * @param {Object} memo - 선택된 메모 객체
 * @param {Function} onClose - 모달 닫기 핸들러
 */
export default function MemoModal({ memo, onClose }) {
  const navigate = useNavigate();

  if (!memo) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-80 shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-sm"
        >
          ✕
        </button>
        
        <h3 className="text-base font-bold mb-1 text-[#7a3e0d]">
          {memo.title}
        </h3>
        
        <div className="text-xs text-gray-400 mb-2">
          {memo.time}
        </div>
        
        <p className="text-sm text-gray-800 whitespace-pre-wrap mb-4">
          {memo.text}
        </p>
        
        <div className="text-right">
          <button
            onClick={() => {
              navigate(`/recipe/${memo.recipeId}`);
              onClose();
            }}
            className="bg-[#FDA177] text-white px-4 py-2 rounded-full text-sm hover:bg-[#fc5305]"
          >
            레시피로 이동
          </button>
        </div>
      </div>
    </div>
  );
}
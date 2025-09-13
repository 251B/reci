import { useState } from "react";

export default function RecipeMemo({ recipe, userId }) {
  const [showMemo, setShowMemo] = useState(false);
  const [showMemoSaved, setShowMemoSaved] = useState(false);
  const [memoText, setMemoText] = useState("");

  const getCurrentDateTime = () => {
    return new Date().toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSaveMemo = () => {
    const key = `memo_${userId}_${recipe.id}`;
    const memo = { 
      title: recipe.title, 
      text: memoText, 
      time: getCurrentDateTime() 
    };
    localStorage.setItem(key, JSON.stringify(memo));
    setShowMemo(false);
    setMemoText("");
    setShowMemoSaved(true);
    setTimeout(() => setShowMemoSaved(false), 2000);
  };

  return (
    <>
      {/* 플로팅 메모 버튼 */}
      {/* PC (md 이상)일 때만 보임 */}
      <button
        onClick={() => setShowMemo(true)}
        className="hidden md:fixed md:bottom-60 md:bg-[#ffe2d9] md:text-white md:rounded-full md:w-14 md:h-14 md:flex md:items-center md:justify-center md:shadow-lg md:z-50 md:hover:bg-[#FDA177] md:transition"
        style={{ left: "calc(50% + 218px)", transform: "translateX(-50%)" }}
        aria-label="메모 작성"
      >
        <span className="text-2xl">📝</span>
      </button>

      {/* 모바일일 때만 보임 */}
      <button
        onClick={() => setShowMemo(true)}
        className="fixed bottom-20 right-4 bg-[#ffe2d9] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-50 hover:bg-[#FDA177] transition md:hidden"
        aria-label="메모 작성"
      >
        <span className="text-2xl">📝</span>
      </button>

      {/* 메모 작성 모달 */}
      {showMemo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80 max-w-sm mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">메모 작성</h3>
              <button
                onClick={() => setShowMemo(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <textarea
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              placeholder="레시피에 대한 메모를 작성해보세요..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#fc5305]"
            />
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => setShowMemo(false)}
                className="flex-1 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
              >
                취소
              </button>
              <button
                onClick={handleSaveMemo}
                className="flex-1 py-2 bg-[#fc5305] text-white rounded-lg hover:bg-[#e04a04] transition"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      {showMemoSaved && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          메모가 저장되었습니다!
        </div>
      )}
    </>
  );
}
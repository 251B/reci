/**
 * 메모 섹션 컴포넌트
 * @param {Array} memos - 메모 목록
 * @param {Function} onMemoClick - 메모 클릭 핸들러
 * @param {Function} onDeleteMemo - 메모 삭제 핸들러
 * @param {string} userId - 사용자 ID
 */
export default function MemoSection({ memos, onMemoClick, onDeleteMemo, userId }) {
  return (
    <div className="mt-4">
      <h3 className="text-base font-bold mb-2">✏️ 저장한 메모</h3>
      
      {memos.length === 0 ? (
        <p className="text-sm text-gray-500">작성한 메모가 없습니다.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3">
          {memos.map((memo, idx) => (
            <li
              key={idx}
              className="relative border border-orange-300 bg-orange-100 text-orange-800 rounded-lg p-3 shadow-[0_2px_5px_rgba(0,0,0,0.08)] hover:shadow-md transition cursor-pointer h-40 flex flex-col justify-between"
            >
              {/* 삭제 버튼 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteMemo(idx, memo.recipeId);
                }}
                className="absolute top-1 right-1 text-xs text-gray-400 hover:text-red-500"
                aria-label="삭제"
              >
                ✕
              </button>

              {/* 메모 내용 */}
              <div onClick={() => onMemoClick(memo)}>
                <div className="text-sm font-bold text-[#7a3e0d] line-clamp-1">
                  {memo.title}
                </div>
                <div className="text-xs text-gray-500 mb-4">
                  {memo.time}
                </div>
                <div className="text-sm text-gray-800 line-clamp-2">
                  {memo.text}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
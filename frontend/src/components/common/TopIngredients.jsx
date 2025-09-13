import { useNavigate } from "react-router-dom";

/**
 * 자주 쓴 재료 섹션 컴포넌트
 * @param {Array} ingredients - 자주 쓴 재료 배열
 */
export default function TopIngredients({ ingredients }) {
  const navigate = useNavigate();

  if (ingredients.length === 0) return null;

  return (
    <div>
      <h3 className="text-base font-semibold mb-2">자주 쓴 재료</h3>
      <div className="flex flex-wrap gap-2">
        {ingredients.map((name, index) => (
          <span
            key={index}
            onClick={() =>
              navigate("/chat", {
                state: { initialMessage: `${name} 들어간 요리 추천해줘` },
                replace: true,
              })
            }
            className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-full border border-orange-300 cursor-pointer hover:bg-orange-200"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}
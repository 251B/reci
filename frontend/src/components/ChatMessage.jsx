import { forwardRef } from "react";
import { useNavigate } from "react-router-dom";

const ChatMessage = forwardRef(({ message, onAlternativeSelect, selectedAlternative }, ref) => {
  const navigate = useNavigate();
  const { sender, type, content, time } = message;

  if (sender === "user") {
    return (
      <div className="flex justify-end mt-1" ref={ref}>
        <div className="px-4 py-2 text-sm rounded-xl max-w-[75%] whitespace-pre-wrap bg-[#FBF5EF] text-gray-800 rounded-tr-none">
          {content.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start justify-start mt-1" ref={ref}>
      <img src="/images/chatbot.png" alt="Bot" className="w-12 h-12 rounded-full mr-2" />
      
      {type === "text" && (
        <div className="px-4 py-2 text-sm rounded-xl max-w-[75%] whitespace-pre-wrap bg-[#ffcb8c] text-[#7a3e0d] rounded-tl-none mt-1.5">
          {content.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </div>
      )}

      {type === "recommendation" && (
        <div className="px-4 py-2 text-sm rounded-xl max-w-[75%] whitespace-pre-wrap bg-[#ffcb8c] text-[#7a3e0d] rounded-tl-none mt-1.5">
          <ul className="space-y-1">
            {content.recipes.map((recipe) => {
              let emoji = "🍽️"; // 기본값

              if (content.source === "difficulty-time") {
                const filterCondition = content.filterCondition || {};
                const hasDifficulty = filterCondition.difficulty;
                const hasTime = filterCondition.maxTime || filterCondition.cookTime;
                
                if (hasDifficulty && !hasTime) {
                  emoji = "🍳";
                } else if (hasTime && !hasDifficulty) {
                  emoji = "⏱️";
                } else {
                  emoji = "🍳";
                }
              }

              return (
                <li key={recipe.id} className="flex items-start">
                  <span className="mr-2">{emoji}</span>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate(`/recipe/${recipe.id}`);
                    }}
                    className="text-blue-600 hover:underline text-left bg-transparent border-none p-0 cursor-pointer"
                  >
                    {recipe.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {type === "servingsCard" && !content.adjustedType && (
        <div
          onClick={() =>
            navigate(`/recipe/${content.id}`, {
              state: {
                adjusted: true,
                adjustedIngredients: content.ingredients,
                adjustedSteps: content.steps,
                adjustedServing: content.serving,
              },
            })
          }
          className="cursor-pointer border border-gray-300 bg-[#FFFFFF] p-4 rounded-xl shadow-sm hover:shadow-md transition max-w-[95%]"
        >
          <div className="text-base font-bold text-gray-900">
            {content.title} ({content.serving})
          </div>
          <div className="text-xs text-gray-500 mt-1 mb-2">
            기존 레시피에서 {content.serving}으로 조정된 레시피입니다.
          </div>
          <div className="text-sm text-gray-800 font-semibold mb-1">재료</div>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-0.5">
            {content.ingredients.slice(0, 3).map((item, idx) => {
              const [name, amount] = item.split(":");
              return (
                <li key={idx}>
                  <span className="text-gray-800">{name.trim()}</span>
                  {amount && `: ${amount.trim()}`}
                </li>
              );
            })}
            {content.ingredients.length > 3 && (
              <li className="text-gray-400 text-xs mt-1">... 더보기</li>
            )}
          </ul>
        </div>
      )}

      {type === "servingsCard" && content.adjustedType === "substitute" && (
        <div className="px-4 py-2 text-sm rounded-xl max-w-[75%] whitespace-pre-wrap bg-[#ffcb8c] text-[#7a3e0d] rounded-tl-none mt-1.5">
          {(() => {
            const substitutedItems = content.substitutedKeys
              ? content.ingredients.filter(item =>
                  content.substitutedKeys.includes(item.split(":")[0].trim())
                )
              : content.ingredients;

            let chatText = "";
            
            substitutedItems.forEach((item, idx) => {
              const [name, optionsStr] = item.split(":");
              const options = optionsStr
                ? optionsStr.split(/\s*\|\s*/) : [];

              const isProbablyFraction = /^\s*\d+\/\d+/.test(optionsStr);
              const isSubstitute = optionsStr?.includes("|") && options.length > 1 && !isProbablyFraction;

              if (isSubstitute) {
                options.forEach(opt => {
                  chatText += `📌${opt.trim()}\n`;
                });
              } else {
                chatText += `📌${optionsStr?.trim()}\n`;
              }
            });

            return chatText.trim().split('\n').map((line, i) => (
              <span key={i}>
                {line}
                <br />
              </span>
            ));
          })()}
        </div>
      )}
    </div>
  );
});

ChatMessage.displayName = "ChatMessage";

export default ChatMessage;
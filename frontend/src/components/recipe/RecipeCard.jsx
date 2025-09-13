import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RecipeCard({ 
  recipe, 
  isBookmarked, 
  onToggleBookmark, 
  categoryName, 
  categoryIcon,
  showCategory = false,
  variant = "default", // "default" | "bookmark"
  onRemove
}) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/recipe/${recipe.id}`, {
      state: { categoryName, categoryIcon },
    });
  };

  const handleBookmarkClick = (e) => {
    e.stopPropagation();
    onToggleBookmark(recipe.id);
  };

  const handleRemoveClick = (e) => {
    e.stopPropagation();
    onRemove(recipe.id, e);
  };

  // 북마크 페이지 전용 레이아웃
  if (variant === "bookmark") {
    return (
      <div
        className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer flex items-center relative"
        onClick={handleCardClick}
      >
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-20 h-20 object-cover flex-shrink-0 ml-2 my-2 rounded-lg"
        />
        <div className="flex flex-col justify-center flex-1 px-3 py-2 pr-8">
          <div className="text-sm font-normal text-gray-800">{recipe.title}</div>
        </div>
        <button
          onClick={handleRemoveClick}
          className="absolute top-1 right-1 w-6 h-6 text-gray-400 hover:text-red-500 flex items-center justify-center text-lg font-normal transition-colors"
          title="북마크 삭제"
        >
          ×
        </button>
      </div>
    );
  }

  // 기본 레시피 카드 레이아웃

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={recipe.image_url}
          alt={recipe.title}
          className="w-full h-36 object-cover"
        />
        <button
          onClick={handleBookmarkClick}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
        >
          <Heart
            size={20}
            fill={isBookmarked ? "red" : "white"}
            className={isBookmarked ? "text-red-500" : "text-gray-300"}
          />
        </button>
      </div>
      <div className="text-center text-sm text-gray-700 py-2 px-2">
        {showCategory && categoryName && (
          <div className="text-xs text-gray-500 mb-1">
            {categoryIcon} {categoryName}
          </div>
        )}
        {recipe.title}
      </div>
    </div>
  );
}
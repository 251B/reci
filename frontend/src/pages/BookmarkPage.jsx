import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import RecipeCard from "../components/recipe/RecipeCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import EmptyState from "../components/common/EmptyState";
import { useBookmarks, useBookmarkedRecipes } from "../hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BOOKMARK_PAGE_CONSTANTS } from "../constants/bookmarkConstants";

export default function BookmarkPage() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  
  // 북마크 훅 사용
  const { bookmarkedIds, toggleBookmark, fetchBookmarks } = useBookmarks(userId);
  
  // 북마크된 레시피 데이터 관리
  const { recipes, isLoading, error, removeRecipe } = useBookmarkedRecipes(bookmarkedIds);

  const handleRemoveBookmark = async (recipeId, e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지
    await toggleBookmark(recipeId);
    removeRecipe(recipeId);
  };

  useEffect(() => {
    if (!userId) {
      navigate(BOOKMARK_PAGE_CONSTANTS.ROUTES.LOGIN, { replace: true });
      return;
    }
    fetchBookmarks();
  }, [userId, navigate]);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-[#F7F8FA] pb-20">
        <div className="w-full max-w-md mx-auto text-sm">
          <Header title="찜한 레시피" showBack onBack={() => navigate(-1)} />
          <div className="p-4 flex flex-col gap-3">
            {isLoading ? (
              <LoadingSpinner message={BOOKMARK_PAGE_CONSTANTS.MESSAGES.LOADING} />
            ) : error ? (
              <EmptyState
                icon="⚠️"
                title="오류가 발생했습니다"
                description={error}
                buttonText="다시 시도"
                onButtonClick={() => window.location.reload()}
              />
            ) : recipes.length > 0 ? (
              recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  variant="bookmark"
                  onRemove={handleRemoveBookmark}
                />
              ))
            ) : (
              <EmptyState
                icon={BOOKMARK_PAGE_CONSTANTS.ICONS.EMPTY}
                title={BOOKMARK_PAGE_CONSTANTS.MESSAGES.EMPTY_TITLE}
                description={BOOKMARK_PAGE_CONSTANTS.MESSAGES.EMPTY_DESCRIPTION}
                buttonText={BOOKMARK_PAGE_CONSTANTS.MESSAGES.BUTTON_TEXT}
                buttonPath={BOOKMARK_PAGE_CONSTANTS.ROUTES.HOME}
              />
            )}
          </div>
        </div>
      </main>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
        <Footer />
      </div>
    </div>
  );
}

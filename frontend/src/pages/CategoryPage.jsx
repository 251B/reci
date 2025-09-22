import { Search } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useCallback } from "react";
import Header from "../components/common/Header";
import RecipeCard from "../components/recipe/RecipeCard";
import { useBookmarks, useScrollToTop, useInfiniteScroll } from "../hooks";
import api from "../utils/api";
import CustomAlert from "../components/common/CustomAlert";

export default function CategoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 북마크 훅 사용
  const userId = localStorage.getItem("userId");
  const { bookmarkedIds, toggleBookmark, fetchBookmarks, alertMessage, setAlertMessage } =
    useBookmarks(userId);

  // 스크롤 훅 사용
  const [showTopBtn, scrollToTop] = useScrollToTop(200);

  // 무한 스크롤 훅 사용
  const fetchMoreRecipes = useCallback(() => {
    setPage((prev) => {
      const next = prev + 1;
      fetchRecipes(next);
      return next;
    });
  }, []);

  const lastItemRef = useInfiniteScroll(hasMore, fetchMoreRecipes);

  const params = new URLSearchParams(location.search);
  const nameFromQuery = params.get("name");
  const decodedName = nameFromQuery ? decodeURIComponent(nameFromQuery) : "";

  const categoryIconMap = {
    "밥/죽/떡": "🍚",
    "국/탕": "🫕",
    "찌개": "🍲",
    "밑반찬": "🥢",
    "메인반찬": "🥣",
    "양식": "🍝",
    "빵": "🥖",
    "디저트": "🧁",
    "퓨전": "🥘",
    "샐러드": "🥗",
  };

  const categoryName = decodedName;
  const categoryIcon =
    location.state?.categoryIcon || categoryIconMap[categoryName] || "🍽️";
  const categoryTitle = `${categoryIcon} ${categoryName}`;

  const fetchRecipes = async (pageNum = 1) => {
    try {
      const res = await api.get(
        `/category/search?name=${encodeURIComponent(decodedName)}&page=${pageNum}&per_page=8`
      );
      const newRecipes = res.data.recipes || [];
      setRecipes((prev) => {
        const seen = new Set(prev.map((r) => r.id));
        const filtered = newRecipes.filter((r) => !seen.has(r.id));
        return [...prev, ...filtered];
      });
      if (newRecipes.length === 0 || newRecipes.every(r => recipes.some(e => e.id === r.id))) {
        setHasMore(false);
      }
    } catch (err) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setRecipes([]);
    setHasMore(true);
    fetchRecipes(1);
  }, [decodedName]);

  useEffect(() => {
    if (userId) {
       fetchBookmarks();
    }
  }, [userId]);

  const filteredItems = recipes
    .filter(item =>
      item.title !== "정보 없음" &&
      item.image_url !== "정보 없음" &&
      item.image_url?.trim() !== ""
    )
    .filter(item =>
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex justify-center">
      <div className="w-full max-w-md flex flex-col">
        <Header title={categoryTitle} showBack onBack={() => navigate("/")} />
        <div className="bg-white p-4">
          <div className="relative flex items-center border border-[#fc5305] rounded-full bg-[#ffffff] px-4 py-2">
            <Search className="text-[#fc5305] mr-2" size={20} />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="레시피 검색"
              className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => {
              const isLast = index === filteredItems.length - 1;
              return (
                <div key={item.id} ref={isLast ? lastItemRef : null}>
                  <RecipeCard
                    recipe={item}
                    isBookmarked={bookmarkedIds.includes(Number(item.id))}
                    onToggleBookmark={toggleBookmark}
                    categoryName={categoryName}
                    categoryIcon={categoryIcon}
                  />
                </div>
              );
            })
          ) : (
            <p className="col-span-2 text-center text-sm text-gray-400">
              로딩중 ...
            </p>
          )}
        </div>

        {/* CustomAlert 추가 */}
        <CustomAlert
          message={alertMessage}
          onClose={() => setAlertMessage("")} // 알림 닫기
        />

        {showTopBtn && (
          <>
            {/*PC용 버튼 */}
            <button
              onClick={scrollToTop}
              className="hidden md:fixed md:bottom-20 md:bg-[#FDA177] md:text-white md:rounded-full md:w-12 md:h-12 md:flex md:items-center md:justify-center md:shadow-lg md:z-50 md:transition md:hover:bg-[#fc5305]"
              style={{ right: 'calc(50% - 250px)' }}
              aria-label="맨 위로 (PC)"
            >
              <span style={{ fontSize: "2rem", lineHeight: "2rem" }}>↑</span>
            </button>

            {/*모바일용 버튼 */}
            <button
              onClick={scrollToTop}
              className="fixed bottom-20 right-4 bg-[#FDA177] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-50 transition hover:bg-[#fc5305] md:hidden"
              aria-label="맨 위로 (모바일)"
            >
              <span style={{ fontSize: "2rem", lineHeight: "2rem" }}>↑</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";
import RecipeCard from "../components/recipe/RecipeCard";
import { useState, useEffect, useRef, useCallback } from "react";
import { useScrollToTop, useInfiniteScroll } from "../hooks";
import api from "../utils/api";
import CustomAlert from "../components/common/CustomAlert"; 

export default function MainPage() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const containerRef = useRef();
  const [showTopBtn, scrollToTop] = useScrollToTop(200);
  const [alertMessage, setAlertMessage] = useState(""); // 알림 메시지 상태 추가

  // 무한 스크롤 훅 사용
  const fetchMoreResults = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  const lastResultRef = useInfiniteScroll(hasMore, fetchMoreResults);

  const foodCategories = [
    { name: "밥/죽/떡", icon: "🍚" },
    { name: "국/탕", icon: "🫕" },
    { name: "찌개", icon: "🍲" },
    { name: "밑반찬", icon: "🥢" },
    { name: "메인반찬", icon: "🥣" },
    { name: "양식", icon: "🍝" },
    { name: "빵", icon: "🥖" },
    { name: "디저트", icon: "🧁" },
    { name: "퓨전", icon: "🥘" },
    { name: "샐러드", icon: "🥗" },
  ];

  useEffect(() => {
    setSearchResults([]);
    setPage(1);
  }, [searchText]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchText.trim()) return;
      try {
        const res = await api.get(
          `/search/title?q=${encodeURIComponent(searchText)}&page=${page}&per_page=8`
        );
        const newResults = res.data.recipes || [];
        setSearchResults((prev) => {
          if (page === 1) {
            setHasMore(newResults.length > 0);
            return newResults;
          }
          const seen = new Set(prev.map((r) => r.id));
          const filtered = newResults.filter((r) => !seen.has(r.id));
          setHasMore(filtered.length > 0);
          return [...prev, ...filtered];
        });
      } catch (err) {
        //console.error("검색 오류:", err);
        setHasMore(false);
      }
    };
    fetchResults();
  }, [searchText, page]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const showAlert = (message) => {
    setAlertMessage(message);
  };

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen">
      {/* CustomAlert 컴포넌트 */}
      <CustomAlert
        message={alertMessage}
        onClose={() => setAlertMessage("")}
      />

      <main className="flex-grow bg-[#F7F8FA]">
        <div className="relative w-full max-w-md mx-auto bg-[#F7F8FA] text-sm">
          <Header
            title={
              <img
                src="/images/mainlogo.png"
                alt="레시픽 로고"
                className="h-12 object-contain"
              />
            }
            onLogoClick={() => {
              setSearchText("");
              setSearchResults([]);
              setPage(1);
            }}
          />

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

          {searchText.trim() !== "" ? (
            <div className="p-4 grid grid-cols-2 gap-4">
              {searchResults.map((recipe, idx) => (
                <div
                  key={recipe.id}
                  ref={idx === searchResults.length - 1 ? lastResultRef : null}
                >
                  <RecipeCard
                    recipe={recipe}
                    showCategory={true}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <div className="grid grid-cols-3 gap-x-4 gap-y-5 place-items-center">
                {foodCategories.map((category, idx) => (
                  <button
                    key={idx}
                    onClick={() =>
                      navigate(`/category?name=${encodeURIComponent(category.name)}`, {
                        state: {
                          categoryName: category.name,
                          categoryIcon: category.icon,
                        },
                      })
                    }
                    className="w-full max-w-[100px] h-[100px] bg-[#ffe2d9] hover:bg-[#FFCBB3] transition-all rounded-2xl shadow-sm flex flex-col items-center justify-center"
                  >
                    <span className="text-[27px]">{category.icon}</span>
                    <span className="text-[13px] font-medium text-black mt-3">
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {searchText.trim() === "" && (
            <div
              onClick={() => navigate("/chat")}
              className="absolute bottom-4 right-4 w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-transform z-50"
            >
              <img
                src="/images/chat.png"
                alt="챗봇"
                className="w-24 h-24 object-contain"
              />
            </div>
          )}
          {showTopBtn && (
            <button
              onClick={handleScrollToTop}
              className="fixed bottom-20 bg-[#FDA177] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg z-50 transition hover:bg-[#fc5305]"
              style={{
                right: 'calc(50% - 238px)',
              }}
              aria-label="맨 위로"
            >
              <span style={{ fontSize: "2rem", lineHeight: "2rem" }}>↑</span>
            </button>
          )}
        </div>
      </main>
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50">
        <Footer showAlert={showAlert} /> {/* showAlert 함수 전달 */}
      </div>
    </div>
  );
}

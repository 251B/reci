import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Clock, User, Star, Heart } from "lucide-react";
import Header from "../components/common/Header";
import RecipeTTS from "../components/recipe/RecipeTTS";
import RecipeTimer from "../components/recipe/RecipeTimer";
import RecipeMemo from "../components/recipe/RecipeMemo";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CustomAlert from "../components/common/CustomAlert"; // 커스텀 알림 추가
import api from "../utils/api";

function getStarsByDifficulty(difficulty) {
  switch (difficulty) {
    case "아무나":
    case "초급":
      return 1;
    case "중급":
      return 2;
    case "고급":
      return 3;
    default:
      return 0;
  }
}

export default function RecipePage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const [recipe, setRecipe] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); // 알림 메시지 상태 추가

  const adjusted = location.state?.adjusted;
  const adjustedIngredients = location.state?.adjustedIngredients;
  const adjustedSteps = location.state?.adjustedSteps;
  const adjustedServing = location.state?.adjustedServing;
  const selectedAlternative = location.state?.selectedAlternative || {};

  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await api.get(`/recipe/${id}`);
        setRecipe(res.data);
      } catch (err) {
        setError("레시피를 불러오는 데 실패했습니다.");
      }
    };

    const fetchBookmarkStatus = async () => {
      if (!userId) return;
      try {
        const res = await api.get("/bookmark/", {
          params: { user_id: userId },
        });
        const ids = res.data.recipe_ids.map(Number);
        setIsBookmarked(ids.includes(Number(id)));
      } catch (err) {
        // 북마크 상태 확인 실패 시 기본값 유지
      }
    };

    fetchRecipe();
    fetchBookmarkStatus();
  }, [id, userId]);

  useEffect(() => {
    if (recipe && userId) {
      const newItem = {
        id: recipe.id,
        title: recipe.title,
        image_url: recipe.image_url,
        ingredients: recipe.ingredients,
      };

      // recentViews: 최신 8개만
      const key = `recentViews_${userId}`;
      const viewed = JSON.parse(localStorage.getItem(key) || "[]");
      const updatedRecent = [newItem, ...viewed.filter((item) => item.id !== recipe.id)].slice(0, 8);
      localStorage.setItem(key, JSON.stringify(updatedRecent));

      // longTermViews: 제한 없이 누적 저장
      const longKey = `longTermViews_${userId}`;
      const longList = JSON.parse(localStorage.getItem(longKey) || "[]");
      const updatedLong = [newItem, ...longList.filter((item) => item.id !== recipe.id)];
      localStorage.setItem(longKey, JSON.stringify(updatedLong));
    }
  }, [recipe, userId]);

  const toggleBookmark = async () => {
    if (!userId) {
      setAlertMessage("로그인이 필요합니다."); // 커스텀 알림 메시지 설정
      return;
    }

    try {
      if (isBookmarked) {
        await api.delete(`/bookmark/${id}`, {
          params: { user_id: userId },
        });
        setIsBookmarked(false);
      } else {
        await api.post(`/bookmark/${id}`, null, {
          params: { user_id: userId },
        });
        setIsBookmarked(true);
      }
    } catch (err) {
      // 북마크 처리 실패 시 UI는 원래 상태로 복원
    }
  };

  if (error) return <div className="p-4">{error}</div>;
  if (!recipe) return <LoadingSpinner message="레시피를 불러오고 있어요..." />;

  if (
    recipe.title === "정보 없음" ||
    recipe.image_url === "정보 없음" ||
    recipe.ingredients?.some((ing) => ing === "정보 없음") ||
    recipe.steps?.some((step) => step === "정보 없음")
  ) {
    return <div className="p-4 text-gray-500">해당 레시피 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 items-center">
      <CustomAlert
        message={alertMessage}
        onClose={() => setAlertMessage("")} // 알림 닫기
      />
      <div className="w-full max-w-md">
        <Header
          title={
            <img
              src="/images/mainlogo.png"
              alt="레시픽 로고"
              className="h-12 object-contain"
            />
          }
          showBack
          onBack={() => navigate(-1)}
        />

        <div className="relative">
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-52 object-cover"
          />
        </div>

        <div className="p-4 bg-white border-b border-gray-200">
          <div className="flex justify-between items-start mb-6 gap-2">
            <div className="flex flex-col flex-1">
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-xl font-bold break-words flex-1">{recipe.title}</h2>
                <button onClick={toggleBookmark} className="shrink-0">
                  <Heart
                    size={22}
                    fill={isBookmarked ? "red" : "white"}
                    className={isBookmarked ? "text-red-500" : "text-gray-300"}
                  />
                </button>
              </div>
            </div>

            <button
              onClick={() =>
                navigate("/chat", {
                  state: {
                    recipe: adjusted
                      ? {
                        ...recipe,
                        ingredients: adjustedIngredients,
                        steps: adjustedSteps,
                        serving: adjustedServing,
                      }
                      : recipe,
                  },
                })
              }
              className="text-xs bg-[#2DB431] text-white font-semibold px-3 py-1 rounded-full shadow hover:bg-[#1e7f22] transition whitespace-nowrap"
            >
              💬 Chat
            </button>
          </div>

          <div className="flex justify-center text-center text-gray-500 text-sm px-4">
            <div className="flex gap-12">
              <div className="flex flex-col items-center">
                <User size={18} />
                <span className="mt-1">{adjusted ? adjustedServing : recipe.serving}</span>
              </div>
              <div className="flex flex-col items-center">
                <Clock size={18} />
                <span className="mt-1">{recipe.cook_time}</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex gap-1">
                  {Array.from({ length: getStarsByDifficulty(recipe.difficulty) }).map(
                    (_, i) => (
                      <Star
                        key={i}
                        size={18}
                        strokeWidth={2}
                        className="text-gray-600"
                        fill="currentColor"
                      />
                    )
                  )}
                </div>
                <span className="mt-1 text-sm text-gray-500">난이도 {recipe.difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white mt-2 border-b border-gray-200">
          <h3 className="text-lg font-bold mb-4">재료</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {(adjusted ? adjustedIngredients : recipe.ingredients).map((item, idx) => {
              const [name, amount] = item.split(":");
              const altText = selectedAlternative[name.trim()] || amount;
              return (
                <li key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-800">{name.trim()}</span>
                  <span className="text-[#18881C] font-medium">{altText?.trim()}</span>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-4 bg-white mt-2">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold">조리순서</h3>
              <RecipeTTS 
                steps={adjusted ? adjustedSteps : recipe.steps}
                currentStepIndex={currentStepIndex}
                onStepChange={setCurrentStepIndex}
              />
            </div>

            <RecipeTimer />
          </div>

          {(adjusted ? adjustedSteps : recipe.steps).map((step, idx) => {
            const cleanStep = step.replace(/^\d+[\.\)]?\s*/, "");
            return (
              <div key={idx} className="mb-6">
                <div className="flex items-start mb-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#2DB431] text-white text-sm font-bold mr-3">
                    {idx + 1}
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed flex-1">
                    {cleanStep}
                  </p>
                </div>
              </div>
            );
          })}

          {/* 메모 컴포넌트 */}
          <RecipeMemo 
            recipe={recipe}
            userId={userId}
          />

        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import api from "../utils/api";

const SEASONINGS = [
  "소금", "설탕", "간장", "식초", "후추", "고춧가루", "고추장", "된장", "참기름", "들기름",
  "물엿", "맛술", "청주", "케첩", "마요네즈", "쌈장", "양조간장", "진간장", "미림", "물", "올리고당",
  "밀가루", "식용유", "다진마늘", "다진 마늘", "굴소스"
];

/**
 * GPT 맞춤 추천 기능을 관리하는 훅
 * @param {string} userId - 사용자 ID
 * @param {string} cacheKey - 캐시 키
 * @returns {object} GPT 추천 관련 상태와 함수들
 */
export const useGptRecommendations = (userId, cacheKey) => {
  const [gptRecommendations, setGptRecommendations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);

  const handleGptClick = async () => {
    if (isLoading || hasRequested || !userId) return;
    
    setHasRequested(true);

    // 캐시 체크
    const recKey = `customGptRecommendations_${userId}`;
    const recCacheKey = `customGptRecommendationsKey_${userId}`;
    const recCacheTime = `customGptCacheTime_${userId}`;
    
    const lastKey = localStorage.getItem(recCacheKey);
    const lastTime = Number(localStorage.getItem(recCacheTime));
    const now = Date.now();
    const isFresh = now - lastTime < 1000 * 60 * 60 * 6; // 6시간

    // 캐시된 결과가 있고 유효한 경우
    if (lastKey === cacheKey && isFresh) {
      const cached = localStorage.getItem(recKey);
      setGptRecommendations(JSON.parse(cached || "[]"));
      return;
    }

    setIsLoading(true);

    try {
      // 최근 레시피 데이터 준비
      const storedLong = localStorage.getItem(`longTermViews_${userId}`);
      const parsedLong = storedLong ? JSON.parse(storedLong) : [];

      const recentForPrompt = parsedLong
        .filter(r =>
          r &&
          typeof r.title === "string" &&
          r.title.trim() !== "" &&
          Array.isArray(r.ingredients)
        )
        .map(r => ({
          id: String(r.id),
          title: r.title,
          ingredients: (r.ingredients || [])
            .map(i => i?.split?.(":")?.[0]?.trim())
            .filter(name => typeof name === "string" && name && !SEASONINGS.includes(name))
        }))
        .filter(r => r.ingredients.length > 0);

      // 북마크 데이터 가져오기
      const bookmarkRes = await api.get("/bookmark/", {
        params: { user_id: userId },
      });

      const recipeIds = bookmarkRes.data?.recipe_ids || [];
      const bookmarked = Array.isArray(recipeIds) ? 
        recipeIds
          .filter(id => id !== null && id !== undefined)
          .map(id => String(id)) : [];

      // GPT 추천 요청
      const gptRes = await api.post("/gpt/custom", {
        recent_recipes: recentForPrompt,
        bookmarked_recipe_ids: bookmarked,
      });

      const result = gptRes.data?.recipes || [];

      // 캐시 저장
      localStorage.setItem(recKey, JSON.stringify(result));
      localStorage.setItem(recCacheKey, cacheKey);
      localStorage.setItem(recCacheTime, Date.now().toString());

      setGptRecommendations(result);
    } catch (err) {
      console.error("GPT 추천 요청 실패:", err);
      // 더 구체적인 에러 정보 로깅
      if (err.response) {
        console.error("API 응답 에러:", err.response.status, err.response.data);
      } else if (err.request) {
        console.error("네트워크 에러:", err.message);
      } else {
        console.error("기타 에러:", err.message);
      }
      setGptRecommendations([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    gptRecommendations,
    isLoading,
    handleGptClick,
  };
};
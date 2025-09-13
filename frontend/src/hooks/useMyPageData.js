import { useState, useEffect } from "react";

const SEASONINGS = [
  "소금", "설탕", "간장", "식초", "후추", "고춧가루", "고추장", "된장", "참기름", "들기름",
  "물엿", "맛술", "청주", "케첩", "마요네즈", "쌈장", "양조간장", "진간장", "미림", "물", "올리고당",
  "밀가루", "식용유", "다진마늘", "다진 마늘", "굴소스"
];

/**
 * MyPage에서 사용하는 기본 데이터 관리 훅
 * @param {string} userId - 사용자 ID
 * @returns {object} 사용자 기본 데이터와 상태
 */
export const useMyPageData = (userId) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [topIngredients, setTopIngredients] = useState([]);
  const [cacheKey, setCacheKey] = useState("");

  useEffect(() => {
    setIsLoggedIn(!!userId);
    
    if (!userId) {
      setRecentRecipes([]);
      setTopIngredients([]);
      setCacheKey("");
      return;
    }

    // 최근 본 레시피 로드
    const storedRecent = localStorage.getItem(`recentViews_${userId}`);
    const storedLong = localStorage.getItem(`longTermViews_${userId}`);
    
    let parsedRecent = [];
    let parsedLong = [];

    if (storedRecent) {
      parsedRecent = JSON.parse(storedRecent);
      setRecentRecipes(parsedRecent);
    }
    
    if (storedLong) {
      parsedLong = JSON.parse(storedLong);
    }

    // 자주 쓴 재료 계산
    const ingredients = parsedLong.flatMap(r => r.ingredients || []);
    const nameCounts = {};
    
    ingredients.forEach((item) => {
      const name = item.split(":")[0].trim();
      if (name && !SEASONINGS.includes(name)) {
        nameCounts[name] = (nameCounts[name] || 0) + 1;
      }
    });
    
    const sorted = Object.entries(nameCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name]) => name);
    
    setTopIngredients(sorted);

    // GPT 추천을 위한 캐시 키 생성
    const recentForPrompt = parsedLong.map(r => ({
      id: r.id,
      title: r.title,
      ingredients: (r.ingredients || [])
        .map(i => i.split(":")[0].trim())
        .filter(name => name && !SEASONINGS.includes(name))
    }));
    
    const key = JSON.stringify(recentForPrompt);
    setCacheKey(key);
  }, [userId]);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setIsLoggedIn(false);
    alert("로그아웃 되었습니다.");
  };

  return {
    isLoggedIn,
    recentRecipes,
    topIngredients,
    cacheKey,
    handleLogout,
  };
};
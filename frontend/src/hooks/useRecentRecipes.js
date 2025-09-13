import { useState } from "react";

/**
 * 최근 본 레시피 캐러셀 관리 훅
 * @param {Array} recentRecipes - 최근 본 레시피 배열
 * @returns {object} 캐러셀 관련 상태와 함수들
 */
export const useRecentRecipes = (recentRecipes = []) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 2 + recentRecipes.length) % recentRecipes.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 2) % recentRecipes.length);
  };

  const visibleRecent = recentRecipes.slice(currentIndex, currentIndex + 2);

  return {
    currentIndex,
    visibleRecent,
    handlePrev,
    handleNext,
  };
};
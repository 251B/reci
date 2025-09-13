import { useState, useEffect } from "react";

export const useLocalStorageState = (key, initialValue) => {
  // localStorage에서 초기값 가져오기
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // state가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
};

// 여러 localStorage 상태를 한번에 관리하는 훅
export const useRecipeFilters = () => {
  const [seenRecipeIds, setSeenRecipeIds] = useLocalStorageState("seenRecipeIds", []);
  const [lastFilterCondition, setLastFilterCondition] = useLocalStorageState("lastFilterCondition", null);
  const [filterPage, setFilterPage] = useLocalStorageState("filterPage", 1);
  const [previousIngredients, setPreviousIngredients] = useLocalStorageState("previousIngredients", []);

  const resetFilters = () => {
    setSeenRecipeIds([]);
    setLastFilterCondition(null);
    setFilterPage(1);
    setPreviousIngredients([]);
    // localStorage도 함께 제거
    localStorage.removeItem("seenRecipeIds");
    localStorage.removeItem("lastFilterCondition"); 
    localStorage.removeItem("filterPage");
    localStorage.removeItem("previousIngredients");
  };

  return {
    seenRecipeIds,
    setSeenRecipeIds,
    lastFilterCondition,
    setLastFilterCondition,
    filterPage,
    setFilterPage,
    previousIngredients,
    setPreviousIngredients,
    resetFilters,
  };
};
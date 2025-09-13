import { useState, useEffect } from "react";

/**
 * 메모 관리 기능을 위한 훅
 * @param {string} userId - 사용자 ID
 * @returns {object} 메모 관련 상태와 함수들
 */
export const useMemos = (userId) => {
  const [memos, setMemos] = useState([]);
  const [selectedMemo, setSelectedMemo] = useState(null);

  useEffect(() => {
    if (!userId) {
      setMemos([]);
      return;
    }

    // localStorage에서 메모 목록 로드
    const allKeys = Object.keys(localStorage);
    const filtered = allKeys.filter((key) => key.startsWith(`memo_${userId}_`));
    
    const memoList = filtered.map((key) => {
      const data = JSON.parse(localStorage.getItem(key));
      const recipeId = key.split("_")[2];
      return { ...data, recipeId };
    });
    
    setMemos(memoList);
  }, [userId]);

  const deleteMemo = (memoIndex, recipeId) => {
    localStorage.removeItem(`memo_${userId}_${recipeId}`);
    setMemos((prev) => prev.filter((_, i) => i !== memoIndex));
  };

  const openMemo = (memo) => {
    setSelectedMemo(memo);
  };

  const closeMemo = () => {
    setSelectedMemo(null);
  };

  return {
    memos,
    selectedMemo,
    openMemo,
    closeMemo,
    deleteMemo,
  };
};
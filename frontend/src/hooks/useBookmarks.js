import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

/**
 * 북마크 기능을 관리하는 훅
 * @param {string|number} userId - 사용자 ID
 * @returns {object} 북마크 관련 상태와 함수들
 */
export const useBookmarks = (userId) => {
  const navigate = useNavigate();
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 북마크 목록 조회
  const fetchBookmarks = useCallback(async () => {
    if (!userId) return;
    
    try {
      setIsLoading(true);
      const res = await api.get("/bookmark/", {
        params: { user_id: userId },
      });
      // API 응답 구조: res.data.data.recipe_ids
      setBookmarkedIds(res.data.data?.recipe_ids?.map(id => Number(id)) || []);
    } catch (err) {
      console.error("찜 목록 불러오기 실패:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // 북마크 토글
  const toggleBookmark = useCallback(async (recipeId) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const isBookmarked = bookmarkedIds.includes(Number(recipeId));
    
    try {
      if (isBookmarked) {
        await api.delete(`/bookmark/${recipeId}`, {
          params: { user_id: userId },
        });
        setBookmarkedIds((prev) => prev.filter((id) => id !== Number(recipeId)));
      } else {
        await api.post(`/bookmark/${recipeId}`, null, {
          params: { user_id: userId },
        });
        setBookmarkedIds((prev) => [...prev, Number(recipeId)]);
      }
    } catch (err) {
      console.error("찜 처리 에러:", err.response?.data?.detail);
    }
  }, [userId, bookmarkedIds, navigate]);

  // 북마크 상태 확인
  const isBookmarked = useCallback((recipeId) => {
    return bookmarkedIds.includes(Number(recipeId));
  }, [bookmarkedIds]);

  return {
    bookmarkedIds,
    isLoading,
    fetchBookmarks,
    toggleBookmark,
    isBookmarked,
  };
};
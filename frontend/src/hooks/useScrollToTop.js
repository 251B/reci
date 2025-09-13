import { useState, useEffect } from "react";

/**
 * 스크롤 위치에 따라 상단 버튼 표시 여부를 관리하는 훅
 * @param {number} threshold - 버튼이 나타날 스크롤 위치 (기본값: 200)
 * @returns {[boolean, function]} [showButton, scrollToTop]
 */
export const useScrollToTop = (threshold = 200) => {
  const [showTopBtn, setShowTopBtn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTopBtn(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return [showTopBtn, scrollToTop];
};
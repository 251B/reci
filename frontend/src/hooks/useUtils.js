import { useState, useEffect } from "react";

/**
 * 로컬스토리지와 동기화되는 상태를 관리하는 훅
 * @param {string} key - 로컬스토리지 키
 * @param {any} defaultValue - 기본값
 * @returns {[any, function]} [value, setValue]
 */
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`로컬스토리지에서 ${key} 읽기 실패:`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`로컬스토리지에 ${key} 저장 실패:`, error);
    }
  }, [key, value]);

  return [value, setValue];
};

/**
 * 시간 포맷팅을 위한 유틸리티 훅
 * @returns {object} 시간 포맷팅 함수들
 */
export const useTimeUtils = () => {
  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    
  const getCurrentDateTime = () =>
    new Date().toLocaleString([], {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

  return { getCurrentTime, getCurrentDateTime };
};
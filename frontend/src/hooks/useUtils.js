import { useState, useEffect } from "react";

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
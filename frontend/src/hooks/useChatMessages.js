import { useState, useEffect, useRef } from "react";

export const useChatMessages = (getCurrentTime) => {
  const savedMessages = localStorage.getItem("chatMessages");
  const [messages, setMessages] = useState(
    savedMessages
      ? JSON.parse(savedMessages)
      : [
        {
          id: 1,
          sender: "bot",
          type: "text",
          content: "나만의 레시피를 검색해보세요!",
          time: getCurrentTime(),
        },
      ]
  );

  const hasPostedIntro = useRef(false);

  // 메시지 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // 메시지 추가
  const addMessage = (message) => {
    setMessages((prev) => [...prev, { id: prev.length + 1, ...message }]);
  };

  // 사용자 메시지 추가
  const addUserMessage = (content) => {
    addMessage({
      sender: "user",
      type: "text",
      content,
      time: getCurrentTime(),
    });
  };

  // 봇 메시지 추가
  const addBotMessage = (type, content) => {
    addMessage({
      sender: "bot",
      type,
      content,
      time: getCurrentTime(),
    });
  };

  // 여러 메시지 한번에 추가
  const addMessages = (messageList) => {
    setMessages((prev) => [
      ...prev,
      ...messageList.map((msg, index) => ({
        id: prev.length + index + 1,
        ...msg,
      })),
    ]);
  };

  // 메시지 초기화
  const clearMessages = () => {
    localStorage.removeItem("chatMessages");
    setMessages([
      {
        id: 1,
        sender: "bot",
        type: "text",
        content: "나만의 레시피를 검색해보세요!",
        time: getCurrentTime(),
      },
    ]);
    hasPostedIntro.current = false;
  };

  // 레시피 소개 메시지 추가
  const addRecipeIntroMessage = (recipeTitle) => {
    if (hasPostedIntro.current) return;

    const alreadyExists = messages.some(
      (m) =>
        m.type === "text" &&
        m.content.startsWith(`"${recipeTitle}" 레시피에 대해 더 알고 싶으신가요?`)
    );

    if (!alreadyExists) {
      hasPostedIntro.current = true;
      addMessage({
        sender: "bot",
        type: "text",
        content: `"${recipeTitle}" 레시피에 대해 더 알고 싶으신가요?`,
        time: getCurrentTime(),
      });
    }
  };

  return {
    messages,
    setMessages,
    addMessage,
    addUserMessage,
    addBotMessage,
    addMessages,
    clearMessages,
    addRecipeIntroMessage,
    hasPostedIntro,
  };
};
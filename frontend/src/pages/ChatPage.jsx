import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import ChatInput from "../components/chat/ChatInput";
import ChatMessage from "../components/chat/ChatMessage";
import ChatLoadingIndicator from "../components/chat/ChatLoadingIndicator";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";
import { useScrollToTop, useTimeUtils, useChatMessages, useRecipeFilters, useRecipeData } from "../hooks";
import api from "../utils/api";

export default function ChatPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const passedRecipe = location.state?.recipe;
  const { getCurrentTime, getCurrentDateTime } = useTimeUtils();
  const [showTopBtn, scrollToTop] = useScrollToTop(200);
  
  const {
    messages,
    addUserMessage,
    addBotMessage,
    addMessages,
    clearMessages: clearChatMessages,
    addRecipeIntroMessage,
  } = useChatMessages(getCurrentTime);

  const {
    seenRecipeIds,
    setSeenRecipeIds,
    lastFilterCondition,
    setLastFilterCondition,
    filterPage,
    setFilterPage,
    previousIngredients,
    setPreviousIngredients,
    resetFilters,
  } = useRecipeFilters();

  const { recipeData, clearRecipeData } = useRecipeData(
    passedRecipe,
    addRecipeIntroMessage,
    navigate,
    location
  );

  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [previousSource, setPreviousSource] = useState("");

  const displayTimestamp = getCurrentDateTime();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const initialMessage = location.state?.initialMessage;
  const hasSentInitial = useRef(false);

  useEffect(() => {
    if (initialMessage && !hasSentInitial.current) {
      setInputText(initialMessage);
      handleSend(initialMessage);

      navigate(location.pathname, { replace: true });
      hasSentInitial.current = true;
    }
  }, [initialMessage, navigate, location.pathname]);

  // 난이도/시간 필터 처리
  const handleDifficultyTimeFilter = async (userText) => {
    const levelMatch = userText.match(/(초급|중급|고급|아무나)/);
    const timeMatch = userText.match(/(\d+)\s*분\s*(이내|이상|넘는|초과|이하)?/);
    const hourMatch = userText.match(/(\d+)\s*시간\s*(이내|이상|넘는|초과|이하)?/);

    if (!levelMatch && !timeMatch && !hourMatch) return false;

    const difficulty = levelMatch?.[1];
    let maxTime = null;
    let direction = "";
    let cookTimeString = null;

    if (timeMatch) {
      maxTime = parseInt(timeMatch[1], 10);
      direction = timeMatch[2] || "";
    } else if (hourMatch) {
      const hour = hourMatch[1];
      direction = hourMatch[2] || "";

      if (hour === "2" && ["이상", "넘는", "초과"].some(w => direction.includes(w))) {
        cookTimeString = "2시간 이상";
      } else {
        maxTime = parseInt(hour, 10) * 60;
      }
    }

    let filterOperator = "<=";
    if (["이상", "넘는", "초과"].some(word => direction.includes(word))) {
      filterOperator = ">=";
    }

    setLastFilterCondition({
      difficulty,
      maxTime: cookTimeString ? null : `${filterOperator}${maxTime}`,
      cookTime: cookTimeString || null,
    });

    const res = await api.get("/filter/difficulty-time", {
      params: {
        ...(difficulty && { difficulty }),
        ...(cookTimeString
          ? { cook_time: cookTimeString }
          : maxTime !== null && { max_time: `${filterOperator}${maxTime}` }),
        page: 1,
        per_page: 5,
        exclude_ids: seenRecipeIds,
      },
    });

    const recipes = res.data.recipes || [];
    const botMessage = {
      sender: "bot",
      type: recipes.length > 0 ? "recommendation" : "text",
      content:
        recipes.length > 0
          ? { 
              recipes, 
              source: "difficulty-time",
              filterCondition: { difficulty, maxTime, cookTime: cookTimeString }
            }
          : `${difficulty || ""} ${cookTimeString
            ? `(조리 시간: ${cookTimeString})`
            : maxTime
              ? `(${filterOperator}${maxTime}분)`
              : ""
          } 요리를 찾지 못했어요.`,
      time: getCurrentTime(),
    };

    addBotMessage(botMessage.type, botMessage.content);
    return true;
  };

  // 다른 레시피 추천 처리
  const handleMoreRecipes = async (userText) => {
    if (!userText.includes("다른") || !lastFilterCondition) return false;

    const nextPage = filterPage + 1;
    const res = await api.get("/filter/difficulty-time", {
      params: {
        ...(lastFilterCondition.difficulty && {
          difficulty: lastFilterCondition.difficulty,
        }),
        ...(lastFilterCondition.cookTime
          ? { cook_time: lastFilterCondition.cookTime }
          : lastFilterCondition.maxTime && {
            max_time: lastFilterCondition.maxTime,
          }),
        page: nextPage,
        per_page: 5,
        exclude_ids: seenRecipeIds,
      },
    });

    const recipes = res.data.recipes || [];
    setFilterPage(nextPage);

    const botMessage = {
      sender: "bot",
      type: recipes.length > 0 ? "recommendation" : "text",
      content:
        recipes.length > 0 ? { 
          recipes, 
          source: "difficulty-time",
          filterCondition: {
            difficulty: lastFilterCondition.difficulty,
            maxTime: lastFilterCondition.maxTime,
            cookTime: lastFilterCondition.cookTime
          }
        } : "더 이상 추천할 레시피가 없어요!",
      time: getCurrentTime(),
    };

    if (recipes.length > 0) {
      setPreviousSource("difficulty-time");
    }

    addBotMessage(botMessage.type, botMessage.content);
    return true;
  };

  // 인분 변환 처리
  const handleServingConversion = async (userText) => {
    const servingMatch = userText.match(/(\d+)\s*(인분|명|인|배)/);
    if (!servingMatch || !recipeData) return false;

    const targetServing = `${servingMatch[1]}인분`;
    const res = await api.post("/gpt/servings", {
      title: recipeData.title,
      ingredients: recipeData.ingredients,
      steps: recipeData.steps,
      current_serving: recipeData.serving,
      target_serving: targetServing,
    });

    const converted = res.data.result;
    const notifyMessage = {
      sender: "bot",
      type: "text",
      content: `${targetServing} 기준으로 레시피를 변경했어요!`,
      time: getCurrentTime(),
    };
    const cardMessage = {
      sender: "bot",
      type: "servingsCard",
      content: {
        id: recipeData.id,
        title: converted.title,
        serving: converted.serving,
        ingredients: converted.ingredients,
        steps: converted.steps,
      },
      time: getCurrentTime(),
    };
    addMessages([notifyMessage, cardMessage]);
    return true;
  };

  // 대체재료 추천 처리
  const handleSubstituteRecommendation = async (userText) => {
    const substituteKeywords = /(빼고|대신|없어|대체|바꿔)/;
    if (!substituteKeywords.test(userText) || !recipeData) return false;

    const ingredientNames = recipeData.ingredients.map((i) => i.split(":")[0].trim());
    const substituteTargets = ingredientNames.filter((name) => userText.includes(name));

    if (substituteTargets.length === 0) return false;

    const res = await api.post("/gpt/substitute", {
      ingredients: recipeData.ingredients,
      steps: recipeData.steps,
      substitutes: substituteTargets,
      serving: recipeData.serving,
    });

    const result = res.data.result;
    const substituteCard = {
      sender: "bot",
      type: "servingsCard",
      content: {
        id: recipeData.id,
        title: recipeData.title,
        serving: recipeData.serving,
        ingredients: result.ingredients,
        steps: result.steps,
        adjustedType: "substitute",
        substitutedKeys: substituteTargets,
      },
      time: getCurrentTime(),
    };
    addBotMessage(substituteCard.type, substituteCard.content);
    return true;
  };

  // 일반 레시피 추천 처리
  const handleRecipeRecommendation = async (userText) => {
    const res = await api.post("/gpt/recommend", {
      message: userText,
      previous_ingredients: previousIngredients,
      seen_recipe_ids: seenRecipeIds,
    });

    const recipeList = res.data.recipes;
    setPreviousIngredients(res.data.ingredients || []);
    localStorage.setItem("previousIngredients", JSON.stringify(res.data.ingredients || []));
    setSeenRecipeIds(res.data.seen_recipe_ids || []);

    setLastFilterCondition(null);
    setFilterPage(1);

    const isIngredientSearch = res.data.ingredients?.length > 0;
    const currentSource = isIngredientSearch ? "ingredient" : previousSource || "difficulty-time";

    const botMessage = {
      sender: "bot",
      type: recipeList.length > 0 ? "recommendation" : "text",
      content: recipeList.length > 0 ? {
        recipes: recipeList,
        source: currentSource,
      } : "추천 결과가 없어요.",
      time: getCurrentTime(),
    };

    if (recipeList.length > 0) {
      setPreviousSource(currentSource);
    }

    addBotMessage(botMessage.type, botMessage.content);
  };

  const handleSend = async (text) => {
    const userText = (text ?? inputText).trim();
    if (!userText || isLoading) return;
    
    addUserMessage(userText);
    setInputText("");
    setIsLoading(true);

    try {
      // 1. 난이도/시간 기반 필터 처리
      if (await handleDifficultyTimeFilter(userText)) return;
      
      // 2. 다른 레시피 추천 처리
      if (await handleMoreRecipes(userText)) return;

      // 3. 인분 변환 처리
      if (await handleServingConversion(userText)) return;

      // 4. 대체재료 추천 처리
      if (await handleSubstituteRecommendation(userText)) return;

      // 5. 일반 레시피 추천 처리
      await handleRecipeRecommendation(userText);

    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      addBotMessage("text", `오류 발생: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    clearRecipeData();
    resetFilters();
    clearChatMessages();
    setPreviousSource("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] items-center">
      <div className="w-full max-w-md flex flex-col flex-1">
        <Header title="나만의 레시피 검색" showBack onBack={() => navigate(-1)} />
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <div className="text-center text-xs text-gray-400 my-2">
            {displayTimestamp}
          </div>
          {messages.map((msg) => (
            <ChatMessage 
              key={msg.id} 
              message={msg}
            />
          ))}
          
          {/* 로딩 인디케이터 */}
          {isLoading && <ChatLoadingIndicator />}
          
          <div ref={chatEndRef} />
        </div>
        <button
          onClick={clearMessages}
          className="text-xs text-gray-500 underline mt-2 mb-2 self-center"
        >
          대화 초기화
        </button>
        
        <ChatInput
          inputText={inputText}
          setInputText={setInputText}
          onSend={handleSend}
          isLoading={isLoading}
          placeholder={isLoading ? "답변을 기다리는 중..." : "메시지를 입력하세요"}
        />
      </div>
      <ScrollToTopButton show={showTopBtn} onClick={scrollToTop} />
    </div>
  );
}


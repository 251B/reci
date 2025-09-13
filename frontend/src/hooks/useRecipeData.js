import { useState, useEffect, useCallback } from "react";

export const useRecipeData = (passedRecipe, addRecipeIntroMessage, navigate, location) => {
  const [recipeData, setRecipeData] = useState(null);

  const handleRecipeIntro = useCallback((recipe) => {
    if (recipe) {
      setRecipeData(recipe);
      addRecipeIntroMessage(recipe.title);
      setTimeout(() => {
        navigate(location.pathname, { replace: true });
      }, 0);
    }
  }, [addRecipeIntroMessage, navigate, location.pathname]);

  useEffect(() => {
    const storedRecipe = localStorage.getItem("recipeForChat");
    const currentRecipe = passedRecipe || (storedRecipe && JSON.parse(storedRecipe));
    
    if (passedRecipe) {
      localStorage.setItem("recipeForChat", JSON.stringify(passedRecipe));
      handleRecipeIntro(passedRecipe);
    } else if (currentRecipe && !recipeData) {
      handleRecipeIntro(currentRecipe);
    }
  }, [passedRecipe, handleRecipeIntro, recipeData]);

  const clearRecipeData = () => {
    localStorage.removeItem("recipeForChat");
    setRecipeData(null);
  };

  return {
    recipeData,
    clearRecipeData,
  };
};
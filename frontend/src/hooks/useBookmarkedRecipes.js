import { useState, useEffect } from "react";
import api from "../utils/api";

export function useBookmarkedRecipes(bookmarkedIds) {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookmarkedRecipes = async () => {
    if (bookmarkedIds.length === 0) {
      setRecipes([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const recipePromises = bookmarkedIds.map((id) =>
        api.get(`/recipe/${id}`).then((r) => r.data)
      );
      
      const recipeResults = await Promise.all(recipePromises);
      setRecipes(recipeResults);
    } catch (err) {
      console.error("찜한 레시피 불러오기 실패:", err);
      setError("레시피를 불러오는데 실패했습니다.");
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const removeRecipe = (recipeId) => {
    setRecipes(prevRecipes => 
      prevRecipes.filter(recipe => recipe.id !== recipeId)
    );
  };

  useEffect(() => {
    fetchBookmarkedRecipes();
  }, [bookmarkedIds]);

  return {
    recipes,
    isLoading,
    error,
    removeRecipe,
    refetch: fetchBookmarkedRecipes
  };
}
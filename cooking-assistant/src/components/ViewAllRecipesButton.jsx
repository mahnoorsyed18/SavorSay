import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setQuery, addInitialItems } from "../store/recipesSlice";
import { useNavigate } from "react-router-dom";
import styles from "../css/ViewAllRecipesButton.module.css";

const ViewAllRecipesButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const query = useSelector((state) => state.recipes.query); // 👈 Get the current search/filter

  const fetchAllRecipes = async () => {
    try {
      const res = await fetch("http://localhost:8080/recipes");
      const data = await res.json();
      dispatch(addInitialItems(data.recipes));
      dispatch(setQuery(""));
      navigate("/recipes?q=all");
    } catch (error) {
      console.error("Error fetching all recipes:", error);
    }
  };

  // ✅ Don't render if already showing all recipes (query is empty or 'all')
  if (!query || query.toLowerCase() === "all") {
    return null;
  }

  return (
    <div className={styles.viewAllWrapper}>
      <button className={styles.viewAllBtn} onClick={fetchAllRecipes}>
        🍽️ View All Recipes
      </button>
    </div>
  );
};

export default ViewAllRecipesButton;

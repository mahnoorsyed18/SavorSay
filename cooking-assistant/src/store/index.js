import { configureStore } from "@reduxjs/toolkit";
import recipesSlice from "./recipesSlice";
import fetchRecStatusSlice from "./fetchRecStatusSlice";
import favoritesSlice from "./favoritesSlice";
import timerSlice from "./timerSlice"; // ✅ Add this line
import fetchPopStatusSlice from "./fetchPopStatusSlice";
import popularSlice from "./popularSlice";

const recipesStore = configureStore({
  reducer: {
    recipes: recipesSlice.reducer,
    fetchRecipeStatus: fetchRecStatusSlice.reducer,
    favorites: favoritesSlice.reducer,
    timer: timerSlice.reducer, // ✅ Add this line
    fetchPopularStatus: fetchPopStatusSlice.reducer,
    popular: popularSlice.reducer,
  },
});

export default recipesStore;

import { createSlice } from "@reduxjs/toolkit";

// Load from localStorage if available
const storedFavorites = localStorage.getItem("favorites");
const initialState = storedFavorites ? JSON.parse(storedFavorites) : [];

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorite: (state, action) => {
      const updatedState = [...state, action.payload];
      localStorage.setItem("favorites", JSON.stringify(updatedState));
      return updatedState;
    },
    removeFromFavorite: (state, action) => {
      const updatedState = state.filter((id) => id !== action.payload);
      localStorage.setItem("favorites", JSON.stringify(updatedState));
      return updatedState;
    },
    toggleFavorite: (state, action) => {
      const id = action.payload;
      const exists = state.includes(id);
      const updatedState = exists
        ? state.filter((favId) => favId !== id)
        : [...state, id];
      localStorage.setItem("favorites", JSON.stringify(updatedState));
      return updatedState;
    },
    clearFavorite: () => {
      localStorage.setItem("favorites", JSON.stringify([]));
      return [];
    },
  },
});

export const favoritesActions = favoritesSlice.actions;
export default favoritesSlice;

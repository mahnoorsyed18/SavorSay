import { createSlice } from "@reduxjs/toolkit";

// ✅ Load from localStorage (if available)
const savedPopular = localStorage.getItem("popularRecipes");
const initialState = savedPopular ? JSON.parse(savedPopular) : [];

const popularSlice = createSlice({
  name: "popular",
  initialState,
  reducers: {
    addInitialItems: (state, action) => {
      // ✅ Save to localStorage on update
      localStorage.setItem("popularRecipes", JSON.stringify(action.payload));
      return action.payload;
    },
  },
});

export const popularActions = popularSlice.actions;
export default popularSlice;

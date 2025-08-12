import { createSlice } from "@reduxjs/toolkit";

// ✅ FIXED: Don't load from localStorage here to avoid conflicts
const initialState = {
  activeTimer: null,
};

const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {
    setActiveTimer(state, action) {
      // ✅ FIXED: Set the complete new state, don't merge
      state.activeTimer = action.payload;
      // ✅ FIXED: Only update localStorage if we have valid data
      if (action.payload) {
        localStorage.setItem(
          "recipeTimerState",
          JSON.stringify(action.payload)
        );
      }
    },
    updateActiveTimer(state, action) {
      if (state.activeTimer) {
        state.activeTimer = {
          ...state.activeTimer,
          ...action.payload,
        };
        localStorage.setItem(
          "recipeTimerState",
          JSON.stringify(state.activeTimer)
        );
      }
    },
    clearActiveTimer(state) {
      state.activeTimer = null;
      localStorage.removeItem("recipeTimerState");
    },
  },
});

export const timerActions = timerSlice.actions;
export default timerSlice;

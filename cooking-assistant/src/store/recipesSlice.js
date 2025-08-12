import { createSlice } from "@reduxjs/toolkit";

const storedItems = JSON.parse(localStorage.getItem("lastSearchItems")) || [];
const storedQuery = localStorage.getItem("lastSearchQuery") || "";

const recipesSlice = createSlice({
  name: "recipes",
  initialState: {
    items: storedItems,
    query: storedQuery,
  },
  reducers: {
    addInitialItems(state, action) {
      state.items = action.payload;
      localStorage.setItem("lastSearchItems", JSON.stringify(action.payload));
    },
    setQuery(state, action) {
      state.query = action.payload;
      localStorage.setItem("lastSearchQuery", action.payload);
    },
  },
});

export const { addInitialItems, setQuery } = recipesSlice.actions;
export default recipesSlice;
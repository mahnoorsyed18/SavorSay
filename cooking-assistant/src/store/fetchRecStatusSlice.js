import { createSlice } from "@reduxjs/toolkit";

const fetchRecStatusSlice = createSlice({
  name: "fetchRecipeStatus",
  initialState: {
    fetchDone: false, // false: PENDING, and true: DONE
    currentlyFetching: false,
  },
  reducers: {
    markFetchDone: (state) => {
      state.fetchDone = true;
    },
    markFetchingStarted: (state) => {
      state.currentlyFetching = true;
    },
    markFetchingFinished: (state) => {
      state.currentlyFetching = false;
    },
  },
});

export const fetchRecStatusActions = fetchRecStatusSlice.actions;
export default fetchRecStatusSlice;

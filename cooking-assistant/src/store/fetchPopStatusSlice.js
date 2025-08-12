import { createSlice } from "@reduxjs/toolkit";

const fetchPopStatusSlice = createSlice({
  name: "fetchPopularStatus",
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

export const fetchPopStatusActions = fetchPopStatusSlice.actions;
export default fetchPopStatusSlice;

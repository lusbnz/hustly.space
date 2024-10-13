import { createSlice } from "@reduxjs/toolkit";

const suggestionSlice = createSlice({
  name: "suggestion",
  initialState: {
    results: [],
    filterData: {},
  },
  reducers: {
    setSuggestion: (state, action) => {
      state.results = action.payload;
    },
    setFilterData: (state, action) => {
      state.filterData = action.payload;
    },
  },
 
});

export const { setSuggestion, setFilterData } = suggestionSlice.actions;
export default suggestionSlice.reducer;

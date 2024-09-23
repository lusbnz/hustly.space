import { createSlice } from "@reduxjs/toolkit";

const suggestionSlice = createSlice({
  name: "suggestion",
  initialState: [],
  reducers: {
    setSuggestion: (state, action) => action.payload,
  },
});

export const { setSuggestion } = suggestionSlice.actions;
export default suggestionSlice.reducer;

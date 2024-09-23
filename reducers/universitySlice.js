import { createSlice } from "@reduxjs/toolkit";

const universitySlice = createSlice({
  name: "domain",
  initialState: [],
  reducers: {
    setUniversity: (state, action) => action.payload,
  },
});

export const { setUniversity } = universitySlice.actions;
export default universitySlice.reducer;

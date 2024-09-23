import { createSlice } from "@reduxjs/toolkit";

const domainSlice = createSlice({
  name: "domain",
  initialState: [],
  reducers: {
    setDomain: (state, action) => action.payload,
  },
});

export const { setDomain } = domainSlice.actions;
export default domainSlice.reducer;

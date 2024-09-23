import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: null,
  reducers: {
    setRecipientInfo: (state, action) => action.payload,
  },
});

export const { setRecipientInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;

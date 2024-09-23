import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: null,
  reducers: {
    setUserInfo: (state, action) => action.payload,
  },
});

export const { setUserInfo } = userInfoSlice.actions;
export default userInfoSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const userInfoSlice = createSlice({
  name: "userInfo",
  initialState: {
    userInfo: null,
    receiveInfo: null,
    isLoadingR: false,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setReceiveInfo: (state, action) => {
      state.receiveInfo = action.payload;
    },
    setIsLoadingR: (state, action) => {
      state.isLoadingR = action.payload;
    }
  },
});

export const { setUserInfo, setReceiveInfo, setIsLoadingR } = userInfoSlice.actions;
export default userInfoSlice.reducer;

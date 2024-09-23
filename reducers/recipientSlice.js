import { createSlice } from "@reduxjs/toolkit";

const recipientInfoSlice = createSlice({
  name: "recipientInfo",
  initialState: null,
  reducers: {
    setRecipientInfo: (state, action) => action.payload,
  },
});

export const { setRecipientInfo } = recipientInfoSlice.actions;
export default recipientInfoSlice.reducer;

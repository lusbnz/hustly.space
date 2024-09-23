import { createSlice } from "@reduxjs/toolkit";

const competitionSlice = createSlice({
  name: "competition",
  initialState: [],
  reducers: {
    setCompetition: (state, action) => action.payload,
  },
});

export const { setcompetition } = competitionSlice.actions;
export default competitionSlice.reducer;

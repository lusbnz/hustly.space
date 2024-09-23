import competitionSlice from "@/reducers/competitionSlice";
import domainSlice from "@/reducers/domainSlice";
import recipientSlice from "@/reducers/recipientSlice";
import suggestionSlice from "@/reducers/suggestionSlice";
import universitySlice from "@/reducers/universitySlice";
import userInfoSlice from "@/reducers/userInfoSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    userInfo: userInfoSlice,
    domain: domainSlice,
    university: universitySlice,
    competition: competitionSlice,
    suggestion: suggestionSlice,
    recipient: recipientSlice,
  },
});

export default store;

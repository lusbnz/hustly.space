import { API } from "@/libs/clients";

export const sendMessage = async (profileId, threadId, data) => {
  const res = await API.post(
    `/profile/${profileId}/thread/${threadId}/message`,
    data
  );
  return res.data;
};

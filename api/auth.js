import { API, getAuthToken } from "@/libs/clients";

export const authLogin = async (data) => {
  const res = await API.post(`/signin`, data);
  return res.data;
};

export const authRegister = async (data) => {
  const res = await API.post(`/signup`, data);
  return res.data;
};

export const forgetPassword = async (data) => {
  const res = await API.post(`/authentication/forget_password`, data);
  return res.data;
};

export const resetPassword = async (data) => {
  const res = await API.post(`/profile/change_password`, data);
  return res.data;
};

export const verifyEmail = async (data) => {
  const res = await API.post(`/authentication/verify_email`, data);
  return res.data;
};

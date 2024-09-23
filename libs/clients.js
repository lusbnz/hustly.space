"use client";

import axios from "axios";
import { redirect } from "next/navigation";

function getAuthToken() {
  return window.localStorage.getItem("accessToken") ?? "";
}

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "api/",
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const isAuthRequest =
    config.url.includes("signin") || config.url.includes("signup");

  if (!isAuthRequest) {
    config.headers = {
      ...(config.headers ?? {}),
      Authorization: `token ${getAuthToken()}`,
    };
  }

  return { ...config };
});

API.interceptors.response.use(response => response, async error => {
  const { config, response: { status } } = error

  const token = getAuthToken()
  if (status === 401 && !!token) {
    redirect("/auth-login")
  }
  if (status === 400) {
    return error.response;
  }
  return Promise.reject(error);
}
);

export { API };

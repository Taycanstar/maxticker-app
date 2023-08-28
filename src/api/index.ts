import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { store } from "../store"; // Import your Redux store
import { refreshTokenAction } from "../store/user"; // Import your refreshTokenAction

const LOCAL = "http://localhost:8000";

const api = axios.create({
  baseURL: `${LOCAL}`,
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.response.data.message === "jwt expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Mark this request as retried
      await store.dispatch(refreshTokenAction());
      const newToken = await AsyncStorage.getItem("token");
      originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
      return api(originalRequest);
    }
    return Promise.reject(error);
  }
);

export default api;

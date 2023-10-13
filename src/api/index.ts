// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const LOCAL = "http://localhost:8000";

// const api = axios.create({
//   baseURL: `${LOCAL}`,
// });

// api.interceptors.request.use(async (config) => {
//   const token = await AsyncStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default api;
// api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOCAL = "https://git.heroku.com/maxticker.git";
const api = axios.create({ baseURL: `${LOCAL}` });

type TokenExpiredCallback = () => void;
let onTokenExpiredCallback: TokenExpiredCallback | undefined;

api.interceptors.request.use(async (config: AxiosRequestConfig) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config as any;
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response.status === 401 &&
      error.response.data.message === "jwt expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      if (onTokenExpiredCallback) {
        onTokenExpiredCallback();
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export const setOnTokenExpiredCallback = (callback: TokenExpiredCallback) => {
  onTokenExpiredCallback = callback;
};

export default api;

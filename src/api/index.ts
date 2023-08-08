import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default api;

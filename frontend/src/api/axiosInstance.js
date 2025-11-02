import axios from "axios";
import { getApiBaseUrl } from "../utils/apiConfig";

const axiosInstance = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;
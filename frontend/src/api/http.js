import axios from "axios";

const axiosHttp = axios.create({
  baseURL: process.env.REACT_APP_API_BASIC_HOST,
  timeout: 1000 * 5,
});

const access_token = localStorage.getItem("access_token");

axiosHttp.interceptors.request.use((config) => {
  access_token && (config.headers.Authorization = access_token);
  return config;
});

axiosHttp.interceptors.response.use(
  (response) => {
    return [response.status, response.data];
  },
  (error) => {
    return [error.response.status, error.response.data];
  }
);

export default axiosHttp;

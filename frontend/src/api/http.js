import axios from "axios";
import { Paths } from "src/routers/paths";
import { ApiEndpoint } from "src/api/api-endpoint";
axios.defaults.timeout = 5 * 1000;
axios.defaults.baseURL = process.env.REACT_APP_API_BASIC_HOST;

axios.interceptors.request.use(
  (config) => {
    config.data = JSON.stringify(config.data);
    const access_token = localStorage.getItem("access_token", undefined);
    config.headers = {
      "Content-Type": "application/json",
      Authentication: access_token === undefined ? null : access_token,
    };
    return config;
  },
  (error) => {
    return error;
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return error;
  }
);

export function get(url) {
  return new Promise((resolve, reject) => {
    axios
      .get(url)
      .then((response) => {
        resolve([response.status, response.data]);
      })
      .catch((error) => {
        reject([error.response.status, error.response.data]);
      });
  });
}

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      (response) => {
        console.log(response.data)
        if (url === ApiEndpoint.token) {
          localStorage.setItem("access_token", response.data.access_token);
        }
        resolve([response.status, response.data]);
      },
      (error) => {
        reject([error.response.status, error.response.data]);
      }
    );
  });
}

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      (response) => {
        resolve([response.status, response.data]);
      },
      (error) => {
        reject([error.response.status, error.response.data]);
      }
    );
  });
}


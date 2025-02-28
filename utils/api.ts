// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Define the list of endpoints for which a success toast should appear
// const successToastEndpoints: string[] = [];

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error); // No toast for request errors
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Skip toasts for GET requests
//     if (response.config.method !== "get") {
//       // Show success toast only if the endpoint is in the list
//       if (
//         successToastEndpoints.some((endpoint) =>
//           response.config.url.includes(endpoint)
//         )
//       ) {
//         const successMessage = response.data?.message || "Request successful!";
//         toast.success(successMessage);
//       }
//     }
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       const { status, data, config } = error.response;

//       // // Skip error toasts for GET requests
//       // if (config.method === "get") {
//       //   return Promise.reject(error);
//       // }

//       // Handle 401 errors
//       if (status === 401) {
//         if (config.url.includes("auth/login")) {
//           // For `/auth/login`, show a toast and skip redirection
//           toast.error(data.message || "Invalid login credentials.");
//         } else {
//           // For all other 401 responses, clear token and redirect
//           toast.error("Session expired. Redirecting to login...");
//           localStorage.removeItem("authToken");
//           window.location.href = "/"; // Redirect to "/"
//         }
//       } else {
//         // Handle other errors and show error toasts
//         if (Array.isArray(data.message)) {
//           data.message.forEach((msg: string) => {
//             toast.error(msg);
//           });
//         } else {
//           toast.error(data.message || "An unexpected error occurred.");
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

// import axios from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Define the list of endpoints for which a success toast should appear
// const successToastEndpoints: string[] = [];

// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("authToken");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error); // No toast for request errors
//   }
// );

// axiosInstance.interceptors.response.use(
//   (response) => {
//     // Skip toasts for GET requests
//     if (response.config.method !== "get") {
//       // Show success toast only if the endpoint is in the list
//       if (
//         successToastEndpoints.some((endpoint) =>
//           response.config.url.includes(endpoint)
//         )
//       ) {
//         const successMessage = response.data?.message || "Request successful!";
//         toast.success(successMessage);
//       }
//     }
//     return response;
//   },
//   (error) => {
//     if (error.response) {
//       const { status, data, config } = error.response;

//       // Handle 401 errors
//       if (status === 401) {
//         if (config.url.includes("auth/login")) {
//           // For `/auth/login`, show a toast and skip redirection
//           toast.error(data.message || "Invalid login credentials.");
//         } else {
//           // For all other 401 responses, clear token and redirect
//           toast.error("Session expired. Redirecting to login...");
//           localStorage.removeItem("authToken");
//           window.location.href = "/"; // Redirect to "/"
//         }
//       } else {
//         // Handle other errors
//         if (config.method !== "get") {
//           // Only show error toast if method is not GET
//           if (Array.isArray(data.message)) {
//             data.message.forEach((msg: string) => {
//               toast.error(msg);
//             });
//           } else {
//             toast.error(data.message || "An unexpected error occurred.");
//           }
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

// import axios, { AxiosInstance } from "axios";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// // Define the list of endpoints for which a success toast should appear
// const successToastEndpoints: string[] = [];

// const createAxiosInstance = (): AxiosInstance => {
//   const axiosInstance = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_URL,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   axiosInstance.interceptors.request.use(
//     (config) => {
//       const token = localStorage.getItem("authToken");

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error); // No toast for request errors
//     }
//   );

//   axiosInstance.interceptors.response.use(
//     (response) => {
//       // Skip toasts for GET requests
//       if (response.config.method !== "get") {
//         // Show success toast only if the endpoint is in the list
//         if (
//           successToastEndpoints.some((endpoint) =>
//             response.config.url.includes(endpoint)
//           )
//         ) {
//           const successMessage =
//             response.data?.message || "Request successful!";
//           toast.success(successMessage);
//         }
//       }
//       return response;
//     },
//     (error) => {
//       if (error.response) {
//         const { status, data, config } = error.response;

//         // Handle 401 errors
//         if (status === 401) {
//           if (config.url.includes("auth/login")) {
//             // For `/auth/login`, show a toast and skip redirection
//             toast.error(data.message || "Invalid login credentials.");
//           } else {
//             // For all other 401 responses, clear token and redirect
//             toast.error("Session expired. Redirecting to login...");
//             localStorage.removeItem("authToken");
//             window.location.href = "/"; // Redirect to "/"
//           }
//         } else {
//           // Handle other errors
//           if (config.method !== "get") {
//             // Only show error toast if method is not GET
//             if (Array.isArray(data.message)) {
//               data.message.forEach((msg: string) => {
//                 toast.error(msg);
//               });
//             } else {
//               toast.error(data.message || "An unexpected error occurred.");
//             }
//           }
//         }
//       }
//       return Promise.reject(error);
//     }
//   );

//   return axiosInstance;
// };

// export default createAxiosInstance;

import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define the list of endpoints for which a success toast should appear
const successToastEndpoints: string[] = [
  "app-settings/auto-debit",
  "/app-settings/auto-apportion",
  "/users/2fa/enable",
];

// --- Refresh token helpers ---
let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

const createAxiosInstance = (): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("authToken");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error); // No toast for request errors
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      // Skip toasts for GET requests
      if (response.config.method !== "get") {
        // Show success toast only if the endpoint is in the list
        if (
          successToastEndpoints.some((endpoint) =>
            response.config.url.includes(endpoint)
          )
        ) {
          const successMessage =
            response.data?.message || "Request successful!";
          toast.success(successMessage);
        }
      }
      return response;
    },
    (error) => {
      const originalRequest = error.config;
      if (error.response) {
        const { status, data, config } = error.response;

        // Handle 401 errors
        if (status === 401) {
          // Do not attempt refresh for login or refresh endpoints
          if (
            config.url.includes("auth/login") ||
            config.url.includes("auth/refresh-token")
          ) {
            toast.error(data.message || "Invalid login credentials.");
            return Promise.reject(error);
          }

          if (!originalRequest._retry) {
            originalRequest._retry = true;

            if (isRefreshing) {
              return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
              })
                .then((token) => {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                  return axiosInstance(originalRequest);
                })
                .catch((err) => Promise.reject(err));
            }

            isRefreshing = true;
            return new Promise((resolve, reject) => {
              // Retrieve the refresh token from localStorage
              const refreshToken = localStorage.getItem("refreshToken");
              axios
                .post("https://updc-dev.zijela.com/api/v1/auth/refresh-token", {
                  refreshToken,
                })
                .then(({ data }) => {
                  localStorage.setItem("authToken", data.data.access_token);
                  axiosInstance.defaults.headers.common[
                    "Authorization"
                  ] = `Bearer ${data.data.access_token}`;
                  originalRequest.headers.Authorization = `Bearer ${data.data.access_token}`;
                  processQueue(null, data.data.access_token);
                  resolve(axiosInstance(originalRequest));
                })
                .catch((err) => {
                  processQueue(err, null);
                  toast.error("Session expired. Redirecting to login...");
                  localStorage.removeItem("authToken");
                  localStorage.removeItem("refreshToken");
                  window.location.href = "/";
                  reject(err);
                })
                .finally(() => {
                  isRefreshing = false;
                });
            });
          } else {
            toast.error("Session expired. Redirecting to login...");
            localStorage.removeItem("authToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/";
          }
        } else {
          // Handle other errors
          if (config.method !== "get") {
            if (Array.isArray(data.message)) {
              data.message.forEach((msg: string) => {
                toast.error(msg);
              });
            } else {
              toast.error(data.message || "An unexpected error occurred.");
            }
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default createAxiosInstance;

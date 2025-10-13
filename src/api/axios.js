import axios from "axios";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true,
});


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        const refreshTokenExists = document.cookie.includes("refreshToken");

        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.endsWith("/user/login") &&
            !originalRequest.url.endsWith("/user/register") &&
            refreshTokenExists 
        ) {
            originalRequest._retry = true;

            try {
                await axios.post(`${import.meta.env.VITE_API_URL}/user/refresh`, {}, { withCredentials: true });
                return api(originalRequest); 
            } catch (err) {
                console.error("Refresh failed:", err);
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);



export default api;

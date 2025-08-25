import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:7000/api",
    withCredentials: true,
});

// Add interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await api.get("/user/refresh");

                return api(originalRequest);
            } catch (err) {
                console.error("Refresh token failed:", err);

                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;

import axios from "axios";
import { toast } from "react-toastify";


const VITE_API_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
    baseURL: VITE_API_URL,
    withCredentials: true,
});

const refreshAccessToken = async () => {
    try {
        await api.post("/user/refresh");
        return true;
    } catch {
        toast.error("Session expired. Please log in again.");
        return false;
    }
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshed = await refreshAccessToken();

            if (refreshed) {

                return api(originalRequest);
            } else {

                toast.warn("Session expired. Please log in again.");
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);


export default api;

import axios from "axios";

export const API_URL = "http://localhost:8800/api"
// export const API_URL = "https://storysurf-api.onrender.com/api"

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

$api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem("accessToken")}`
    return config;
})


$api.interceptors.response.use(

   
    (config) => config ,
    
    async (error) => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.get(`${API_URL}/auth/refresh`, { withCredentials: true })
            localStorage.setItem("accessToken", response.data.accessToken);
            return $api.request(originalRequest);
        } catch (error) {
            console.log("Пользователь не авторизован");
        }
    }
    throw error;
})

export default $api;
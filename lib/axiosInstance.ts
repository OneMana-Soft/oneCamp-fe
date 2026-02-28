import axios from 'axios'
import store from "@/store/store"
import {updateRefreshTokenStatus} from "@/store/slice/refreshSlice";
import {checkAuthCookieExists, checkRefreshCookieExists} from "@/lib/utils/helpers/getCookie";
import {loadingBus} from "@/lib/utils/loadingBus";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
});

axiosInstance.interceptors.request.use(async req => {
    loadingBus.start();
    const authExists = checkAuthCookieExists()
    const refreshTokenExist = checkRefreshCookieExists()

    const controller = new AbortController();
    req.signal = controller.signal

    if(authExists){
        return req
    }

    if(!refreshTokenExist){
        controller.abort('FE: Not Authorised');
        window.location.href = '/';
        return req
    }

    try {
        await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}refreshToken`, {
            withCredentials: true
        });
    } catch(err) {

        if (axios.isAxiosError(err)) {

            if(err.response?.status === 401) {
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}logout`, {}, {
                    withCredentials: true
                })
                controller.abort('FE: Not Authorised');
                window.location.href = '/';
            }
        }
    }

    store.dispatch(updateRefreshTokenStatus({exist: true}))

    return req
})


import { toast } from "@/hooks/use-toast";

axiosInstance.interceptors.response.use(
    (response) => {
        loadingBus.end();
        return response;
    },
    async (error) => {
        loadingBus.end();
        const originalRequest = error.config;

        // Standardized Error Toasting (excluding 401 refresh attempts)
        if (error.response && error.response.status !== 401) {
            toast({
                variant: "destructive",
                title: "In-App Error",
                description: error.response.data?.msg || error.message || "An unexpected error occurred",
            });
        }

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            try {
                await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}refreshToken`, {
                    withCredentials: true
                });
                store.dispatch(updateRefreshTokenStatus({exist: true}))
                originalRequest._retry = true;
                return axios(originalRequest)
            }
            catch(err) {
                if (axios.isAxiosError(err)) {
                    if(err.response?.status === 401) {
                        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}logout`, {}, {
                            withCredentials: true
                        });
                    }
                    localStorage.clear();
                    sessionStorage.clear();
                    window.location.href = '/';
                }
            }
        }
        return Promise.reject(error)
    },
)

export default axiosInstance
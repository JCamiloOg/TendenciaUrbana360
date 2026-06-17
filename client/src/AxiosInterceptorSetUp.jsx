import { useEffect } from "react";
import { useToken } from "./hooks/useToken";
import { axiosInstance } from "./config";


export default function AxiosInterceptorSetUp() {
    const { setUser, accessToken } = useToken();

    useEffect(() => {
        const requestInterceptor = axiosInstance.interceptors.request.use(
            (config) => {
                console.log('Token:', accessToken);
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            }
        );

        const responseInterceptor = axiosInstance.interceptors.response.use(
            (response) => {
                setUser(response.data.user);
                return response;
            }
        );

        return () => {
            axiosInstance.interceptors.request.eject(requestInterceptor);
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [accessToken, setUser])

    return null;
}

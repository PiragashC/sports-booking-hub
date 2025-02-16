import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";

interface ApiRequestOptions<T = any> {
    method: "get" | "post" | "put" | "delete" | "patch";
    url: string;
    data?: T;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    contentType?: string;
    token?: string;
}

const apiRequest = async <T = any>({
    method,
    url,
    data,
    params,
    headers = {},
    contentType,
    token,
}: ApiRequestOptions<T>): Promise<any> => {
    try {
        const baseUrl = process.env.REACT_APP_BASEURL || "";
        if (!baseUrl) {
            throw new Error("Base URL is not defined in environment variables.");
        }

        const config: AxiosRequestConfig = {
            method,
            url: `${baseUrl}${url}`,
            data,
            params,
            headers: {
                "Content-Type": contentType || "application/json",
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...headers,
            },
        };

        const response: AxiosResponse = await axios(config);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error("API Request Error:", axiosError.response?.data || axiosError.message);
        // throw axiosError.response?.data || new Error("API request failed.");
        return { error: axiosError.response?.data || axiosError.message || "API request failed." };
    }
};

export default apiRequest;

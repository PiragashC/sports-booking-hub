import { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
import api from "./axiosInstance";

interface ApiRequestOptions<T = any> {
    method: "get" | "post" | "put" | "delete" | "patch";
    url: string;
    data?: T;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    contentType?: string;
    token?: string | null;
    isFormData?: boolean;
    onUploadProgress?: (progressEvent: ProgressEvent) => void;
}

const apiRequest = async <T = any>({
    method,
    url,
    data,
    params,
    headers = {},
    contentType,
    token,
    isFormData = false,
    onUploadProgress
}: ApiRequestOptions<T>): Promise<any> => {
    try {
        const config: AxiosRequestConfig = {
            method,
            url,
            data,
            params,
            headers: {
                ...(isFormData ? {} : { "Content-Type": contentType || "application/json" }),
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...headers,
            },
        };

        const response: AxiosResponse = await api(config);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        let errorMessage = "API request failed.";

        if (axiosError.response) {
            const responseData: any = axiosError.response.data;
            errorMessage =
                responseData?.errors?.[0] ||
                responseData?.message ||
                responseData?.detail ||
                `Request failed with status ${axiosError.response.status}`;
        } else if (axiosError.request) {
            errorMessage = "No response received from server.";
        } else {
            errorMessage = axiosError.message;
        }

        console.error("API Request Error:", errorMessage);
        return { error: errorMessage };
    }
};

export default apiRequest;

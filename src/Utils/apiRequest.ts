import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiRequestOptions<T = any> {
    method: "get" | "post" | "put" | "delete" | "patch";
    url: string;
    data?: T;
    params?: Record<string, any>;
    headers?: Record<string, string>;
    contentType?: string;
    token?: string | null;
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
            // throw new Error("Base URL is not defined in environment variables.");
            return { error: "Base URL is not defined in environment variables." };
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
        let errorMessage = "API request failed.";

        if (axiosError.response) {
            // Extract error message from response
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

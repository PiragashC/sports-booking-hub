import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiRequest from "../Utils/Axios/apiRequest";
import { sessionInactivityCheckTime, tokenExpireIn } from "../Utils/commonLogic";
import { setLogin, setLogout, User } from "../redux/authSlice";
import { getNavigateCallback } from "../Utils/Axios/axiosInstance";

let refreshTimeout: NodeJS.Timeout | null = null;
let inactivityTimeout: NodeJS.Timeout | null = null;

// Custom Hook for Auth Session Management
export const useAuthSession = () => {
    const dispatch = useDispatch();
    const { token, refreshToken, expireIn } = useSelector((state: {
        auth: {
            user: User | null;
            token: string | null;
            refreshToken: string | null;
            expireIn: number;
        }
    }) => state.auth);

    // Function to handle logout with navigation
    const handleLogout = () => {
        dispatch(setLogout());
        const navigate = getNavigateCallback();
        if (navigate) {
            navigate("/login/admin");
        }
    };

    // Function to refresh token
    const refreshAuthToken = async () => {
        if (!refreshToken) {
            handleLogout();
            return;
        }

        try {
            const response: any = await apiRequest({
                method: "post",
                url: "/auth/refresh",
                data: { refreshToken },
            });

            if (response?.accessToken) {
                const { accessToken, refreshToken, expireIn, userDto } = response;
                dispatch(
                    setLogin({
                        user: userDto || null,
                        token: accessToken,
                        refreshToken,
                        expireIn: expireIn || tokenExpireIn,
                    })
                );
                scheduleTokenRefresh(expireIn || tokenExpireIn);
            } else {
                handleLogout();
            }
        } catch (error) {
            console.error("Token refresh failed:", error);
            handleLogout();
        }
    };

    // Function to schedule auto-refresh before token expires
    const scheduleTokenRefresh = (expireIn: number) => {
        if (refreshTimeout) clearTimeout(refreshTimeout);
        refreshTimeout = setTimeout(refreshAuthToken, expireIn - 60000); // Refresh 1 min before expiry
    };

    // Function to start inactivity detection
    const startInactivityTimer = () => {
        if (inactivityTimeout) clearTimeout(inactivityTimeout);

        inactivityTimeout = setTimeout(() => {
            console.log("User inactive for 5 minutes. Logging out...");
            handleLogout();
        }, sessionInactivityCheckTime); // 5 minutes = 300,000ms
    };

    // Attach event listeners to reset inactivity timer on user activity
    const setupInactivityListeners = () => {
        ["mousemove", "mousedown", "keydown", "scroll", "touchstart"].forEach((event) => {
            window.addEventListener(event, startInactivityTimer);
        });
    };

    // Initialize auth session
    useEffect(() => {
        if (token) {
            scheduleTokenRefresh(expireIn || tokenExpireIn);
            setupInactivityListeners();
            startInactivityTimer();
        }

        return () => {
            if (refreshTimeout) clearTimeout(refreshTimeout);
            if (inactivityTimeout) clearTimeout(inactivityTimeout);
            
            // Clean up event listeners
            ["mousemove", "mousedown", "keydown", "scroll", "touchstart"].forEach((event) => {
                window.removeEventListener(event, startInactivityTimer);
            });
        };
    }, [token, expireIn]);
};
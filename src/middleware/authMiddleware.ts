import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setLogout, User } from "../state";
import apiRequest from "../Utils/apiRequest";

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

    // Function to refresh token
    const refreshAuthToken = async () => {
        if (!refreshToken) {
            dispatch(setLogout());
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
                        expireIn: expireIn || 300000,
                    })
                );
                scheduleTokenRefresh(expireIn || 300000);
            } else {
                dispatch(setLogout());
            }
        } catch (error) {
            console.error("Token refresh failed:", error);
            dispatch(setLogout());
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
            dispatch(setLogout());
        }, 180000); // 5 minutes = 300,000ms
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
            scheduleTokenRefresh(expireIn || 300000);
            setupInactivityListeners();
            startInactivityTimer();
        }

        return () => {
            if (refreshTimeout) clearTimeout(refreshTimeout);
            if (inactivityTimeout) clearTimeout(inactivityTimeout);
        };
    }, [token, expireIn]);
};

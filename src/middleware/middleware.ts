import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function useAuthRedirect() {
    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate("/booking");
        }
    }, [token, navigate]);
}

export { };
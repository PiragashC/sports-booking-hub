import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export function useAuthRedirect() {
    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            navigate("/admin");
        }
    }, [token, navigate]);
}

export { };
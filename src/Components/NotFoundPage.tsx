import { Ripple } from "primereact/ripple";
import React from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="error_container">
            <div className="error_area">
                <img src="/Error/not_found.svg" alt='404 - Not found!' />
                <h3>Page Not Found!</h3>
                <h6>Oops! The page you're looking for doesn't exist.</h6>

                <button className="go_back_btn custom is_btn p-ripple"
                    onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left"></i>
                    Go back
                    <Ripple />
                </button>
            </div>
        </div>
    )
}

export default NotFoundPage;
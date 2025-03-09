import React from "react";
import { Ripple } from "primereact/ripple";
import { useNavigate } from "react-router-dom";

const ErrorPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="error_container">
            <div className="error_area">
                <img src="/Error/error.svg" alt='' />
                <h3>Error!</h3>
                <h6>Something went wrong.</h6>

                <button className="go_back_btn custom is_btn p-ripple"
                    onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left"></i>
                    Go back
                    <Ripple />
                </button>
            </div>
        </div >
    )
}

export default ErrorPage;
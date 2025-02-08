import React from "react";
import { useNavigate, Link } from "react-router-dom";

const AppHeader: React.FC = () => {
    return (
        <>
            <header className="app_header">
                <nav className="app_nav">
                    <div className="app_nav_area">
                        <Link to={'/booking'} className="app_nav_logo_link">
                            <img src="/kover_drive_logo.png" alt="Kover Drive" />
                        </Link>

                        <div className="head_title">
                            Kover Drive&nbsp;<span>- Booking</span>
                        </div>
                    </div>
                </nav>
            </header>
        </>
    )
}

export default AppHeader;
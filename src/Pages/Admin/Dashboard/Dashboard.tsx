import React from "react";
import { useNavigate } from "react-router-dom";
import './Css/Dashboard.css';
import './Css/Dashboard-responsive.css';
import { Ripple } from "primereact/ripple";

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <div>
                <div className="page_header_area">
                    <h4 className="page_heading">Dashboard</h4>
                </div>

                <div className="dash_greeting_area">
                    <div className="dash_greeting_content">
                        <h5>Welcome to...</h5>
                        <h1>Kover <span>Drive</span><small> Sports</small></h1>
                    </div>
                </div>

                <div className="quick_link_section">
                    <h5 className="dash_head">
                        Quick links
                    </h5>

                    <div className="row quick_link_row">
                        <div className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-3">
                            <article className="dash_quick_link p-ripple"
                                onClick={() => navigate(`/admin/booking-management`)}>
                                <div className="quick_link_content">
                                    <h4>Bookings</h4>
                                    <i className="bi bi-box-arrow-in-right"></i>
                                </div>
                                <img src="/Admin/booking.svg" className="dash_quick_link_img" alt="Bookings" />
                                <Ripple />
                            </article>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-3">
                            <article className="dash_quick_link p-ripple"
                                onClick={() => navigate(`/admin/lane-management`)}>
                                <div className="quick_link_content">
                                    <h4>Lanes</h4>
                                    <i className="bi bi-box-arrow-in-right"></i>
                                </div>
                                <img src="/Admin/cricket.svg" className="dash_quick_link_img" alt="Lanes" />
                                <Ripple />
                            </article>
                        </div>

                        <div className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-3">
                            <article className="dash_quick_link p-ripple"
                                // onClick={(e) => {
                                //     e.preventDefault();
                                //     const newTab = window.open('/', '_blank');
                                //     if (newTab) newTab.focus();
                                // }}
                                onClick={() => navigate(`/`)}
                            >
                                <div className="quick_link_content">
                                    <h4>Website</h4>
                                    <i className="bi bi-box-arrow-up-right"></i>
                                </div>
                                <img src="/Admin/website.svg" className="dash_quick_link_img" alt="Website" />
                                <Ripple />
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard;
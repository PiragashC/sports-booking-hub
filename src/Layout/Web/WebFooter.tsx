import { Ripple } from "primereact/ripple";
import React from "react";
import { Link } from "react-router-dom";

const WebFooter: React.FC = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <>


            <footer className="footer_section">
                <div className="main_footer">
                    <div className="container-md">
                        <div className="row">
                            <div className="col-12 col-xl-4 col-lg-4">
                                <div className="footer_content_area footer_company">
                                    <button type="button" className="footer_logo_link"
                                        onClick={() => scrollToSection("home")}>
                                        <img src="/kover_drive_logo_grayscale.png" alt="Kover Drive" />
                                    </button>

                                    <p className="footer_desc">
                                        Kover Drive Sports is London’s premier indoor cricket and baseball facility, dedicated to skill development, fitness, and community. Whether you're training, competing, or playing for fun, our state-of-the-art space is here to support your journey. Join us and elevate your game today!
                                    </p>
                                </div>
                            </div>

                            <div className="col-12 col-xl-3 col-lg-3 col-sm-6">
                                <div className="footer_content_area pt-4">
                                    <h5 className="footer_link_head">Quick links</h5>

                                    <ul className="footer_link_list">
                                        <li className="footer_link_item">
                                            <button type="button" className="footer_link"
                                                onClick={() => scrollToSection("about")}>
                                                About
                                            </button>
                                        </li>
                                        <li className="footer_link_item">
                                            <button type="button" className="footer_link"
                                                onClick={() => scrollToSection("features")}>
                                                Features
                                            </button>
                                        </li>
                                        <li className="footer_link_item">
                                            <button type="button" className="footer_link"
                                                onClick={() => scrollToSection("contact")}>
                                                Contact us
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-12 col-xl-3 col-lg-3 col-sm-6">
                                <div className="footer_content_area pt-4">
                                    <h5 className="footer_link_head">Contact us</h5>

                                    <ul className="footer_link_list">
                                        <li className="footer_link_item">
                                            <div className="footer_link_group">
                                                <i className="bi bi-telephone-fill"></i>
                                                <div>
                                                    <Link to={`tel:+14036811246`} className="footer_link">
                                                        +1 (403) 681-1246
                                                    </Link><br />
                                                    <Link to={`tel:+15197022683`} className="footer_link">
                                                        +1 (519) 702-2683
                                                    </Link>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="footer_link_item">
                                            <div className="footer_link_group">
                                                <i className="bi bi-envelope-fill"></i>
                                                <Link to={`mailto:koverdrivelondonon@gmail.com`} className="footer_link">
                                                    koverdrivelondonon@gmail.com
                                                </Link>
                                            </div>
                                        </li>
                                        <li className="footer_link_item">
                                            <div className="footer_link_group">
                                                <i className="bi bi-geo-alt-fill"></i>
                                                <Link to={`https://maps.app.goo.gl/uMLQimJ1LNyDjt5d9`} target="_blank" className="footer_link">
                                                    Oxbury Mall, 1299 Oxford St E, London, ON N5Y 4W4
                                                </Link>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-12 col-xl-2 col-lg-2">
                                <div className="footer_content_area pt-4">
                                    <h5 className="footer_link_head">Quick links</h5>

                                    <ul className="footer_social_link_list">
                                        <li>
                                            <Link
                                                to={`https://web.facebook.com/people/Kover-Drive-Sports/61572469933200/?mibextid=wwXIfr&rdid=RdpaU7aKJkFeWFIs&share_url=https%3A%2F%2Fweb.facebook.com%2Fshare%2F18to3KbNox%2F%3Fmibextid%3DwwXIfr%26_rdc%3D1%26_rdr`}
                                                target="_blank"
                                                className="footer_social_link p-ripple"
                                                aria-label="Visit our Facebook page">
                                                <i className="ri-facebook-fill"></i>
                                                <Ripple />
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to={`https://www.instagram.com/kover_drive/`}
                                                target="_blank"
                                                className="footer_social_link p-ripple"
                                                aria-label="Visit our Instagram page">
                                                <i className="bi bi-instagram"></i>
                                                <Ripple />
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sub_footer">
                    <div className="container-md">
                        <p className="sub_footer_desc">Copyright © {new Date().getFullYear()} Kover Drive Sports. All Right Reseved.</p>
                    </div>
                </div>
            </footer >
        </>
    )
}

export default WebFooter;
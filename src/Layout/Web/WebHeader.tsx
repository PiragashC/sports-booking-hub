import { Ripple } from "primereact/ripple";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { goToTop } from "../../Components/GoToTop";

const WebHeader: React.FC = () => {
    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 80) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <>
            <div className="web_sub_header">
                <div className="container-md">
                    <div className="web_sub_header_area">
                        <Link to={`https://maps.app.goo.gl/uMLQimJ1LNyDjt5d9`} target="_blank" className="sub_header_link">
                            <i className="bi bi-geo-alt-fill me-2"></i>
                            Oxbury Mall, 1295 Oxford St E, London, ON N5Y 4W4
                        </Link>

                        <div className="web_sub_header_sub">
                            <div className="sub_header_link_group">
                                <Link to={`tel:+14036811246`} className="sub_header_link">
                                    <i className="bi bi-telephone-fill me-2"></i>
                                    +1 (403) 681-1246
                                </Link>&nbsp;&nbsp;|&nbsp;&nbsp;
                                <Link to={`tel:+15197022683`} className="sub_header_link">
                                    +1 (519) 702-2683
                                </Link>
                            </div>

                            <Link to={`mailto:koverdrivelondonon@gmail.com`} className="sub_header_link">
                                <i className="bi bi-envelope-fill me-2"></i>
                                koverdrivelondonon@gmail.com
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <header className={`web_header ${isScrolled && 'scrolled'}`}>
                <div className="web_navbar">
                    <div className="container-md">
                        <div className="web_navbar_area">
                            <div className="web_nav_logo_area">
                                <button type="button" className="web_nav_logo p-ripple"
                                    onClick={() => scrollToSection("home")}>
                                    <img src="/kover_drive_logo.png" alt="Kover Drive" />
                                    <Ripple />
                                </button>
                            </div>

                            <ul className="web_nav_link_list">
                                <li className="web_nav_link_item">
                                    <button type="button" className="web_nav_link"
                                        onClick={() => scrollToSection("about")}>
                                        About
                                    </button>
                                </li>

                                <li className="web_nav_link_item">
                                    <button type="button" className="web_nav_link"
                                        onClick={() => scrollToSection("features")}>
                                        Features
                                    </button>
                                </li>

                                <li className="web_nav_link_item">
                                    <button type="button" className="web_nav_link"
                                        onClick={() => scrollToSection("contact")}>
                                        Contact us
                                    </button>
                                </li>
                            </ul>

                            <div className="web_nav_btn_area">
                                <button className="web_nav_btn p-ripple"
                                    onClick={() => {
                                        navigate(`/booking`);
                                        goToTop();
                                    }}>
                                    Book now
                                    <Ripple />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default WebHeader;
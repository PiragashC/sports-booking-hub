import { Ripple } from "primereact/ripple";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    return (
        <>
            <header className={`web_header ${isScrolled && 'scrolled'}`}>
                <div className="web_navbar">
                    <div className="container-md">
                        <div className="web_navbar_area">
                            <div className="web_nav_logo_area">
                                <Link to={'/'} className="web_nav_logo p-ripple">
                                    <img src="/kover_drive_logo.png" alt="Kover Drive" />
                                    <Ripple />
                                </Link>
                            </div>

                            <ul className="web_nav_link_list">
                                <li className="web_nav_link_item">
                                    <Link to={'#about'} className="web_nav_link">About</Link>
                                </li>

                                <li className="web_nav_link_item">
                                    <Link to={'#features'} className="web_nav_link">Features</Link>
                                </li>

                                <li className="web_nav_link_item">
                                    <Link to={'#contact'} className="web_nav_link">Contact us</Link>
                                </li>
                            </ul>

                            <div className="web_nav_btn_area">
                                <button className="web_nav_btn p-ripple">
                                    Get Started
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
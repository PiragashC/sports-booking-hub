import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Link, useLocation, Outlet } from "react-router-dom";
import { useDispatch } from 'react-redux';

import { Ripple } from 'primereact/ripple';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

import { goToTop } from '../../Components/GoToTop';

import AdminFooter from "./AdminFooter";

const AdminLayout: React.FC = () => {
    const navigate = useNavigate;
    const { pathname } = useLocation();
    const dispatch = useDispatch();
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const [fullScreen, setFullScreen] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const dropdowMenuRef = useRef<HTMLDivElement | null>(null);

    const toggleDropdownMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdowMenuRef.current && !dropdowMenuRef.current.contains(event.target as Node)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleLinkClick = () => {
        setMenuOpen(false);
        goToTop();
    }

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
                .then(() => setFullScreen(true))
                .catch((err) => console.error(`Failed to enter fullscreen mode: ${err.message}`));
        } else {
            document.exitFullscreen()
                .then(() => setFullScreen(false))
                .catch((err) => console.error(`Failed to exit fullscreen mode: ${err.message}`));
        }
    };
    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogOut = () => {
        confirmDialog({
            message: 'Are you sure you want to log out?',
            header: 'Logout Confirmation',
            icon: 'bi bi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: logout,
        });
        setMenuOpen(false);
    }

    const logout = () => {
    }

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className='admin_layout'>
            <div className={`menu-backdrop ${menuOpen ? 'show' : ''}`} onClick={closeMenu}></div>

            <ConfirmDialog />

            {/* Side bar */}
            <aside className={`navigation_area ${menuOpen ? 'active' : ''} `}>
                <div className='toggle_close  p-ripple' onClick={toggleMenu}>
                    <i className='bi bi-x'></i>
                    <Ripple />
                </div>
                <ul>
                    <li className='logo_title_section'>
                        <Link to={`#`} className="logo_title_area">
                            <img src="/kover_drive_logo_grayscale.png" className='side_bar_logo' alt="" />
                            <div className='split_ln'></div>
                            <span className='logo_title'>
                                Kover Drive
                                <br />
                                <small>
                                    Sports
                                </small>
                            </span>
                        </Link>
                    </li>

                    <li className={`${pathname === '/admin/dashboard' ? 'active' : ''}`}>
                        <Link to={'/admin/dashboard'} onClick={handleLinkClick} >
                            <span className="icon">
                                <i className="bi bi-speedometer2"></i>
                            </span>
                            <span className="title">Dashboard</span>
                        </Link>
                    </li>

                    <li className={`${pathname === '/admin/booking-management' ? 'active' : ''}`}>
                        <Link to={'/admin/booking-management'} onClick={handleLinkClick}>
                            <span className="icon">
                                <i className="bi bi-calendar2-check"></i>
                            </span>
                            <span className="title">Bookings</span>
                        </Link>
                    </li>

                    <li className={`${pathname === '/admin/lane-management' ? 'active' : ''}`}>
                        <Link to={'/admin/lane-management'} onClick={handleLinkClick}>
                            <span className="icon">
                                <i className="bi bi-building"></i>
                            </span>
                            <span className="title">Lanes</span>
                        </Link>
                    </li>

                    <li className='danger'>
                        <Link to={`#`} onClick={handleLogOut}>
                            <span className="icon">
                                <i className="bi bi-box-arrow-in-right"></i>
                            </span>
                            <span className="title">Sign Out</span>
                        </Link>
                    </li>
                </ul>
            </aside>

            <div className="main_area">
                {/* Nav bar */}
                <nav className={`topbar ${scrolled ? 'scrolled' : ''}`}>
                    <div className='d-flex'>
                        <div className="toggle_menu p-ripple" onClick={toggleMenu}>
                            <i className={`bi bi-list`}></i>
                            <Ripple />
                        </div>
                        <div className="fullscreen_toggle p-ripple" onClick={toggleFullScreen}>
                            <i className={`bi ${fullScreen ? 'bi-fullscreen-exit' : 'bi-fullscreen'}`}></i>
                            <Ripple />
                        </div>
                    </div>

                    <div className="user_toggle_area" ref={dropdowMenuRef}>
                        <div className="user_toggle p-ripple" onClick={toggleDropdownMenu}>
                            <img src="/Admin/user.svg" alt="Profile" />
                            <Ripple />
                        </div>

                        <ul className={`profile-dropdown-menu admin ${isOpen ? 'open' : ''}`}>
                            <li className='profile-dropdown-detail'>
                                <div className="profile-dropdown-image-area">
                                    <img src={"/Admin/user.svg"} className='profile-dropdown-no-img' alt="" />
                                </div>
                                <h6 className='dropdown-profile-name'>
                                    Admin
                                </h6>
                            </li>
                            {/* <li className='profile-dropdown-item mb-1 mt-1'>
                                <button className="profile-dropdown-link profile p-ripple">
                                    <i className='bi bi-person me-2'></i>
                                    Profile
                                    <Ripple />
                                </button>
                            </li> */}
                            <li className='profile-dropdown-item mt-1'>
                                <button className="profile-dropdown-link logout p-ripple" type='button'
                                    onClick={handleLogOut}>
                                    <i className='bi bi-box-arrow-right me-2'></i>
                                    Logout
                                    <Ripple />
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>

                {/* Page content */}
                <div className="main-content">
                    <Outlet />
                </div>

            </div>

            <AdminFooter />
        </div>
    )
}

export default AdminLayout;
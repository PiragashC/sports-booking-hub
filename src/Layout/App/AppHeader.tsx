import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setLogout } from "../../state";
import { Button } from "primereact/button";

interface User {
    id: string;
    userName: string;
    email: string;
}

const AppHeader: React.FC = () => {
    const dispatch = useDispatch();
    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
    const user = useSelector((state: { auth: { user: User } }) => state.auth.user);


    const handleLogOut = () => {
        confirmDialog({
            message: 'Are you sure you want to log out?',
            header: 'Logout Confirmation',
            icon: 'bi bi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept: () => { dispatch(setLogout()); },
        });
    }
    return (
        <>
            <ConfirmDialog />
            <header className="app_header">
                <nav className="app_nav">
                    <div className="app_nav_area">
                        <Link to={'/booking'} className="app_nav_logo_link">
                            <img src="/kover_drive_logo.png" alt="Kover Drive" />
                        </Link>

                        <div className="head_title">
                            Kover Drive&nbsp;<span>- Booking</span>
                        </div>
                        {token && <>
                            <div className="flex-grow-1"></div>

                            <div className="d-flex">
                                <Button
                                    label={`Log Out`}
                                    onClick={handleLogOut}
                                    loading={false}
                                    severity="danger"
                                    disabled={false}
                                />
                            </div>
                        </>}
                    </div>
                </nav>
            </header>
        </>
    )
}

export default AppHeader;

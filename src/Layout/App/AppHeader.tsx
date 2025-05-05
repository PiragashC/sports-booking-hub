import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import { setLogout } from '../../redux/authSlice';


const AppHeader: React.FC = () => {
    const dispatch = useDispatch();
    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);

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
        <React.Fragment>
            {/* <ConfirmDialog /> */}
            <header className="app_header">
                <nav className="app_nav">
                    <div className={`app_nav_area ${token && 'justify-content-between'}`}>
                        <Link to={'/'} className="app_nav_logo_link">
                            <img src="/kover_drive_logo.png" alt="Kover Drive" />
                        </Link>

                        <div className="head_title">
                            Kover Drive&nbsp;<span>- Booking</span>
                        </div>

                        {token && <>
                            <div className="d-flex">
                                <Button
                                    icon={`ri-logout-circle-line`}
                                    label={`Logout`}
                                    onClick={handleLogOut}
                                    loading={false}
                                    severity="danger"
                                    disabled={false}
                                    className='logout_btn'
                                />
                            </div>
                        </>}
                    </div>
                </nav>
            </header>
        </React.Fragment>
    )
}

export default AppHeader;

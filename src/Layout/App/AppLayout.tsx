import React from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const AppLayout: React.FC = () => {
    return (
        <React.Fragment>
            <AppHeader />
            <main className="app_main_content">
                <Outlet />
            </main>
            <AppFooter />
        </React.Fragment>
    )
}

export default AppLayout;
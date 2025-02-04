import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppFooter from "./AppFooter";

const AppLayout: React.FC = () => {
    return (
        <>
            <AppHeader />
            <main className="app_main_content">
                <Outlet />
            </main>
            <AppFooter />
        </>
    )
}

export default AppLayout;
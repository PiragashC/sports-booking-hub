import React from "react";
import { Outlet } from "react-router-dom";
import WebHeader from "./WebHeader";
import WebFooter from "./WebFooter";
import BackToTop from "./BackToTop";

const WebLayout: React.FC = () => {
    return (
        <>
            <WebHeader />

            <main>
                <Outlet />
            </main>

            <WebFooter />

            <BackToTop />
        </>
    )
}

export default WebLayout;
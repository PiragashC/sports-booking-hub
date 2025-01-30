import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import WebHeader from "./WebHeader";
import WebFooter from "./WebFooter";

const WebLayout: React.FC = () => {
    return (
        <>
            <WebHeader />
            <main>
                <Outlet />
            </main>
            <WebFooter />
        </>
    )
}

export default WebLayout;
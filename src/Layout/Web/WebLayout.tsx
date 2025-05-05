import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import WebHeader from "./WebHeader";
import WebFooter from "./WebFooter";
import BackToTop from "./BackToTop";
import { getWebContentsThunk } from "../../redux/webContentSlice";
import { useAppDispatch } from "../../redux/hook";

const WebLayout: React.FC = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(getWebContentsThunk({ id: "402888e696a0b7920196a0c108bc0018" }));
    }, [dispatch]);
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
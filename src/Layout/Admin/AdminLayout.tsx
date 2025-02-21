import React, { useState, useEffect } from "react";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import { Outlet } from "react-router-dom";

const AdminLayout: React.FC = () => {
    return (
        <>
            <AdminHeader />

            <main className="admin_main_content">
                <Outlet />
            </main>

            <AdminFooter />
        </>
    )
}

export default AdminLayout;
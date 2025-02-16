import React from "react";

const AppFooter: React.FC = () => {
    return (
        <>
            <footer className="app_footer">
                <div className="app_footer_area">
                    <p className="sub_footer_desc">Copyright © {new Date().getFullYear()} Kover Drive Sports. All Right Reseved.</p>
                </div>
            </footer>
        </>
    )
}

export default AppFooter;
import React, { useState, useEffect } from "react";
import { goToTop } from "../../Components/GoToTop";
import { Ripple } from "primereact/ripple";

const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setIsVisible(scrollTop > 80);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <button className={`back_to_top_btn ${isVisible && 'show'} p-ripple`}
            title="Back to Top"
            type="button"
            aria-label="Back to Top"
            onClick={goToTop}>
            <i className="bi bi-chevron-up"></i>
            <Ripple />
        </button>
    )
}

export default BackToTop;
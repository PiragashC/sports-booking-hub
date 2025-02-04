import React, { useState } from "react";
import './Home.css';
import './Home-responsive.css';
import StripeFinalComponent from "../../Components/Stripe/StripeFinalComponent";

const Home: React.FC = () => {
    return (
        <div style={{height: '150vh'}}>
            <StripeFinalComponent />
        </div>
    );
};

export default Home;

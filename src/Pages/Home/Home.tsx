import React, { useState, useEffect } from "react";
import "./Home.css";
import "./Home-responsive.css";

import { InputText } from "primereact/inputtext";

const Home: React.FC = () => {
    const [value, setValue] = useState<string>("");
    return (
        <>
            <h1>Home Page</h1>
        </>
    );
};

export default Home;

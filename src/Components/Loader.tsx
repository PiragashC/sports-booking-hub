import React from "react";
import { ProgressSpinner } from "primereact/progressspinner";

const Loader: React.FC = () => {
    return (
        <div className="loader">
            <ProgressSpinner />
        </div>
    )
}

export default Loader;
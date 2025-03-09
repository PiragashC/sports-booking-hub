import React from "react";
import FormFieldLoader from "../../../Components/FormFieldLoader";

const LaneFormLoader: React.FC = () => {
    return (
        <div className="row">
            <div className="col-12 col-sm-6">
                <FormFieldLoader formGroupClassName="mb-sm-2" />
            </div>
            <div className="col-12 col-sm-6">
                <FormFieldLoader formGroupClassName="mb-2" />
            </div>
        </div>
    )
}

export default LaneFormLoader;
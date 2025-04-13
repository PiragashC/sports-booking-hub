import React from "react";

interface NoDataProps {
    message?: string;
    showImage?: boolean;
}

const NoData: React.FC<NoDataProps> = ({ message, showImage }) => {
    return (
        <div className="no_data_container">
            {showImage && (
                <img src={`${process.env.PUBLIC_URL}/no_data/no_data.svg`} alt='No data found!' />
            )}
            <h6>{message ? message : 'No Data Found!'}</h6>
        </div>
    )
}

export default NoData;
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Ripple } from "primereact/ripple";
import { Lane, lanes } from "./BookingData";

const BookingView: React.FC = () => {
    const [lanesData, setLanesData] = useState<Lane[]>([]);
    const [selectedLaneData, setSelectedLaneData] = useState<Lane | null>(null);

    const [bookingViewMode, setBookingViewMode] = useState<'date' | 'month' | 'week'>('date');

    useEffect(() => {
        const fetchData = async () => {
            const activeLanesData = lanes?.filter(lane => lane?.isActive === 1);
            setLanesData(activeLanesData);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (lanesData && lanesData?.length !== 0) {
            setSelectedLaneData(lanesData[0]);
        }
    }, [lanesData]);


    const handleChangeLane = (lane: Lane) => {
        setSelectedLaneData(lane);
    }

    return (
        <>
            <div className="page_content">
                {lanesData && lanesData?.length > 0 && (
                    <div className="page_tabs_area">
                        {lanesData?.map((lane) => (
                            <button
                                key={lane?.laneId}
                                className={`page_tab_btn ${lane?.laneId === selectedLaneData?.laneId && 'active'} p-ripple`}
                                type="button"
                                onClick={() => handleChangeLane(lane)}>
                                {lane?.laneName}
                                <Ripple pt={{ root: { style: { background: 'rgba(0, 128, 0, 0.2)' } } }} />
                            </button>
                        ))}
                    </div>
                )}

                <article className="page_card">

                </article>
            </div>
        </>
    )
}

export default BookingView;
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Ripple } from "primereact/ripple";
import { Toast } from "primereact/toast";
import { SelectButton, SelectButtonChangeEvent } from 'primereact/selectbutton';
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { format, startOfWeek, endOfWeek, parseISO } from "date-fns";

import { Lane, lanes, BookingsByDate, bookingsByDate, BookingsByDateRange, bookingsByDateRange } from "./BookingData";

const BookingView: React.FC = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const [lanesData, setLanesData] = useState<Lane[]>([]);
    const [selectedLaneData, setSelectedLaneData] = useState<Lane | null>(null);

    const [dateWiseBookingData, setDateWiseBookingData] = useState<BookingsByDate[]>([]);
    const [filteredDateWiseBookingData, setFilteredDateWiseBookingData] = useState<BookingsByDate[]>([]);
    const [filteredLaneDateWiseBookingData, setFilteredLaneDateWiseBookingData] = useState<BookingsByDate | null>(null);


    const [dateWiseBookingDataRange, setDateWiseBookingDataRange] = useState<BookingsByDateRange[]>([]);
    const [bookingViewMode, setBookingViewMode] = useState<'Day' | 'Month'>('Day');

    const [date, setDate] = useState<Date>(new Date());
    const [month, setMonth] = useState<Date>(new Date());
    const calendarRef = useRef(null);

    const formatDate = (date: Date): string => {
        return date.toISOString().split("T")[0];
    };


    useEffect(() => {
        const fetchData = async () => {
            setLanesData(lanes);
            setDateWiseBookingData(bookingsByDate);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (lanesData && lanesData?.length !== 0) {
            setSelectedLaneData(lanesData[0]);
        }
    }, [lanesData]);


    useEffect(() => {
        if (date) {
            const formattedDate = formatDate(date);

            if (dateWiseBookingData && dateWiseBookingData?.length > 0) {
                const filteredData = dateWiseBookingData?.filter(booking => booking?.bookingDate === formattedDate);

                setFilteredDateWiseBookingData(filteredData);
            }
        }
    }, [dateWiseBookingData, date]);


    useEffect(() => {
        const fetchData = async () => {
            if (selectedLaneData && selectedLaneData !== null) {
                const filteredData = filteredDateWiseBookingData?.find(booking => booking?.laneId === selectedLaneData?.id);

                if (filteredData) {
                    setFilteredLaneDateWiseBookingData(filteredData);
                } else {
                    setFilteredLaneDateWiseBookingData(null);
                }
            }
        }
        fetchData();
    }, [selectedLaneData, filteredDateWiseBookingData]);


    const handleChangeLane = (lane: Lane) => {
        setSelectedLaneData(lane);
    }

    const handleSwitchViewMode = (view: 'Day' | 'Month') => {
        setBookingViewMode(view);

        if (calendarRef.current) {
            (calendarRef.current as any).show();
        }
    }


    /* ********************************** For date view ********************************** */
    const handleNavigatePrevDay = () => {
        if (date > today) {
            const prevDay = new Date(date);
            prevDay.setDate(prevDay.getDate() - 1);
            setDate(prevDay);
        }
    };

    const handleNavigateNextDay = () => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        setDate(nextDay);
    };
    /* *********************************************************************************** */


    /* ********************************* For month view ********************************** */
    const handleNavigatePrevMonth = () => {
        const prevMonth = new Date(month);
        prevMonth.setMonth(prevMonth.getMonth() - 1);
        setMonth(prevMonth);
    };

    const handleNavigateNextMonth = () => {
        const nextMonth = new Date(month);
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        setMonth(nextMonth);
    };
    /* *********************************************************************************** */


    return (
        <>
            <div className="page_content">
                <div className="page_header_area">
                    <div className="view_option_switch_area">
                        <button
                            className={`view_option_switch is_btn p-ripple ${bookingViewMode === 'Day' && 'active'}`}
                            type="button"
                            aria-label="Day"
                            onClick={() => handleSwitchViewMode('Day')}
                        >
                            Day
                            <Ripple />
                        </button>

                        <button
                            className={`view_option_switch is_btn p-ripple ${bookingViewMode === 'Month' && 'active'}`}
                            type="button"
                            aria-label="Month"
                            onClick={() => handleSwitchViewMode('Month')}
                        >
                            Month
                            <Ripple />
                        </button>
                    </div>


                    {bookingViewMode === 'Day' ? (
                        <>
                            <div className="nav_btn_switch_area">
                                <button
                                    className="nav_btn_switch is_btn p-ripple"
                                    type="button"
                                    aria-label="Prev"
                                    onClick={handleNavigatePrevDay}
                                    disabled={date.getDate() <= today.getDate()}>
                                    <i className="bi bi-chevron-left"></i>
                                    <Ripple />
                                </button>

                                <button
                                    className="nav_btn_switch is_btn p-ripple"
                                    type="button"
                                    aria-label="Next"
                                    onClick={handleNavigateNextDay}>
                                    <i className="bi bi-chevron-right"></i>
                                    <Ripple />
                                </button>
                            </div>

                            <Calendar
                                key="day-calendar"
                                ref={calendarRef}
                                value={date}
                                selectionMode="single"
                                onChange={(e) => setDate(e.value as Date)}
                                dateFormat="DD, MM dd, yy"
                                inputClassName="date_selection_input"
                                view="date"
                                minDate={today}
                                showIcon
                                iconPos='left'
                                readOnlyInput
                                icon='bi bi-calendar-event'
                            />
                        </>
                    ) : bookingViewMode === 'Month' ? (
                        <>
                            <div className="nav_btn_switch_area">
                                <button
                                    className="nav_btn_switch is_btn p-ripple"
                                    type="button"
                                    aria-label="Prev"
                                    onClick={handleNavigatePrevMonth}
                                    disabled={month.getMonth() === currentMonth && month.getFullYear() === currentYear}>
                                    <i className="bi bi-chevron-left"></i>
                                    <Ripple />
                                </button>

                                <button
                                    className="nav_btn_switch is_btn p-ripple"
                                    type="button"
                                    aria-label="Next"
                                    onClick={handleNavigateNextMonth}>
                                    <i className="bi bi-chevron-right"></i>
                                    <Ripple />
                                </button>
                            </div>

                            <Calendar
                                key="month-calendar"
                                ref={calendarRef}
                                value={month}
                                selectionMode="single"
                                onChange={(e) => setMonth(e.value as Date)}
                                view="month"
                                dateFormat="MM yy"
                                minDate={today}
                                readOnlyInput
                                inputClassName="date_selection_input"
                                showIcon
                                iconPos='left'
                                icon='bi bi-calendar2'
                            />
                        </>
                    ) : null}

                </div>

                {lanesData && lanesData?.length > 0 && (
                    <div className="page_tabs_area">
                        {lanesData?.map((lane) => (
                            <button
                                key={lane?.id}
                                className={`page_tab_btn ${lane?.id === selectedLaneData?.id && 'active'} p-ripple`}
                                type="button"
                                onClick={() => handleChangeLane(lane)}>
                                {lane?.name}
                                <Ripple pt={{ root: { style: { background: 'rgba(0, 128, 0, 0.2)' } } }} />
                            </button>
                        ))}
                    </div>
                )}

                <article className="page_card">
                    {filteredLaneDateWiseBookingData && filteredLaneDateWiseBookingData !== null && (
                        <>
                            {filteredLaneDateWiseBookingData?.bookingResponseDtos?.map((booking, index) => (
                                <div>
                                    {booking?.userName}
                                    {booking?.startTime}
                                    {booking?.endTime}
                                </div>
                            ))}
                        </>
                    )}

                </article>
            </div>
        </>
    )
}

export default BookingView;
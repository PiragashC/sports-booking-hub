import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { Ripple } from "primereact/ripple";
import { Toast } from "primereact/toast";
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";

import FullCalendar from "@fullcalendar/react";
import { MutableRefObject } from "react";

import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, startOfWeek, endOfWeek, parseISO } from "date-fns";

import BookingModal from "./BookingModal";

import { Lane, lanes, BookingsByDate, bookingsByDate, BookingsByDateRange, bookingsByDateRange, BookingResponse } from "./BookingData";
import { Dialog } from "primereact/dialog";

const Booking: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const toastRef = useRef<Toast>(null);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const calendarRef = useRef(null);

    const [isLoginAsAdmin, setIsLoginAsAdmin] = useState<boolean>(true);
    const [bookingViewMode, setBookingViewMode] = useState<'Day' | 'Month'>('Day');

    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

    const [lanesData, setLanesData] = useState<Lane[]>([]);
    const [selectedLaneData, setSelectedLaneData] = useState<Lane | null>(null);

    const [date, setDate] = useState<Date>(new Date());
    const [dayViewEvents, setDayViewEvents] = useState<any | null>(null);
    const dayViewModeRef = useRef(null);
    const [dateWiseBookingData, setDateWiseBookingData] = useState<BookingsByDate[]>([]);
    const [filteredDateWiseBookingData, setFilteredDateWiseBookingData] = useState<BookingsByDate[]>([]);
    const [filteredLaneDateWiseBookingData, setFilteredLaneDateWiseBookingData] = useState<BookingsByDate | null>(null);

    const [month, setMonth] = useState<Date>(new Date());
    const [monthViewEvents, setMonthViewEvents] = useState<any[]>([]);
    const monthViewModeRef = useRef(null);
    const [monthWiseBookingData, setMonthWiseBookingData] = useState<BookingsByDate[]>([]);
    const [filteredMonthWiseBookingData, setFilteredMonthWiseBookingData] = useState<BookingsByDate[]>([]);
    const [filteredLaneMonthWiseBookingData, setFilteredLaneMonthWiseBookingData] = useState<BookingsByDate[]>([]);

    const [showBookingDetailsModal, setShowBookingDetailsModal] = useState<boolean>(false);
    const [dayWiseBookingDetails, setDayWiseBookingDetails] = useState<BookingResponse | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLanesData(lanes);
            setDateWiseBookingData(bookingsByDate);
            setMonthWiseBookingData(bookingsByDate);
        }
        fetchData();
    }, []);

    useEffect(() => {
        if (lanesData && lanesData?.length !== 0) {
            setSelectedLaneData(lanesData[0]);
        }
    }, [lanesData]);


    /* ********************************** For new booking ********************************* */
    const handleNewBooking = () => {
        setShowBookingModal(true);
    }

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
    }
    /* *********************************************************************************** */


    /* ********************************* Helper functions ******************************** */
    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const formatTime = (time?: string) => {
        if (!time) return "Invalid Time";
        const [hours, minutes] = time.split(":").map(Number);
        const date = new Date();
        date.setHours(hours, minutes);

        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };
    /* *********************************************************************************** */


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

                    // if (filteredData?.bookingResponseDtos) {
                    //     const events = filteredData?.bookingResponseDtos?.map((booking) => ({
                    //         id: booking.bookingId,
                    //         title: isLoginAsAdmin ? booking.userName : '',
                    //         start: `${formatDate(date)}T${booking.startTime}`,
                    //         end: `${formatDate(date)}T${booking.endTime}`,
                    //         backgroundColor: "#ddf8dd",
                    //         borderColor: "#008000",
                    //         textColor: "#006800",
                    //     })) || [];

                    //     setDayViewEvents(events);
                    // } else {
                    //     setDayViewEvents([]);
                    // }

                } else {
                    setFilteredLaneDateWiseBookingData(null);
                    // setDayViewEvents([]);
                }
            }
        }
        fetchData();

    }, [selectedLaneData, filteredDateWiseBookingData, date, isLoginAsAdmin]);


    useEffect(() => {
        if (filteredLaneDateWiseBookingData?.bookingResponseDtos) {
            const events = filteredLaneDateWiseBookingData?.bookingResponseDtos?.map((booking) => ({
                id: booking.bookingId,
                title: isLoginAsAdmin ? booking.userName : '',
                start: `${formatDate(date)}T${booking.startTime}`,
                end: `${formatDate(date)}T${booking.endTime}`,
                backgroundColor: "#ddf8dd",
                borderColor: "#008000",
                textColor: "#006800",
            })) || [];

            setDayViewEvents(events);
        } else {
            setDayViewEvents([]);
        }
    }, [filteredLaneDateWiseBookingData, isLoginAsAdmin, date]);


    const handleNavigatePrevDay = () => {
        if (date > today) {
            const prevDay = new Date(date);
            prevDay.setDate(prevDay.getDate() - 1);
            setDate(prevDay);
        }

        setSelectedLaneData(lanesData[0]);
    };


    const handleNavigateNextDay = () => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        setDate(nextDay);

        setSelectedLaneData(lanesData[0]);
    };


    const handleViewDayWiseBookingDetail = (detail: any) => {
        const bookingId = detail.event.id;
        const booking = filteredLaneDateWiseBookingData?.bookingResponseDtos?.find(data => data?.bookingId === bookingId);

        if (booking) {
            setDayWiseBookingDetails(booking);
            setShowBookingDetailsModal(true);
        }
    }

    const handleCloseBookingDetailsModal = () => {
        setShowBookingDetailsModal(false);
    }

    const bookingDetailsModalHeader = (
        <div className="custom_modal_header_inner">
            <h5 className="modal-title fs-5">
                <i className="bi bi-calendar-check me-2 modal_head_icon"></i>
                Booking details
            </h5>
            <button
                type="button"
                aria-label="Close"
                className="close_modal_btn p-ripple"
                onClick={handleCloseBookingDetailsModal}
            >
                <i className="bi bi-x-circle"></i>
                <Ripple />
            </button>
        </div>
    )

    /* *********************************************************************************** */


    /* ********************************* For month view ********************************** */
    // useEffect(() => {
    //     if (!dateRangeWiseBookingData.length) return;

    //     const filteredBookings = dateRangeWiseBookingData.map((laneData) => {
    //         const filteredDates = laneData.weekMonthViewResponseDtos?.filter((bookingDate) => {
    //             if (!bookingDate.bookingDate) return false;
    //             const bookingDateObj = new Date(bookingDate.bookingDate);
    //             return bookingDateObj.getMonth() === month.getMonth() && bookingDateObj.getFullYear() === month.getFullYear();
    //         });

    //         return { ...laneData, weekMonthViewResponseDtos: filteredDates };
    //     }).filter((laneData) => laneData.weekMonthViewResponseDtos?.length);

    //     setFilteredDateRangeWiseBookingData(filteredBookings);
    // }, [month, dateRangeWiseBookingData]);

    // useEffect(() => {
    //     if (!selectedLaneData || !filteredDateRangeWiseBookingData.length) {
    //         setFilteredLaneDateRangeWiseBookingData(null);
    //         return;
    //     }

    //     const selectedLaneBookings = filteredDateRangeWiseBookingData.find((lane) => lane.laneId === selectedLaneData.id);
    //     setFilteredLaneDateRangeWiseBookingData(selectedLaneBookings || null);
    // }, [selectedLaneData, filteredDateRangeWiseBookingData]);


    // const monthViewEvents = filteredLaneDateRangeWiseBookingData?.weekMonthViewResponseDtos?.flatMap((bookingDate) =>
    //     bookingDate.bookingResponseDtos?.map((booking) => ({
    //         id: booking.bookingId,
    //         title: booking.userName,
    //         start: `${bookingDate.bookingDate}T${booking.startTime}`,
    //         end: `${bookingDate.bookingDate}T${booking.endTime}`,
    //         allDay: false
    //     }))
    // ) || [];

    // const monthViewEvents = filteredLaneDateRangeWiseBookingData?.weekMonthViewResponseDtos?.flatMap((bookingDate) =>
    //     bookingDate.bookingResponseDtos?.map((booking) => ({
    //         id: booking.bookingId || "", // Ensure non-null ID
    //         title: booking.userName || "Unknown", // Provide a default title
    //         start: bookingDate.bookingDate && booking.startTime ? `${bookingDate.bookingDate}T${booking.startTime}` : "",
    //         end: bookingDate.bookingDate && booking.endTime ? `${bookingDate.bookingDate}T${booking.endTime}` : "",
    //         allDay: false
    //     }))
    // ) || [];

    // const validEvents = monthViewEvents.filter(event => event && event.start && event.end);

    // const monthViewEvents = filteredLaneDateRangeWiseBookingData?.weekMonthViewResponseDtos?.map((booking) => ({
    //     id: booking.bookingId,
    //     title: isLoginAsAdmin ? booking.userName : '',
    //     start: `${formatDate(date)}T${booking.startTime}`,
    //     end: `${formatDate(date)}T${booking.endTime}`,
    //     backgroundColor: "#ddf8dd",
    //     borderColor: "#008000",
    //     textColor: "#006800",
    // })) || [];

    // useEffect(() => {
    //     if (filteredLaneMonthWiseBookingData?.bookingResponseDtos) {
    //         const events: any[] = filteredLaneMonthWiseBookingData.bookingResponseDtos.map((booking) => {
    //             const startDate = `${filteredLaneMonthWiseBookingData.bookingDate}T${booking.startTime}`;
    //             const endDate = `${filteredLaneMonthWiseBookingData.bookingDate}T${booking.endTime}`;

    //             return {
    //                 id: booking.bookingId,
    //                 title: booking.userName || "Booking",
    //                 start: startDate,
    //                 end: endDate,
    //                 backgroundColor: "#ddf8dd",
    //                 borderColor: "#008000",
    //                 textColor: "#006800",
    //             };
    //         });
    //         setMonthViewEvents(events);
    //     } else {
    //         setMonthViewEvents([]);
    //     }
    // }, [filteredLaneMonthWiseBookingData]);

    useEffect(() => {
        const selectedMonth = format(month, "yyyy-MM");
        const filteredData = monthWiseBookingData.filter((booking) =>
            booking.bookingDate?.startsWith(selectedMonth)
        );
        setFilteredMonthWiseBookingData(filteredData);
    }, [month, monthWiseBookingData]);

    useEffect(() => {
        if (selectedLaneData) {
            const filteredData = filteredMonthWiseBookingData.filter(
                (booking) => booking.laneId === selectedLaneData.id
            );
            setFilteredLaneMonthWiseBookingData(filteredData);
        }
    }, [selectedLaneData, filteredMonthWiseBookingData]);

    useEffect(() => {
        const events: any[] = filteredLaneMonthWiseBookingData.flatMap((booking) =>
            booking.bookingResponseDtos?.map((res) => ({
                id: res.bookingId,
                title: res.userName || "",
                start: `${booking.bookingDate}T${res.startTime}`,
                end: `${booking.bookingDate}T${res.endTime}`,
                backgroundColor: "#ddf8dd",
                borderColor: "#008000",
                textColor: "#006800",
            })) || []
        );
        setMonthViewEvents(events);
    }, [filteredLaneMonthWiseBookingData]);

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
            <Toast ref={toastRef} />

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
                                className="date_picker_input"
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
                                className="date_picker_input"
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

                <div className="page_sub_header_area">
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

                    <button
                        className="new_data_button is_btn p-ripple"
                        aria-label="New booking"
                        onClick={handleNewBooking}>
                        <i className="bi bi-calendar-plus"></i>
                        <span>New booking</span>
                        <Ripple />
                    </button>
                </div>

                <article className="page_card">
                    {bookingViewMode === 'Day' ? (
                        <div className="booking_time_line_view day_mode">
                            <FullCalendar
                                key={`day_view_${formatDate(date)}`}
                                ref={dayViewModeRef}
                                plugins={[timeGridPlugin, interactionPlugin]}
                                initialView="timeGridDay"
                                headerToolbar={false}
                                slotMinTime="00:00:00"
                                slotMaxTime="23:59:59"
                                allDaySlot={false}
                                initialDate={date}
                                events={dayViewEvents}
                                nowIndicator={true}
                                eventClick={handleViewDayWiseBookingDetail}
                                eventClassNames={'day_view_event'}
                                height={'auto'}
                                eventContent={(eventInfo) => {
                                    const { title, start, end } = eventInfo.event;
                                    const formattedStartTime = format(new Date(start || ""), "hh:mm a");
                                    const formattedEndTime = format(new Date(end || ""), "hh:mm a");
                                    return (
                                        <div className="booking_event p-ripple">
                                            <i className="bi bi-person-fill"></i>

                                            <div className="booking_event_detail">
                                                <div className="booking_title">{title}</div>
                                                <div className="booking_time">
                                                    {formattedStartTime} - {formattedEndTime}
                                                </div>
                                            </div>
                                            <Ripple />
                                        </div>
                                    )
                                }}
                            />
                        </div>
                    ) : bookingViewMode === 'Month' ? (
                        <div className="booking_time_line_view month_mode">
                            <FullCalendar
                                key={`month_view_${month.getMonth() + 1}`}
                                // plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                ref={monthViewModeRef}
                                plugins={[dayGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                initialDate={month}
                                events={monthViewEvents}
                                headerToolbar={false}
                                eventClassNames={'month_view_event'}
                                height={'auto'}
                                dayMaxEvents={2}
                                moreLinkText="View More"
                            />
                        </div>
                    ) : null}
                </article>
            </div>

            <BookingModal
                isOpen={showBookingModal}
                onClose={handleCloseBookingModal}
                toastRef={toastRef}
            />

            <Dialog
                visible={showBookingDetailsModal}
                header={bookingDetailsModalHeader}
                headerClassName="custom_modal_header"
                className={`custom_modal_dialog modal_dialog_sm`}
                onHide={handleCloseBookingDetailsModal}
                dismissableMask
            >
                <div className="custom_modal_body p-0">
                    {dayWiseBookingDetails && dayWiseBookingDetails !== null && (
                        <div className="booking_detail_area">
                            <div className="booking_detail">
                                <i className="bi bi-person-circle"></i>
                                {isLoginAsAdmin && dayWiseBookingDetails?.userName !== null ? (
                                    <span>
                                        {dayWiseBookingDetails?.userName}
                                    </span>
                                ) : (
                                    <span className="font_light">
                                        User detail hidden or empty
                                    </span>
                                )}
                            </div>

                            <hr />

                            <div className="booking_detail">
                                <i className="bi bi-clock-fill"></i>
                                <span>
                                    {formatTime(dayWiseBookingDetails?.startTime) + '-' + formatTime(dayWiseBookingDetails?.endTime)}
                                </span>
                            </div>

                            <hr />

                            <div className="booking_detail">
                                <i className="bi bi-info-circle-fill"></i>
                                <span className="font_light">
                                    Additional details are hidden or not available
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </Dialog>
        </>
    )
}

export default Booking;
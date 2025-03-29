import React, { useState, useEffect, useRef } from "react";

import { Ripple } from "primereact/ripple";
import { Toast } from "primereact/toast";
import { Calendar } from 'primereact/calendar';

import FullCalendar from "@fullcalendar/react";

import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";

import BookingModal from "./BookingModal";
import dayGridPlugin from "@fullcalendar/daygrid";

import { Lane, BookingResponse, BookingRangeResponse } from "./BookingData";
import { Dialog } from "primereact/dialog";
import apiRequest from "../../Utils/apiRequest";
import { formatDate, formatDateToISO, getMonthDateRange, showErrorToast, showSuccessToast } from "../../Utils/commonLogic";
import { Button } from "primereact/button";
import { useSelector } from "react-redux";
import { ProgressSpinner } from 'primereact/progressspinner';
import { fetchLanes } from "../../Utils/commonService";


const BookingCopy: React.FC = () => {
    const toastRef = useRef<Toast>(null);
    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const calendarRef = useRef(null);
    const [bookingViewMode, setBookingViewMode] = useState<'Day' | 'Month'>('Day');
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
    const [lanesData, setLanesData] = useState<Lane[]>([]);
    const [selectedLaneData, setSelectedLaneData] = useState<Lane | null>(null);
    const [date, setDate] = useState<Date>(new Date());
    const [dayViewEvents, setDayViewEvents] = useState<any | null>(null);
    const dayViewModeRef = useRef(null);
    const [month, setMonth] = useState<Date>(new Date());
    const [showBookingDetailsModal, setShowBookingDetailsModal] = useState<boolean>(false);
    const [dayWiseBookingDetails, setDayWiseBookingDetails] = useState<BookingResponse | null>(null);

    const { from, to } = bookingViewMode === "Month" ? getMonthDateRange(new Date()) : { from: formatDate(new Date()), to: formatDate(new Date()) };

    const [fromDate, setFromDate] = useState<string>(from);
    const [toDate, setToDate] = useState<string>(to);

    const [calenderBookings, setCalenderBookings] = useState<any[]>([]);
    const [monthViewEvents, setMonthViewEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const handleNewBooking = () => {
        setShowBookingModal(true);
    }

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
    }

    const handleChangeLane = (lane: Lane) => {
        setSelectedLaneData(lane);
    }

    const handleSwitchViewMode = (view: 'Day' | 'Month') => {
        setBookingViewMode(view);

        if (calendarRef.current) {
            (calendarRef.current as any).show();
        }
        if (view === "Day") {
            setFromDate(formatDate(new Date()));
            setToDate(formatDate(new Date()));
        } else if (view === "Month") {
            setFromDate(getMonthDateRange(new Date())?.from);
            setToDate(getMonthDateRange(new Date())?.to);
        }
    }


    const fetchAllLanes = async () => {
        const lanes = await fetchLanes();
        setLanesData(lanes);
        setSelectedLaneData(lanes[0] ? lanes[0] : null);
    }

    const fetchBookingsForCalenderView = async () => {
        setLoading(true);
        const response = await apiRequest({
            method: "get",
            url: "/booking/get-all-for-calender",
            params: {
                laneId: selectedLaneData?.id,
                fromDate,
                toDate
            },
            ...(token && { token })
        });

        console.log(response);
        if (bookingViewMode === 'Day') {
            setDayViewEvents([]);
            if (response && response?.bookingResponseDtos && Array.isArray(response?.bookingResponseDtos) && response?.bookingResponseDtos.length > 0) {
                setCalenderBookings(response?.bookingResponseDtos);
                const events = response?.bookingResponseDtos?.map((booking: BookingResponse) => ({
                    id: booking.bookingId,
                    title: booking.userName || '',
                    start: `${fromDate}T${booking.startTime}`,
                    end: `${toDate}T${booking.endTime}`,
                    backgroundColor: "#ddf8dd",
                    borderColor: "#008000",
                    textColor: "#006800",
                })) || [];
                setDayViewEvents(events);
            } else {
                setCalenderBookings([]);
                setDayViewEvents([]);
            }
        } else if (bookingViewMode === 'Month') {
            setMonthViewEvents([]);
            if (
                response &&
                response?.weekMonthViewResponseDtos &&
                Array.isArray(response?.weekMonthViewResponseDtos) &&
                response?.weekMonthViewResponseDtos.length > 0
            ) {
                const monthViewEvents = response.weekMonthViewResponseDtos
                    .flatMap((dayBooking: BookingRangeResponse) =>
                        dayBooking.bookingResponseDtos.map((booking) => ({
                            id: booking.bookingId,
                            title: booking.userName || '',
                            start: `${dayBooking.bookingDate}T${booking.startTime}`,
                            end: `${dayBooking.bookingDate}T${booking.endTime}`,
                            backgroundColor: "#ddf8dd",
                            borderColor: "#008000",
                            textColor: "#006800",
                        }))
                    )
                    .sort((a: { start: string }, b: { start: string }) => new Date(a.start).getTime() - new Date(b.start).getTime());


                setCalenderBookings(response.weekMonthViewResponseDtos);
                setMonthViewEvents(monthViewEvents);
            } else {
                setCalenderBookings([]);
                setMonthViewEvents([]);
            }
        }
        setLoading(false);
    }

    const handleNavigatePrevDay = () => {
        if (date > today) {
            const prevDay = new Date(date);
            prevDay.setDate(prevDay.getDate() - 1);
            setDate(prevDay);
            setFromDate(formatDateToISO(prevDay));
            setToDate(formatDateToISO(prevDay));
        }

        setSelectedLaneData(lanesData[0]);
    };


    const handleNavigateNextDay = () => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        setDate(nextDay);
        setFromDate(formatDateToISO(nextDay));
        setToDate(formatDateToISO(nextDay));

        setSelectedLaneData(lanesData[0]);
    };

    const handleViewDayWiseBookingDetail = (detail: any) => {
        const bookingId = detail.event.id;

        let booking: any = null;

        if (bookingViewMode === "Day") {
            booking = calenderBookings?.find((data) => data?.bookingId === bookingId);
        } else if (bookingViewMode === "Month") {
            const bookingDateObj = calenderBookings?.find((data) =>
                data.bookingResponseDtos.some((b: any) => b.bookingId === bookingId)
            );

            booking = bookingDateObj?.bookingResponseDtos.find(
                (b: any) => b.bookingId === bookingId
            );
        }

        if (booking) {
            setDayWiseBookingDetails(booking);
            setShowBookingDetailsModal(true);
        }
    };

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

    const deleteBooking = async (id: string) => {
        const response = await apiRequest({
            method: "delete",
            url: "/booking",
            params: {
                bookingId: id
            },
            token
        });
        console.log(response);
        if (response && !response?.error) {
            showSuccessToast(toastRef, "Success", "Booking deleted successfully. The space is now available.");
            setShowBookingDetailsModal(false);
            fetchBookingsForCalenderView();
        } else {
            // showErrorToast(toastRef, "Error", "Failed to delete booking. Please try again.");
            showErrorToast(toastRef, "Failed to delete booking. Please try again.", response?.error);
        }
    }

    const allPendingToFailure = async () => {
        const response = await apiRequest({
            method: "put",
            url: "/booking/change-status",
            data: {}
        });
        console.log(response);
        if (response && !response?.error) {
            fetchBookingsForCalenderView()
        }
    }

    useEffect(() => { allPendingToFailure() }, []);

    useEffect(() => { if (fromDate && toDate && selectedLaneData) fetchBookingsForCalenderView() }, [fromDate, toDate, selectedLaneData, token]);

    useEffect(() => { fetchAllLanes() }, []);

    return (
        <>

            <Toast ref={toastRef} />


            {loading ?
                (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100vh",
                            width: "100vw",
                            position: "fixed",
                            top: 0,
                            left: 0,
                            backgroundColor: "rgba(255, 255, 255, 0.8)",
                            zIndex: 9999,
                        }}
                    >
                        <ProgressSpinner strokeWidth="4" fill="var(--surface-ground)" animationDuration=".5s" />
                    </div>
                ) :
                (
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
                                            disabled={token ? false : date.getDate() <= today.getDate()}>
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
                                        onChange={(e) => {
                                            if (e.value) {
                                                setDate(e.value as Date);
                                                setFromDate(formatDateToISO(e.value));
                                                setToDate(formatDateToISO(e.value));
                                            } else {
                                                setFromDate("");
                                            }
                                        }}
                                        dateFormat="DD, MM dd, yy"
                                        inputClassName="date_selection_input"
                                        view="date"
                                        minDate={token ? undefined : today}
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
                                            disabled={token ? false : month.getMonth() === currentMonth && month.getFullYear() === currentYear}>
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
                                        onChange={(e) => {
                                            if (e.value) {
                                                const { from, to } = getMonthDateRange(new Date(e.value));
                                                setMonth(e.value as Date);
                                                setFromDate(from);
                                                setToDate(to);
                                            } else {
                                                setFromDate("");
                                                setToDate("");
                                            }
                                        }}
                                        view="month"
                                        dateFormat="MM yy"
                                        minDate={token ? undefined : today}
                                        readOnlyInput
                                        inputClassName="date_selection_input"
                                        showIcon
                                        iconPos="left"
                                        icon="bi bi-calendar2"
                                    />

                                </>
                            ) : null}

                        </div>

                        <div className="page_sub_header_area">
                            {Array.isArray(lanesData) && lanesData?.length > 0 && (
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
                                        key={`day_view_${date.getTime()}`} // Force re-render when date changes
                                        ref={dayViewModeRef}
                                        plugins={[timeGridPlugin, interactionPlugin]}
                                        initialView="timeGridDay"
                                        initialDate={date} // Set selected date
                                        headerToolbar={false}
                                        slotMinTime="08:00:00"
                                        slotMaxTime="23:00:00"
                                        allDaySlot={false}
                                        events={dayViewEvents}
                                        nowIndicator={true}
                                        eventClick={handleViewDayWiseBookingDetail}
                                        eventClassNames={"day_view_event"}
                                        height={"auto"}
                                        eventContent={(eventInfo) => {
                                            const { title, start, end } = eventInfo.event;
                                            const formattedStartTime = start ? format(new Date(start), "hh:mm a") : "";
                                            const formattedEndTime = end ? format(new Date(end), "hh:mm a") : "";
                                            return (
                                                <div className="booking_event p-ripple">
                                                    <i className="bi bi-person-fill"></i>
                                                    <div className="booking_event_detail">
                                                        <div className="booking_title">{title}</div>
                                                        <div className="booking_time">
                                                            {formattedStartTime} - {formattedEndTime}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                            ) : bookingViewMode === 'Month' ? (
                                <div className="booking_time_line_view day_mode">
                                    <FullCalendar
                                        key={month.getMonth() + monthViewEvents.length}
                                        plugins={[dayGridPlugin, interactionPlugin]}
                                        initialView="dayGridMonth"
                                        initialDate={month}
                                        events={monthViewEvents}
                                        headerToolbar={false}
                                        eventClassNames={'month_view_event'}
                                        height={'auto'}
                                        dayMaxEvents={2}
                                        // dayMaxEventRows={true}
                                        moreLinkClick="popover"
                                        moreLinkText="View More"
                                        eventClick={handleViewDayWiseBookingDetail}
                                        eventContent={(eventInfo) => {
                                            const { title, start, end } = eventInfo.event;
                                            const formattedStartTime = start ? format(new Date(start), "hh:mm a") : "";
                                            const formattedEndTime = end ? format(new Date(end), "hh:mm a") : "";
                                            return (
                                                <div className="booking_event p-ripple">
                                                    <i className="bi bi-person-fill"></i>
                                                    <div className="booking_event_detail">
                                                        <div className="booking_title">{title}</div>
                                                        <div className="booking_time">
                                                            {formattedStartTime} - {formattedEndTime}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }}
                                    />
                                </div>
                            ) : null}
                        </article>
                    </div>
                )
            }


            <BookingModal
                isOpen={showBookingModal}
                onClose={handleCloseBookingModal}
                toastRef={toastRef}
                fetchBookingsForCalenderView={fetchBookingsForCalenderView}
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
                                {token ? (
                                    <>
                                        <span>
                                            Name: {dayWiseBookingDetails?.userName}
                                        </span>
                                        <span>
                                            Phone Number: {dayWiseBookingDetails?.phoneNumber}
                                        </span>
                                    </>
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
                                    {(dayWiseBookingDetails?.startTime) + '-' + (dayWiseBookingDetails?.endTime)}
                                </span>
                            </div>

                            <hr />

                            <div className="booking_detail">
                                <i className="bi bi-info-circle-fill"></i>
                                {token ? (
                                    <>
                                        <span>
                                            Booking Title: {dayWiseBookingDetails?.bookingTitle || "----"}
                                        </span>
                                        <span>
                                            Booking Charge: ${dayWiseBookingDetails?.bookingPrice}
                                        </span>
                                        <span>
                                            Status: {dayWiseBookingDetails?.bookingStatus}
                                        </span>
                                    </>
                                ) : (
                                    <span className="font_light">
                                        Additional details are hidden or not available
                                    </span>
                                )}
                            </div>
                            {token && <>
                                <hr />

                                <div className="booking_detail">
                                    <Button
                                        label={`Delete Booking`}
                                        onClick={() => deleteBooking(dayWiseBookingDetails?.bookingId)}
                                        loading={false}
                                        severity="danger"
                                        disabled={false}
                                    />
                                </div>
                            </>}
                        </div>
                    )}
                </div>
            </Dialog>
        </>
    )
}

export default BookingCopy;
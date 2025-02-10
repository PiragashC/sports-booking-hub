import React, { useState, useEffect, useRef } from "react";

import { Ripple } from "primereact/ripple";
import { Toast } from "primereact/toast";
import { Calendar } from 'primereact/calendar';

import FullCalendar from "@fullcalendar/react";

import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";

import BookingModal from "./BookingModal";

import { Lane, BookingResponse } from "./BookingData";
import { Dialog } from "primereact/dialog";
import apiRequest from "../../Utils/apiRequest";

const BookingCopy: React.FC = () => {
    const toastRef = useRef<Toast>(null);
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
    const [fromDate, setFromDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [toDate, setToDate] = useState<string>(new Date().toISOString().split("T")[0]);
    const [calenderBookings, setCalenderBookings] = useState<BookingResponse[]>([]);

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
    }


    const fetchAllLanes = async () => {
        const response = await apiRequest({
            method: "get",
            url: "/booking/lanes"
        });
        console.log(response);
        setLanesData(Array.isArray(response) ? response.map((laneObj: any) => ({
            id: laneObj?.laneId || 0,
            name: laneObj?.laneName || ""
        })) : []);
        setSelectedLaneData(response && Array.isArray(response) && response[0] ? { id: response[0]?.laneId, name: response[0]?.laneName } : null);
    }

    const fetchBookingsForCalenderView = async () => {
        const response = await apiRequest({
            method: "get",
            url: "/booking/get-all-for-calender",
            params: {
                laneId: selectedLaneData?.id,
                fromDate,
                toDate
            }
        });

        console.log(response);
        if (bookingViewMode === 'Day') {
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
        }
    }

    console.log(dayViewEvents);


    const handleNavigatePrevDay = () => {
        if (date > today) {
            const prevDay = new Date(date);
            prevDay.setDate(prevDay.getDate() - 1);
            setDate(prevDay);
            setFromDate(new Date(prevDay.getTime() - prevDay.getTimezoneOffset() * 60000)
                .toISOString().split("T")[0]);
            setToDate(new Date(prevDay.getTime() - prevDay.getTimezoneOffset() * 60000)
                .toISOString().split("T")[0]);
        }

        setSelectedLaneData(lanesData[0]);
    };


    const handleNavigateNextDay = () => {
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        setDate(nextDay);
        setFromDate(new Date(nextDay.getTime() - nextDay.getTimezoneOffset() * 60000)
            .toISOString().split("T")[0]);
        setToDate(new Date(nextDay.getTime() - nextDay.getTimezoneOffset() * 60000)
            .toISOString().split("T")[0]);

        setSelectedLaneData(lanesData[0]);
    };


    const handleViewDayWiseBookingDetail = (detail: any) => {
        const bookingId = detail.event.id;
        const booking = calenderBookings?.find(data => data?.bookingId === bookingId);

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

    useEffect(() => { if (fromDate && toDate && selectedLaneData) fetchBookingsForCalenderView() }, [fromDate, toDate, selectedLaneData]);

    useEffect(() => { fetchAllLanes() }, []);

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
                                onChange={(e) => {
                                    if (e.value) {
                                        setDate(e.value as Date);
                                        setFromDate(new Date(e.value.getTime() - e.value.getTimezoneOffset() * 60000)
                                            .toISOString().split("T")[0]);
                                        setToDate(new Date(e.value.getTime() - e.value.getTimezoneOffset() * 60000)
                                            .toISOString().split("T")[0]);
                                    } else {
                                        setFromDate("");
                                    }
                                }}
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
                            {/* <FullCalendar
                                key={`day_view_${date.getTime()}`}
                                ref={dayViewModeRef}
                                plugins={[timeGridPlugin, interactionPlugin]}
                                initialView="timeGridDay"
                                headerToolbar={false}
                                slotMinTime="00:00:00"
                                slotMaxTime="23:59:59"
                                allDaySlot={false}
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
                            /> */}
                            <FullCalendar
                                key={`day_view_${date.getTime()}`} // Force re-render when date changes
                                ref={dayViewModeRef}
                                plugins={[timeGridPlugin, interactionPlugin]}
                                initialView="timeGridDay"
                                initialDate={date} // Set selected date
                                headerToolbar={false}
                                slotMinTime="00:00:00"
                                slotMaxTime="23:59:59"
                                allDaySlot={false}
                                events={dayViewEvents} // Pass events for the selected date
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
                            {/* <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="timeGridMonth"
                                events={monthViewEvents}
                                headerToolbar={{
                                    left: "prev,next today",
                                    center: "title",
                                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                                }}
                                height="auto"
                            /> */}
                        </div>
                    ) : null}
                </article>
            </div>

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
                                {dayWiseBookingDetails?.userName ? (
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
                                    {(dayWiseBookingDetails?.startTime) + '-' + (dayWiseBookingDetails?.endTime)}
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

export default BookingCopy;
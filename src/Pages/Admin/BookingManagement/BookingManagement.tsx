import React, { useState, useEffect, useRef } from "react";
import './Css/BookingManagement.css';
import './Css/BookingManagement-responsive.css';

import { Ripple } from "primereact/ripple";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { FormEvent, Nullable } from "primereact/ts-helpers";
import { Dropdown, DropdownChangeEvent, DropdownProps } from 'primereact/dropdown';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from "primereact/tooltip";
import { formatTime, showErrorToast, showSuccessToast } from "../../../Utils/commonLogic";

import { Bookings, Lane } from "../SampleData";
import { confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { timeList, TimeList } from "../../../Utils/SiteData";
import apiRequest from "../../../Utils/Axios/apiRequest";
import { useSelector } from "react-redux";
import { formatDate, formatDateToISO } from "../../../Utils/commonLogic";
import { fetchLanes } from "../../../Utils/commonService";
import { Divider } from "primereact/divider";
import BookingStep2 from "../../../Components/Booking/BookingStep2";
import SkeletonLoader, { SkeletonLayout } from "../../../Components/SkeletonLoader";
import { Link } from "react-router-dom";

type BookingType = "Online" | "Offline";
interface BookingFormData {
    email: string;
    fromTime: string;
    toTime: string;
    bookingTitle?: string;
    // bookingDetails?: string;
    firstName: string;
    lastName: string;
    telephoneNumber?: string;
    organization?: string;
    selectedLanesDtos: string[];
    bookingDatesDtos: string[];
    bookingType: BookingType;
}

interface BookingData {
    id: string;
    email: string;
    fromTime: string;
    toTime: string;
    laneDtos: { laneName: string, laneId: string }[];
    bookingDatesDtos: string[];
    bookingTitle?: string;
    firstName?: string;
    lastName?: string;
    telephoneNumber: string;
    organization?: string;
    bookingStatus: string;
    bookingType: string;
    bookingPrice: number;
}

const BookingManagement: React.FC = () => {
    const bookingStep2Ref = useRef<{ handleConfirmBooking: (e?: React.FormEvent) => void } | null>(null);
    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
    const today = new Date();
    const { from, to } = { from: formatDate(today), to: formatDate(today) };
    const [fromDate, setFromDate] = useState<string>(from);
    const [toDate, setToDate] = useState<string>(to);
    const [paginationParams, setPaginationParams] = useState<{ first: number, page: number; size: number }>({
        first: 0,
        page: 1,
        size: 10,
    });
    const [bookingLoading, setBookingLoading] = useState<boolean>(true);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [rowPerPage, setRowsPerPage] = useState<number[]>([5]);
    const [bookingTypes, setBookingTypes] = useState<string[]>([]);
    const toastRef = useRef<Toast>(null);
    const dateRangeRef = useRef(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataState, setDataState] = useState<'Add' | 'Edit'>('Add');
    const [isRequired, setIsRequired] = useState<boolean>(false);

    const [dates, setDates] = useState<Nullable<(Date | null)[]>>([today]);
    const [bookingState, setBookingState] = useState<string>('');
    const [lanesData, setLanesData] = useState<Lane[]>([]);
    const [selectedLane, setSelectedLane] = useState<Lane | null>(null);
    const [bookingStatuses, setBookingStatuses] = useState<string[]>([]);
    const [status, setStatus] = useState<string | null>(null);
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
    const [showBookingViewModal, setShowBookingViewModal] = useState<boolean>(false);

    const [bookingsData, setBookingsData] = useState<Bookings[]>([]);
    const [selectedBookingData, setSelectedBookingData] = useState<BookingData | null>(null);
    const [bookingStep, setBookingStep] = useState<number>(1);

    /* Booking fields */
    const [bookingDates, setBookingDates] = useState<Nullable<Date[]>>(null);
    const [lanesListData, setLanesListData] = useState<Lane[]>([]);
    const [bookingPrice, setBookingPrice] = useState<number>(0);
    const [bookingLanes, setBookingLanes] = useState<Lane[]>([]);
    const [selectedBookingLanes, setSelectedBookingLanes] = useState<Lane[]>([]);
    const [timeListData, setTimeListData] = useState<TimeList[]>([]);
    const [isValidNumber, setIsValidNumber] = useState<boolean>(true);
    const [editId, setEditId] = useState<string>('');
    const [skeletonLoading, setSkeletonLoading] = useState<boolean>(false);

    const initialBookingFormData = {
        email: '',
        fromTime: '',
        toTime: '',
        bookingTitle: '',
        // bookingDetails: '',
        firstName: '',
        lastName: '',
        telephoneNumber: '',
        organization: '',
        selectedLanesDtos: [],
        bookingDatesDtos: [],
        bookingType: "Offline" as BookingType,
        promoCode: ''
    }
    const [bookingFormData, setBookingFormData] = useState<BookingFormData>(initialBookingFormData);

    const bookingSkeletonLayout: SkeletonLayout = {
        type: "column",
        items: [
            { width: "150px", height: "20px", className: "mb-3" }, // Booking Details Heading
            {
                type: "row",
                items: [
                    { width: "45%", height: "20px", className: "mb-3 col-12 col-lg-6" }, // Start Time
                    { width: "45%", height: "20px", className: "mb-3 col-12 col-lg-6" }, // End Time
                ],
            },
            {
                type: "row",
                items: [
                    { width: "45%", height: "20px", className: "mb-3 col-12 col-lg-6" }, // Lanes
                    { width: "45%", height: "20px", className: "mb-3 col-12 col-lg-6" }, // Dates
                ],
            },
            {
                type: "row",
                items: [
                    { width: "45%", height: "20px", className: "mb-0 col-12 col-lg-6" }, // Title
                ],
            },
            {
                type: "row",
                items: [
                    { width: "45%", height: "20px", className: "mb-3 col-12 col-lg-6" }, // Organization
                    { width: "45%", height: "20px", className: "mb-3 col-12 col-lg-6" }, // Status
                ],
            },
            {
                type: "row",
                items: [
                    { width: "45%", height: "20px", className: "mb-3 col-12 col-lg-6" }, // Type
                    { width: "45%", height: "20px", className: "mb-3 col-12 col-lg-6" }, // Price
                ],
            },
            { width: "100%", height: "1px", className: "mt-4 mb-4" }, // Divider

            { width: "150px", height: "20px", className: "mb-3" }, // Customer Details Heading
            {
                type: "row",
                items: [
                    { width: "45%", height: "20px", className: "mb-3 col-12 col-lg-6" }, // Customer Name
                    { width: "45%", height: "20px", className: "mb-3 col-12 col-lg-6" }, // Email
                ],
            },
            {
                type: "row",
                items: [
                    { width: "45%", height: "20px", className: "mb-0 col-12 col-lg-6" }, // Mobile Number
                ],
            },
        ],
    };

    const bookingFormSkeletonLayout: SkeletonLayout = {
        type: "column",
        items: [
            { width: "150px", height: "20px", className: "mb-3" }, // Booking Details Heading
            {
                type: "row",
                items: [
                    { width: "45%", height: "40px", className: "mb-3 col-12 col-lg-6" }, // Start Time
                    { width: "45%", height: "40px", className: "mb-3 col-12 col-lg-6" }, // End Time
                ],
            },
            {
                type: "row",
                items: [
                    { width: "45%", height: "40px", className: "mb-3 col-12 col-lg-6" }, // Lanes
                    { width: "45%", height: "40px", className: "mb-3 col-12 col-lg-6" }, // Dates
                ],
            },
            {
                type: "row",
                items: [
                    { width: "45%", height: "40px", className: "mb-0 col-12 col-lg-6" }, // Title
                ],
            },
            {
                type: "row",
                items: [
                    { width: "45%", height: "40px", className: "mb-3 col-12 col-lg-6" }, // Organization
                    { width: "45%", height: "40px", className: "mb-3 col-12 col-lg-6" }, // Status
                ],
            },
            {
                type: "row",
                items: [
                    { width: "45%", height: "40px", className: "mb-3 col-12 col-lg-6" }, // Type
                    { width: "45%", height: "40px", className: "mb-3 col-12 col-lg-6" }, // Price
                ],
            },
            { width: "100%", height: "1px", className: "mt-4 mb-4" }, // Divider

            { width: "150px", height: "20px", className: "mb-3" }, // Customer Details Heading
            {
                type: "row",
                items: [
                    { width: "45%", height: "40px", className: "mb-3 col-12 col-lg-6" }, // Customer Name
                    { width: "45%", height: "40px", className: "mb-3 col-12 col-lg-6" }, // Email
                ],
            },
            {
                type: "row",
                items: [
                    { width: "45%", height: "40px", className: "mb-0 col-12 col-lg-6" }, // Mobile Number
                ],
            },
        ],
    };

    useEffect(() => {
        if (showBookingModal) {
            setTimeListData(timeList);
        }
    }, [showBookingModal]);

    const handleSwitchBookingState = (state: string) => {
        setBookingState(state);
    }

    const statusOptionTemplate = (option: string) => {
        return (
            <span className="text_bold">
                {option === 'Success' ? (
                    <i className="bi bi-check-circle-fill me-2 text_success"></i>
                ) : option === 'Pending' ? (
                    <i className="bi bi-exclamation-circle-fill me-2 text_warning"></i>
                ) : option === 'Failure' ? (
                    <i className="bi bi-x-circle-fill me-2 text_danger"></i>
                ) : null}
                {option}
            </span>
        );
    };

    const statusValueTemplate = (option: string, props: DropdownProps) => {
        if (option) {
            return (
                <span className="text_bold">
                    {option === 'Success' ? (
                        <i className="bi bi-check-circle-fill me-2 text_success"></i>
                    ) : option === 'Pending' ? (
                        <i className="bi bi-exclamation-circle-fill me-2 text_warning"></i>
                    ) : option === 'Failure' ? (
                        <i className="bi bi-x-circle-fill me-2 text_danger"></i>
                    ) : null}
                    {option}
                </span>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
        setBookingStep(1);
        setLoading(false);
        setTimeListData([]);
        setLanesListData([]);
        setBookingPrice(0);
        setBookingDates(null);
        setBookingLanes([]);
        setBookingFormData(initialBookingFormData);
        setIsRequired(false);
        setIsValidNumber(true);
        setSelectedBookingLanes([]);
        setDataState("Add");
        setEditId("");
    }


    const handleNewBooking = () => {
        setShowBookingModal(true);
        setDataState('Add');
    }

    const handleCreateBooking = async () => {
        if (bookingStep2Ref.current) {
            bookingStep2Ref.current.handleConfirmBooking();
        }
    }

    const handleEditBooking = (data: Bookings) => {
        if (data && data.id) {
            setBookingFormData(initialBookingFormData);
            setShowBookingModal(true);
            setDataState('Edit');
            getBookingById(data.id, 'Edit');
            setEditId(data.id);
        }
    }

    const updateBooking = async () => {
        setLoading(true);
        const payload = {
            id: editId,
            email: bookingFormData?.email || "",
            fromTime: bookingFormData?.fromTime,
            toTime: bookingFormData?.toTime,
            selectedLanesDtos: bookingFormData?.selectedLanesDtos,
            bookingDatesDtos: bookingFormData?.bookingDatesDtos,
            bookingTitle: bookingFormData?.bookingTitle,
            firstName: bookingFormData?.firstName,
            lastName: bookingFormData?.lastName,
            telephoneNumber: bookingFormData?.telephoneNumber,
            organization: bookingFormData?.organization
        }
        const response: any = await apiRequest({
            method: "put",
            url: "/booking/update",
            data: payload,
        });

        console.log(response);
        if (response && !response?.error) {
            showSuccessToast(toastRef, "Booking updated successfully!", "");
            handleCloseBookingModal();
            fetchBookingsForFilters();
        } else {
            showErrorToast(toastRef, " Booking Update Failed", response?.error);
        }
        setLoading(false);
    }

    const handleUpdateBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        updateBooking();
    }

    const handleDeleteBooking = (data: Bookings) => {
        const bookingId: string = data?.id!;

        confirmDialog({
            message: 'Are you sure you want to delete this booking?',
            header: 'Confirm the deletion',
            headerClassName: 'confirmation_danger',
            icon: 'bi bi-info-circle',
            defaultFocus: 'accept',
            acceptClassName: 'p-button-danger',
            dismissableMask: true,
            accept: () => deleteBooking(bookingId),
        });
    }

    const handleCloseBookingViewModal = () => {
        setShowBookingViewModal(false);
        setSelectedBookingData(null);
    }

    const handleViewBooking = (data: Bookings) => {
        setDataState('Add');
        if (data && data.id) {
            setSelectedBookingData(null);
            setShowBookingViewModal(true);
            getBookingById(data.id, 'View');
        }
    }

    const getRowClassName = (options: { [key: string]: any }) => {
        return 'table_data_row secondary';
    };

    const tableActionBody = (rowData: Bookings) => {
        const data = rowData;
        return (
            <>
                <Tooltip target=".data_action_btn" />
                <div className="tabel_btn_area custom">
                    <button
                        type="button"
                        title="View"
                        data-pr-tooltip={`View Booking`}
                        data-pr-position="top"
                        data-pr-classname="custom_tooltip"
                        className="data_action_btn secondary p-ripple"
                        onClick={() => handleViewBooking(data)}>
                        <i className="bi bi-eye"></i>
                        <Ripple />
                    </button>

                    <button
                        type="button"
                        title="Edit"
                        data-pr-tooltip={`Edit Booking`}
                        data-pr-position="top"
                        data-pr-classname="custom_tooltip"
                        className="data_action_btn primary p-ripple"
                        disabled={data.status === 'Failure'}
                        onClick={() => handleEditBooking(data)}>
                        <i className="bi bi-pencil-square"></i>
                        <Ripple />
                    </button>

                    <button
                        type="button"
                        title="Delete"
                        data-pr-tooltip={`Delete Booking`}
                        data-pr-position="top"
                        data-pr-classname="custom_tooltip"
                        className="data_action_btn danger p-ripple"
                        onClick={() => handleDeleteBooking(data)}
                    >
                        <i className="bi bi-trash3"></i>
                        <Ripple />
                    </button>
                </div>
            </>
        )
    };

    const bookingModalHeader = (
        <div className="custom_modal_header_inner">
            <h5 className="modal-title fs-5">
                {bookingStep === 3 ? (
                    <>
                        <i className="bi bi-credit-card me-2 modal_head_icon"></i>
                        Payment
                    </>
                ) : dataState === 'Add' ? (
                    <>
                        <i className="bi bi-calendar-plus me-2 modal_head_icon"></i>
                        New booking
                    </>
                ) : dataState === 'Edit' ? (
                    <>
                        <i className="bi bi-pencil-square me-2 modal_head_icon"></i>
                        Edit booking
                    </>
                ) : null}
            </h5>
            <button
                type="button"
                aria-label="Close"
                className="close_modal_btn p-ripple"
                onClick={handleCloseBookingModal}
            >
                <i className="bi bi-x-circle"></i>
                <Ripple />
            </button>
        </div>
    )

    const bookingModalFooter = (
        <div className="custom_modal_footer">
            <Button
                label="Cancel"
                className="custom_btn secondary"
                onClick={handleCloseBookingModal}
            />

            <Button
                label={`${loading ? 'Processing' : dataState === 'Add' ? 'Confirm Booking' : 'Update Existing Booking'}`}
                onClick={dataState === 'Add' ? handleCreateBooking : handleUpdateBooking}
                loading={loading}
                className="custom_btn primary"
            />
        </div>
    );

    const getValidEndTimes = (startTime?: string) => {
        if (!startTime) return [];

        const startIndex = timeList.findIndex((time) => time.value === startTime);
        if (startIndex === -1) return [];

        // Ensure the end times maintain the same minute part (e.g., :30 stays :30)
        return timeList.filter((_, index) => index > startIndex && (index - startIndex) % 2 === 0);
    };

    const statusDisplayBody = (rowData: Bookings) => {
        const status = rowData.status;
        return (
            <div className="flex_center">
                <span className={`status_display_label ${status === 'Success' ? ' success' : status === 'Pending' ? ' warning' : ' danger'}`}>
                    <i className={`bi ${status === 'Success' ? ' bi-check-circle-fill' : status === 'Pending' ? ' bi-exclamation-circle-fill' : ' bi-x-circle-fill'} me-2`}></i>
                    {status}
                </span>
            </div>
        )
    }

    const bookingViewModalHeader = (
        <div className="custom_modal_header_inner">
            <h1 className="modal-title fs-5">
                Booking Info
            </h1>
            <button
                type="button"
                aria-label="Close"
                className="close_modal_btn p-ripple"
                onClick={() => setShowBookingViewModal(false)}
            >
                <i className="bi bi-x-circle"></i>
                <Ripple />
            </button>
        </div>
    )

    const onPage = (event: DataTableStateEvent) => {
        setPaginationParams((prev) => ({
            ...prev,
            first: event.first,
            page: event && event?.page ? event.page + 1 : 1,
            size: event.rows,
        }));
    };

    const getBookingById = async (bookingId: string, type: 'Edit' | 'View') => {
        setSkeletonLoading(true);
        const response = await apiRequest({
            method: "get",
            url: `/booking/get-by-id/${bookingId}`,
            token
        });

        if (response && !response?.error) {
            if (type === "Edit") {
                setBookingFormData({
                    email: response?.email || '',
                    fromTime: response?.fromTime || '',
                    toTime: response?.toTime || '',
                    bookingTitle: response?.bookingTitle || '',
                    firstName: response?.firstName || '',
                    lastName: response?.lastName || '',
                    telephoneNumber: response?.telephoneNumber || '',
                    organization: response?.organization || '',
                    selectedLanesDtos: response?.laneDtos && Array.isArray(response?.laneDtos) && response?.laneDtos?.length > 0 ? response?.laneDtos?.map((lnObj: { laneId: string, laneName: string }) => lnObj.laneId) : [],
                    bookingDatesDtos: response?.bookingDatesDtos || [],
                    bookingType: "Offline"
                })
                setBookingDates(response?.bookingDatesDtos && Array.isArray(response?.bookingDatesDtos) ? response?.bookingDatesDtos.map((dateStr: string) => new Date(dateStr)) : []);
                setSelectedBookingLanes(response?.laneDtos && Array.isArray(response?.laneDtos) && response?.laneDtos?.length > 0 ? response?.laneDtos?.map((lnObj: { laneId: string, laneName: string }) => { return { id: lnObj.laneId, name: lnObj.laneName } }) : []);
            } else if (type === 'View') {
                setSelectedBookingData(response);
            }
        } else {
            setSelectedBookingData(null);
            setBookingFormData(initialBookingFormData);
        }
        setSkeletonLoading(false);
    }

    const deleteBooking = async (id: string) => {
        const response = await apiRequest({
            method: "delete",
            url: "/booking/delete",
            params: {
                bookingId: id
            },
            token
        });
        console.log(response);
        if (response && !response?.error) {
            showSuccessToast(toastRef, "Success", "Booking deleted successfully. The space is now available.");
            fetchBookingsForFilters();
        } else {
            showErrorToast(toastRef, "Failed to delete booking. Please try again.", response?.error);
        }
    }


    const fetchAllLanes = async () => {
        const lanes = await fetchLanes();
        setLanesData(lanes);
    }

    const fetchAllBookingTypes = async () => {
        const response = await apiRequest({
            method: "get",
            url: "/booking/booking-type",
            token
        });
        if (response && !response?.error) {
            setBookingTypes(response?.bookingType || []);
            setBookingState(response?.bookingType ? response.bookingType[0] : "");
        }
    }


    const fetchAllBookingStatus = async () => {
        const response = await apiRequest({
            method: "get",
            url: "/booking/booking-status",
            token
        });
        if (response && !response?.error) {
            setBookingStatuses(response?.bookingStatus || []);
        }
    }

    const fetchBookingsForFilters = async () => {
        setBookingLoading(true);
        const response = await apiRequest({
            method: "get",
            url: "/booking/get-all-booking-details",
            token,
            params: {
                fromDate,
                toDate,
                page: paginationParams.page,
                size: paginationParams.size,
                ...(bookingState && { type: bookingState }),
                ...(selectedLane && { laneId: selectedLane.id }),
                ...(status && { status })
            }
        });
        console.log(response);
        if (response && !response?.error) {
            setBookingsData(response?.data);
            setTotalRecords(response?.totalItems);
            const newRowPerPage = ([5, 10, 25, 50].filter(x => x < Number(response?.totalItems)));
            setRowsPerPage([...newRowPerPage, Number(response?.totalItems)])
        } else {
            setBookingsData([]);
        }
        setBookingLoading(false);
    };

    const onSuccessFnCall = async (response: any) => {
        handleCloseBookingModal();
    }

    useEffect(() => { fetchAllBookingTypes(); fetchAllLanes(); fetchAllBookingStatus(); }, []);

    useEffect(() => { if (fromDate && toDate && paginationParams.page && paginationParams.size && bookingState) fetchBookingsForFilters(); }, [fromDate, toDate, paginationParams, bookingState, selectedLane, status]);

    return (
        <>
            <Toast ref={toastRef} />
            <div>
                <div className="page_header_section">
                    <h4 className="page_heading">Bookings</h4>

                    <button
                        className="new_data_button m-0 is_btn p-ripple"
                        aria-label="New booking"
                        onClick={handleNewBooking}>
                        <i className="bi bi-calendar-plus"></i>
                        <span>New booking</span>
                        <Ripple />
                    </button>
                </div>

                <div className="filter_area mt-3">
                    <div className="row filter_area_row">
                        <div className="col-12 col-xxl-4 col-xl-4 col-sm-6">
                            <div className="filter_option_group">
                                <div className="filter_tab_group">
                                    {bookingTypes &&
                                        Array.isArray(bookingTypes) &&
                                        bookingTypes.length > 0 &&
                                        bookingTypes.map((bookingType) => (
                                            <button
                                                key={bookingType}
                                                className={`filter_tab p-ripple ${bookingState === bookingType ? 'active' : ''}`}
                                                type="button"
                                                onClick={() => handleSwitchBookingState(bookingType)}
                                            >
                                                {bookingType}
                                                <Ripple />
                                            </button>
                                        ))}
                                </div>

                            </div>
                        </div>
                        <div className="col-12 col-xxl-3 col-xl-4 col-sm-6">
                            <div className="filter_option_group">
                                <Calendar
                                    key="day-calendar"
                                    ref={dateRangeRef}
                                    value={dates}
                                    onChange={(e) => {
                                        if (e.value && Array.isArray(e.value) && e.value[0]) {
                                            const fromDateValue = formatDateToISO(e.value[0]);
                                            const toDateValue = e.value[1] ? formatDateToISO(e.value[1]) : fromDateValue;

                                            setDates(e.value);
                                            setFromDate(fromDateValue);
                                            setToDate(toDateValue);
                                        }
                                    }}
                                    selectionMode="range"
                                    inputClassName="date_selection_input"
                                    className="date_picker_input"
                                    readOnlyInput
                                    hideOnRangeSelection
                                    view="date"
                                    showIcon
                                    iconPos='left'
                                    icon='bi bi-calendar-range'
                                    placeholder="Select date range"
                                />
                            </div>
                        </div>

                        <div className="col-12 col-xxl-3 col-xl-4 col-sm-6">
                            <div className="filter_option_group">
                                <Dropdown
                                    value={selectedLane}
                                    onChange={(e: DropdownChangeEvent) => setSelectedLane(e.value)}
                                    options={lanesData}
                                    optionLabel="name"
                                    placeholder="Select a Lane"
                                    className="filter_dropdown_input"
                                    showClear
                                />
                            </div>
                        </div>

                        <div className="col-12 col-xxl-2 col-xl-4 col-sm-6">
                            <div className="filter_option_group mt-xxl-0 mt-xl-3">
                                <Dropdown
                                    value={status}
                                    onChange={(e: DropdownChangeEvent) => setStatus(e.value)}
                                    options={bookingStatuses}
                                    itemTemplate={statusOptionTemplate}
                                    valueTemplate={statusValueTemplate}
                                    placeholder="Select status"
                                    className="filter_dropdown_input"
                                    showClear
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="page_content_section pb-0">
                    <DataTable
                        value={bookingsData}
                        lazy
                        paginator
                        rows={paginationParams.size}
                        first={paginationParams.first}
                        totalRecords={totalRecords}
                        onPage={onPage}
                        loading={bookingLoading}
                        size="small"
                        rowsPerPageOptions={rowPerPage}
                        tableStyle={{ minWidth: "50rem" }}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}"
                        className="page_table p-0 p-sm-1 pb-sm-0"
                        rowClassName={getRowClassName}
                        rowHover
                        emptyMessage="No Bookings found!"
                    >

                        <Column
                            header="Booking no."
                            field="bookingNumber"
                            body={(rowData: Bookings) => (
                                <span className="text_bold text_no_wrap">
                                    {rowData?.bookingNumber || "---"}
                                </span>
                            )}
                            style={{ width: "15%" }}
                        />

                        <Column
                            header="Date"
                            field="date"
                            body={(rowData: Bookings) => (
                                <span className="text_no_wrap">{rowData?.date || "---"}</span>
                            )}
                            style={{ width: "15%" }}
                        />

                        <Column
                            header="Time"
                            body={(rowData: Bookings) => (
                                <span className="text_no_wrap">
                                    {rowData?.fromTime && rowData?.toTime
                                        ? `${formatTime(rowData.fromTime)} - ${formatTime(rowData.toTime)}`
                                        : "---"}
                                </span>
                            )}
                            style={{ width: "20%" }}
                        />

                        <Column
                            header="Status"
                            field="status"
                            alignHeader="center"
                            body={statusDisplayBody}
                            style={{ width: "15%" }}
                        />

                        <Column alignHeader="center" body={tableActionBody} style={{ width: "10%" }} />
                    </DataTable>
                </div>
            </div>

            {/* Booking modal */}
            <Dialog
                visible={showBookingModal}
                header={bookingModalHeader}
                footer={bookingStep !== 2 && bookingModalFooter}
                headerClassName="custom_modal_header"
                className={`custom_modal_dialog modal_dialog_md`}
                onHide={handleCloseBookingModal}
                closable={false}
            >
                <div className="custom_modal_body">
                    {bookingStep === 1 ? (
                        !skeletonLoading ?
                            <BookingStep2
                                ref={bookingStep2Ref}
                                isValidNumber={isValidNumber}
                                setIsValidNumber={setIsValidNumber}
                                timeListData={timeListData}
                                setTimeListData={setTimeListData}
                                bookingPrice={bookingPrice}
                                setBookingPrice={setBookingPrice}
                                isRequired={isRequired}
                                setIsRequired={setIsRequired}
                                bookingLanes={bookingLanes}
                                setBookingLanes={setBookingLanes}
                                lanesListData={lanesListData}
                                setLanesListData={setLanesListData}
                                bookingDates={bookingDates}
                                setBookingDates={setBookingDates}
                                bookingFormData={bookingFormData}
                                setBookingFormData={setBookingFormData}
                                isOpen={showBookingModal}
                                toastRef={toastRef}
                                setLoading={setLoading}
                                fetchBookings={fetchBookingsForFilters}
                                onSuccessFnCall={onSuccessFnCall}
                                selectedBookingLanes={selectedBookingLanes}
                                setSelectedBookingLanes={setSelectedBookingLanes}
                                enableEditInterface={dataState === "Edit"}
                            /> : <SkeletonLoader layout={bookingFormSkeletonLayout} />
                    ) : bookingStep === 2 ? (
                        <>
                            <div className="payment_area">

                            </div>
                        </>
                    ) : null}
                </div>
            </Dialog>
            {/*  */}

            {/* Booking view modal */}
            <Dialog
                visible={showBookingViewModal}
                header={bookingViewModalHeader}
                className="custom-modal modal_dialog modal_dialog_md"
                headerClassName="custom_modal_header"
                onHide={handleCloseBookingViewModal}
                dismissableMask
            >
                {selectedBookingData ?
                    <div className="custom_modal_body">
                        <h5 className="data-view-head">
                            <i className="bi bi-calendar2-event-fill me-2"></i>
                            Booking Details
                        </h5>

                        <div className="data-view-area">
                            <div className="row">
                                <div className="col-5">
                                    <h6 className="data-view-title">Title :</h6>
                                </div>
                                <div className="col-7">
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.bookingTitle ? selectedBookingData?.bookingTitle : '-------'}
                                    </h6>
                                </div>
                            </div>

                            <Divider className="data-view-divider" />

                            <div className="row">
                                <div className="col-5">
                                    <h6 className="data-view-title">Start time :</h6>
                                </div>
                                <div className="col-7">
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.fromTime ? formatTime(selectedBookingData?.fromTime) : '-------'}
                                    </h6>
                                </div>
                            </div>

                            <Divider className="data-view-divider" />

                            <div className="row">
                                <div className="col-5">
                                    <h6 className="data-view-title">End time :</h6>
                                </div>
                                <div className="col-7">
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.toTime ? formatTime(selectedBookingData?.toTime) : '-------'}
                                    </h6>
                                </div>
                            </div>

                            <Divider className="data-view-divider" />

                            <div className="row">
                                <div className="col-5">
                                    <h6 className="data-view-title">Booking Date(s) :</h6>
                                </div>
                                <div className="col-7">
                                    <h6 className="data-view-data">
                                        {(selectedBookingData?.bookingDatesDtos && Array.isArray(selectedBookingData?.bookingDatesDtos) && selectedBookingData?.bookingDatesDtos?.length > 0) ?
                                            selectedBookingData?.bookingDatesDtos?.map((date) => (
                                                <span className="data-view-label">
                                                    {date}
                                                </span>
                                            ))
                                            : "-------"
                                        }
                                    </h6>
                                </div>
                            </div>

                            <Divider className="data-view-divider" />

                            <div className="row">
                                <div className="col-5">
                                    <h6 className="data-view-title">Lanes :</h6>
                                </div>
                                <div className="col-7">
                                    <h6 className="data-view-data">
                                        {(selectedBookingData?.laneDtos && Array.isArray(selectedBookingData?.laneDtos) && selectedBookingData?.laneDtos?.length > 0) ?
                                            selectedBookingData?.laneDtos?.map((lane) => (
                                                <span className="data-view-label">
                                                    {lane?.laneName}
                                                </span>
                                            ))
                                            : "-------"
                                        }
                                    </h6>
                                </div>
                            </div>

                            <Divider className="data-view-divider" />

                            <div className="row">
                                <div className="col-5">
                                    <h6 className="data-view-title">Organization :</h6>
                                </div>
                                <div className="col-7">
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.organization ? selectedBookingData?.organization : '-------'}
                                    </h6>
                                </div>
                            </div>

                            <Divider className="data-view-divider" />

                            <div className="row">
                                <div className="col-5">
                                    <h6 className="data-view-title">Status :</h6>
                                </div>
                                <div className="col-7">
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.bookingStatus ? (
                                            <span className={`status_display_label ${selectedBookingData?.bookingStatus === 'Success' ? ' success' : selectedBookingData?.bookingStatus === 'Pending' ? ' warning' : ' danger'}`}>
                                                <i className={`bi ${selectedBookingData?.bookingStatus === 'Success' ? ' bi-check-circle-fill' : selectedBookingData?.bookingStatus === 'Pending' ? ' bi-exclamation-circle-fill' : ' bi-x-circle-fill'} me-2`}></i>
                                                {selectedBookingData?.bookingStatus}
                                            </span>
                                        ) : (
                                            <span>-------</span>
                                        )}
                                    </h6>
                                </div>
                            </div>

                            <Divider className="data-view-divider" />

                            <div className="row">
                                <div className="col-5">
                                    <h6 className="data-view-title">Type :</h6>
                                </div>
                                <div className="col-7">
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.bookingType ? selectedBookingData?.bookingType : '-------'}
                                    </h6>
                                </div>
                            </div>

                            <Divider className="data-view-divider" />

                            <div className="row">
                                <div className="col-5">
                                    <h6 className="data-view-title">Price :</h6>
                                </div>
                                <div className="col-7">
                                    <h6 className="data-view-data">
                                        $&nbsp;{selectedBookingData?.bookingPrice ? (selectedBookingData?.bookingPrice.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) : '-------'}
                                    </h6>
                                </div>
                            </div>
                        </div>


                        <h5 className="data-view-head mt-4">
                            <i className="bi bi-person-fill me-2"></i>
                            Customer Details
                        </h5>

                        <div className="data-view-area">
                            <div className="row">
                                <div className="col-5">
                                    <h6 className="data-view-title">Name :</h6>
                                </div>
                                <div className="col-7">
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.firstName ? (selectedBookingData?.firstName + ' ' + selectedBookingData?.lastName) : '-------'}
                                    </h6>
                                </div>
                            </div>

                            <Divider className="data-view-divider" />

                            <div className="row">
                                <div className="col-5">
                                    <h6 className="data-view-title">Email :</h6>
                                </div>
                                <div className="col-7">
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.email ? (
                                            <Link to={`mailto: ${selectedBookingData?.email}`}>
                                                {selectedBookingData?.email}
                                            </Link>
                                        ) : (
                                            <span>-------</span>
                                        )}
                                    </h6>
                                </div>
                            </div>

                            <Divider className="data-view-divider" />

                            <div className="row">
                                <div className="col-5">
                                    <h6 className="data-view-title"> Mobile Number :</h6>
                                </div>
                                <div className="col-7">
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.telephoneNumber ? (
                                            <Link to={`tel: ${selectedBookingData?.telephoneNumber}`}>
                                                {selectedBookingData?.telephoneNumber}
                                            </Link>
                                        ) : (
                                            <span>-------</span>
                                        )}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div> : <SkeletonLoader layout={bookingSkeletonLayout} />}
            </Dialog >
            {/*  */}
        </>
    )
}

export default BookingManagement;
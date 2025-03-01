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
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";

import { goToTop } from "../../../Components/GoToTop";
import { formatTime, showErrorToast, showSuccessToast } from "../../../Utils/commonLogic";

import { Bookings, bookings, Lane, lanes } from "../SampleData";
import { confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { timeList, TimeList } from "../../../Utils/SiteData";
import TextInput from "../../../Components/TextInput";
import PhoneNumberInput from "../../../Components/PhoneNumberInput";
import apiRequest from "../../../Utils/apiRequest";
import { useSelector } from "react-redux";
import { formatDate, formatDateToISO } from "../../../Utils/commonLogic";
import { fetchLanes } from "../../../Utils/commonService";
import { Divider } from "primereact/divider";
import BookingStep2 from "../../../Components/Booking/BookingStep2";

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
    const [timeListData, setTimeListData] = useState<TimeList[]>([]);
    const [laneError, setLaneError] = useState<boolean>(false);
    const [isValidNumber, setIsValidNumber] = useState<boolean>(true);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

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
        bookingType: "Offline" as BookingType
    }
    const [bookingFormData, setBookingFormData] = useState<BookingFormData>(initialBookingFormData);

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
    }

    const handleNewBooking = () => {
        setShowBookingModal(true);
        setDataState('Add');
    }

    const handleClearBookingFields = () => {
    }

    const handleCreateBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    }

    const handleEditBooking = (data: Bookings) => {
        setShowBookingModal(true);
        setDataState('Edit');
    }

    const handleUpdateBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
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
        if (data && data.id) {
            setShowBookingViewModal(true);
            getBookingById(data.id);
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
                label={`${loading ? 'Processing' : dataState === 'Add' ? 'Next' : 'Update'}`}
                onClick={dataState === 'Add' ? handleCreateBooking : handleUpdateBooking}
                loading={loading}
                className="custom_btn primary"
            />
        </div>
    );

    const handleDateChange = (e: FormEvent<Date[], React.SyntheticEvent<Element, Event>>) => {
        if (e && e?.value) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            let selectedDates = e.value.map(date => {
                return new Date(date.getFullYear(), date.getMonth(), date.getDate());
            });

            const isTodaySelected = selectedDates.some(date => date.getTime() === today.getTime());

            // If today is selected, only today should be set; otherwise, remove today from the selection
            let finalDates: Date[];
            if (isTodaySelected) {
                finalDates = [today];
            } else {
                finalDates = selectedDates.filter(date => date.getTime() !== today.getTime());
            }

            // Format the dates correctly for form submission
            const formattedDates = finalDates.map(date =>
                formatDateToISO(date)
            );

            setLanesListData([]);
            setBookingLanes([]);
            setBookingFormData({
                ...bookingFormData,
                selectedLanesDtos: [],
                bookingDatesDtos: formattedDates
            });

            setBookingDates(finalDates);
        }
    }

    const handleClearBookingDates = () => {
    }

    const selectedStartTimeTemplate = (data: TimeList, props: DropdownProps) => {
        if (data) {
            return (
                <div className="d-flex align-items-center">
                    <div>From - {data.label}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const selectedEndTimeTemplate = (data: TimeList, props: DropdownProps) => {
        if (data) {
            return (
                <div className="d-flex align-items-center">
                    <div>To - {data.label}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const getValidEndTimes = (startTime?: string) => {
        if (!startTime) return [];

        const startIndex = timeList.findIndex((time) => time.value === startTime);
        if (startIndex === -1) return [];

        // Ensure the end times maintain the same minute part (e.g., :30 stays :30)
        return timeList.filter((_, index) => index > startIndex && (index - startIndex) % 2 === 0);
    };

    const endTimeOptions = getValidEndTimes(bookingFormData.fromTime);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBookingFormData({
            ...bookingFormData,
            [name]: value
        });
    }

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

    const bookingViewModalHeader = () => {
        return (
            <div className="modal-header p-2">
                <h1 className="modal-title fs-5" id="bookingDetailModalLabel">
                    Booking Info
                </h1>
                <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowBookingViewModal(false)}
                ></button>
            </div>
        )
    }

    const onPage = (event: DataTableStateEvent) => {
        setPaginationParams((prev) => ({
            ...prev,
            first: event.first,
            page: event && event?.page ? event.page + 1 : 1,
            size: event.rows,
        }));
    };

    const getBookingById = async (bookingId: string) => {
        const response = await apiRequest({
            method: "get",
            url: `/booking/get-by-id/${bookingId}`,
            token
        });
        console.log(response);
        if (response && !response?.error) {
            setSelectedBookingData(response);
        } else {
            setSelectedBookingData(null);
        }
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

    const onSuccessFnCall = () => {
        handleCloseBookingModal();
    }

    useEffect(() => { fetchAllBookingTypes(); fetchAllLanes(); fetchAllBookingStatus(); }, []);

    useEffect(() => { if (fromDate && toDate && paginationParams.page && paginationParams.size && bookingState) fetchBookingsForFilters(); }, [fromDate, toDate, paginationParams, bookingState, selectedLane, status]);

    return (
        <>
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
                    <div className="row">
                        <div className="col-12 col-xxl-4 col-xl-4">
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
                        <div className="col-12 col-xxl-3 col-xl-4">
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

                        <div className="col-12 col-xxl-3 col-xl-4">
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

                        <div className="col-12 col-xxl-2 col-xl-4">
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
                    <div className="card">
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
                        <BookingStep2
                            ref={bookingStep2Ref}
                            bookingFormData={bookingFormData}
                            setBookingFormData={setBookingFormData}
                            isOpen={showBookingModal}
                            toastRef={toastRef}
                            setLoading={setLoading}
                            fetchBookings={fetchBookingsForFilters}
                            onSuccessFnCall={onSuccessFnCall}
                        />
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
            <Dialog header={bookingViewModalHeader} visible={showBookingViewModal}
                onHide={() => { if (!showBookingViewModal) return; setShowBookingViewModal(false); }}
                className="custom-modal modal_dialog modal_dialog_md">
                <div className="modal-body p-2">
                    <div className="data-view-area">
                        <h5 className="data-view-head">Booking Details</h5>
                        <div className="row mt-4">
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">Start time :</h6>
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.fromTime}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">End time :</h6>
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.toTime}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">Lanes :</h6>
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.laneDtos && Array.isArray(selectedBookingData?.laneDtos) && selectedBookingData?.laneDtos?.length > 0 ? selectedBookingData?.laneDtos?.map(ln => ln.laneName).join(', ') : "-------"}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3 mb-lg-0">
                                    <h6 className="data-view-title">
                                        Dates :
                                    </h6>
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.bookingDatesDtos && Array.isArray(selectedBookingData?.bookingDatesDtos) && selectedBookingData?.bookingDatesDtos?.length > 0 ? selectedBookingData?.bookingDatesDtos?.join(', ') : "-------"}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-0">
                                    <h6 className="data-view-title">
                                        Title :
                                    </h6>
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.bookingTitle || "--------"}
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className="data-view-sub mt-3">
                            <div className="row">
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-3">
                                        <h6 className="data-view-title">Organization :</h6>
                                        <h6 className="data-view-data">
                                            {selectedBookingData?.organization || "-------"}
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-3">
                                        <h6 className="data-view-title">Status :</h6>
                                        <h6 className="data-view-data">
                                            {selectedBookingData?.bookingStatus}
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-3 mb-lg-0">
                                        <h6 className="data-view-title">Type :</h6>
                                        <h6 className="data-view-data">
                                            {selectedBookingData?.bookingType}
                                        </h6>
                                    </div>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <div className="data-view mb-0">
                                        <h6 className="data-view-title">Price :</h6>
                                        <h6 className="data-view-data">
                                            {selectedBookingData?.bookingPrice}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Divider className="mt-4 mb-4" />
                        <h5 className="data-view-head">Customer Details</h5>
                        <div className="row mt-4">
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">Name :</h6>
                                    {selectedBookingData?.firstName ? <h6 className="data-view-data">
                                        {selectedBookingData?.firstName + " " + selectedBookingData?.lastName}
                                    </h6> : <h6 className="data-view-data">
                                        --------
                                    </h6>}
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-3">
                                    <h6 className="data-view-title">
                                        Email :
                                    </h6>
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.email}
                                    </h6>
                                </div>
                            </div>
                            <div className="col-12 col-lg-6">
                                <div className="data-view mb-0">
                                    <h6 className="data-view-title">
                                        Mobile Number :
                                    </h6>
                                    <h6 className="data-view-data">
                                        {selectedBookingData?.telephoneNumber || "--------"}
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            {/*  */}
        </>
    )
}

export default BookingManagement;
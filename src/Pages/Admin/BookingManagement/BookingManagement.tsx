import React, { useState, useEffect, useRef } from "react";
import './Css/BookingManagement.css';
import './Css/BookingManagement-responsive.css';

import { Ripple } from "primereact/ripple";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { FormEvent, Nullable } from "primereact/ts-helpers";
import { Dropdown, DropdownChangeEvent, DropdownProps } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from "primereact/tooltip";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";

import { goToTop } from "../../../Components/GoToTop";
import { formatTime } from "../../../Utils/Common";

import { Bookings, bookings, Lane, lanes } from "../SampleData";
import { confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { timeList, TimeList } from "../../../Utils/SiteData";
import TextInput from "../../../Components/TextInput";
import PhoneNumberInput from "../../../Components/PhoneNumberInput";

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
}

const BookingManagement: React.FC = () => {
    const today = new Date();
    const toastRef = useRef<Toast>(null);
    const dateRangeRef = useRef(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataState, setDataState] = useState<'Add' | 'Edit'>('Add');
    const [isRequired, setIsRequired] = useState<boolean>(false);

    const [dates, setDates] = useState<Nullable<(Date | null)[]>>([today]);
    const [bookingState, setBookingState] = useState<'All' | 'Online' | 'Offline'>('All');
    const [lanesData, setLanesData] = useState<Lane[]>([]);
    const [selectedLane, setSelectedLane] = useState<Lane | null>(null);
    const [statuses] = useState<string[]>(['Success', 'Pending', 'Failed']);
    const [status, setStatus] = useState<string | null>(null);
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
    const [showBookingViewModal, setShowBookingViewModal] = useState<boolean>(false);

    const [bookingsData, setBookingsData] = useState<Bookings[]>([]);
    const [selectedBookingData, setSelectedBookingData] = useState<Bookings | null>(null);
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
        bookingDatesDtos: []
    }
    const [bookingFormData, setBookingFormData] = useState<BookingFormData>(initialBookingFormData);

    useEffect(() => {
        setLanesData(lanes);
        setBookingsData(bookings);
    }, []);

    useEffect(() => {
        if (showBookingModal) {
            setTimeListData(timeList);
        }
    }, [showBookingModal]);

    const handleSwitchBookingState = (state: 'All' | 'Online' | 'Offline') => {
        setBookingState(state);
    }

    const statusOptionTemplate = (option: string) => {
        return (
            <span className="text_bold">
                {option === 'Success' ? (
                    <i className="bi bi-check-circle-fill me-2 text_success"></i>
                ) : option === 'Pending' ? (
                    <i className="bi bi-exclamation-circle-fill me-2 text_warning"></i>
                ) : option === 'Failed' ? (
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
                    ) : option === 'Failed' ? (
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

    const deleteBooking = async (bookingId: string) => {
    }

    const handleCloseBookingViewModal = () => {
        setShowBookingViewModal(false);
        setSelectedBookingData(null);
    }

    const handleViewBooking = (data: Bookings) => {
        setSelectedBookingData(data || null);
        setShowBookingViewModal(true);
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
                new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                    .toISOString()
                    .split("T")[0]
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
                                    <button
                                        className={`filter_tab p-ripple ${bookingState === 'All' && 'active'}`}
                                        type="button"
                                        onClick={() => handleSwitchBookingState('All')}>
                                        All
                                        <Ripple />
                                    </button>

                                    <button
                                        className={`filter_tab p-ripple ${bookingState === 'Online' && 'active'}`}
                                        type="button"
                                        onClick={() => handleSwitchBookingState('Online')}>
                                        Online
                                        <Ripple />
                                    </button>

                                    <button
                                        className={`filter_tab p-ripple ${bookingState === 'Offline' && 'active'}`}
                                        type="button"
                                        onClick={() => handleSwitchBookingState('Offline')}>
                                        Offline
                                        <Ripple />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-xxl-3 col-xl-4">
                            <div className="filter_option_group">
                                <Calendar
                                    key="day-calendar"
                                    ref={dateRangeRef}
                                    value={dates}
                                    onChange={(e) => setDates(e.value)}
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
                                    options={statuses}
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
                    {bookingsData && bookingsData?.length > 0 ? (
                        <>
                            <DataTable
                                value={bookingsData}
                                paginator
                                size="small"
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                tableStyle={{ minWidth: '50rem' }}
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                                className="page_table p-0 p-sm-1 pb-sm-0"
                                rowHover
                                rowClassName={getRowClassName}
                            >
                                <Column
                                    header="Booking no."
                                    field="bookingNumber"
                                    body={(rowData: Bookings) => (
                                        <span className="text_bold text_no_wrap">
                                            {rowData?.bookingNumber ? rowData?.bookingNumber : '---'}
                                        </span>
                                    )}
                                    style={{ width: '15%' }}
                                ></Column>

                                <Column
                                    header="Date"
                                    field="date"
                                    body={(rowData: Bookings) => (
                                        <span className="text_no_wrap">
                                            {rowData?.date ? rowData?.date : '---'}
                                        </span>
                                    )}
                                    style={{ width: '15%' }}
                                ></Column>

                                <Column
                                    header="Time"
                                    body={(rowData: Bookings) => (
                                        <span className="text_no_wrap">
                                            {(rowData?.fromTime && rowData?.toTime) ?
                                                (formatTime(rowData?.fromTime) + ' - ' + formatTime(rowData?.toTime))
                                                : '---'}
                                        </span>
                                    )}
                                    style={{ width: '20%' }}
                                ></Column>

                                <Column
                                    header="Status"
                                    field="status"
                                    alignHeader={'center'}
                                    body={statusDisplayBody}
                                    style={{ width: '15%' }}
                                ></Column>

                                <Column
                                    alignHeader="center"
                                    body={tableActionBody}
                                    style={{ width: '10%' }}
                                ></Column>
                            </DataTable>
                        </>
                    ) : (
                        <>
                        </>
                    )}
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
                        <>
                            <div className="booking_form_area">
                                <h5 className="form_title">Booking details</h5>

                                <div className="row">
                                    {/* Date */}
                                    <div className="col-12">
                                        <div className="page_form_group">
                                            <label htmlFor='bookingDate' className={`custom_form_label is_required`}>Date</label>
                                            <div className="multi_date_input_group">
                                                <Calendar
                                                    inputId="bookingDate"
                                                    value={bookingDates}
                                                    onChange={handleDateChange}
                                                    selectionMode="multiple"
                                                    readOnlyInput
                                                    placeholder="Select date(s)"
                                                    className="multi_date_input_area w-100"
                                                    inputClassName="multi_date_input"
                                                    minDate={new Date()}
                                                />
                                                {bookingDates && bookingDates?.length > 0 && (
                                                    <i className="bi bi-x-lg data_clear_icon" onClick={handleClearBookingDates}></i>
                                                )}
                                            </div>
                                            {(isRequired && bookingFormData?.bookingDatesDtos?.length === 0) && (
                                                <small className="form_error_msg">Atleast single date needed for booking!</small>
                                            )}
                                        </div>
                                    </div>

                                    {/* Time */}
                                    <div className="col-12">
                                        <div className="page_form_group">
                                            <label htmlFor='bookingTime' className={`custom_form_label is_required`}>Time</label>

                                            <div className="row">
                                                {/* Start time */}
                                                <div className="col-12 col-sm-6">
                                                    <Dropdown
                                                        id="startTime"
                                                        value={bookingFormData?.fromTime || undefined}
                                                        onChange={(e: DropdownChangeEvent) => {
                                                            setLanesListData([]);
                                                            setBookingLanes([]);
                                                            setBookingPrice(0);

                                                            setBookingFormData((prev: BookingFormData) => ({
                                                                ...prev,
                                                                fromTime: e?.value || "",
                                                                toTime: "",
                                                                selectedLanesDtos: []
                                                            }));
                                                        }}
                                                        options={timeListData}
                                                        optionLabel="label"
                                                        valueTemplate={selectedStartTimeTemplate}
                                                        placeholder="Start time"
                                                        className="form_dropdown w-100 mb-3 mb-sm-0"
                                                        showClear
                                                    />
                                                </div>

                                                {/* End time */}
                                                <div className="col-12 col-sm-6">
                                                    <Dropdown
                                                        id="endTime"
                                                        value={bookingFormData?.toTime || undefined}
                                                        onChange={(e: DropdownChangeEvent) => {
                                                            setLanesListData([]);
                                                            setBookingLanes([]);
                                                            setBookingPrice(0);

                                                            setBookingFormData((prev: BookingFormData) => ({
                                                                ...prev,
                                                                toTime: e?.value || "",
                                                                selectedLanesDtos: []
                                                            }));
                                                        }}
                                                        options={endTimeOptions}
                                                        optionLabel="label"
                                                        valueTemplate={selectedEndTimeTemplate}
                                                        placeholder="End time"
                                                        className="form_dropdown w-100"
                                                        showClear
                                                        disabled={!bookingFormData?.fromTime}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(isRequired && (!bookingFormData?.fromTime || !bookingFormData?.fromTime)) && (
                                        <small className="form_error_msg">Booking time range required!</small>
                                    )}

                                    {/* Lanes */}
                                    <div className="col-12">
                                        <div className="page_form_group">
                                            <label htmlFor='bookingLanes' className={`custom_form_label is_required`}>Spaces</label>
                                            <MultiSelect
                                                value={bookingLanes}
                                                onChange={(e: MultiSelectChangeEvent) => {
                                                    setBookingPrice(0);
                                                    setBookingLanes(e.value);
                                                    setBookingFormData({
                                                        ...bookingFormData,
                                                        selectedLanesDtos: Array.isArray(e.value) && e?.value?.length > 0
                                                            ? e.value.map((v: any) => String(v?.id)).filter(Boolean)
                                                            : [],
                                                    });
                                                }}
                                                options={lanesListData}
                                                display="chip"
                                                optionLabel="name"
                                                showClear
                                                filter
                                                filterPlaceholder="Search lanes"
                                                placeholder="Select space"
                                                maxSelectedLabels={4}
                                                className="w-100"
                                                emptyMessage="No spaces found!"
                                                disabled={lanesListData?.length === 0}
                                            />

                                            {(laneError && lanesListData?.length === 0 && bookingFormData?.bookingDatesDtos?.length > 0 && bookingFormData?.fromTime && bookingFormData?.toTime) && (
                                                <small className="form_error_msg">No lanes available for your date and time!</small>
                                            )}

                                            {(isRequired && bookingFormData?.selectedLanesDtos?.length === 0) && (
                                                <small className="form_error_msg">Please select available lanes for booking!</small>
                                            )}
                                        </div>
                                    </div>

                                    {/* Booking title */}
                                    <div className="col-12">
                                        <TextInput
                                            id="bookingTitle"
                                            label="Booking title"
                                            labelHtmlFor="bookingTitle"
                                            required={false}
                                            inputType="text"
                                            value={bookingFormData?.bookingTitle}
                                            placeholder="Enter a title for this booking"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setBookingFormData({ ...bookingFormData, bookingTitle: e.target.value }) }}
                                            error={''}
                                            formGroupClassName="mb-0"
                                        />
                                    </div>
                                </div>

                                <hr className="form_divider" />

                                <h5 className="form_title">Customer details</h5>

                                <div className="row">
                                    {/* First name */}
                                    <div className="col-12 col-sm-6">
                                        <TextInput
                                            id="firstName"
                                            label="First name"
                                            labelHtmlFor="firstName"
                                            required={false}
                                            inputType="text"
                                            value={bookingFormData?.firstName}
                                            name="firstName"
                                            placeholder="eg: John"
                                            onChange={handleChange}
                                            error=""
                                        />
                                    </div>

                                    {/* Last name */}
                                    <div className="col-12 col-sm-6">
                                        <TextInput
                                            id="lastName"
                                            label="Last name"
                                            name="lastName"
                                            labelHtmlFor="lastName"
                                            required={false}
                                            inputType="text"
                                            value={bookingFormData?.lastName}
                                            placeholder="eg: Doe"
                                            onChange={handleChange}
                                            error=""
                                        />
                                    </div>

                                    {/* Phone number */}
                                    <div className="col-12 col-sm-6">
                                        <PhoneNumberInput
                                            id="phoneNumber"
                                            label="Phone number"
                                            labelHtmlFor="phoneNumber"
                                            required={false}
                                            name="telephoneNumber"
                                            value={bookingFormData?.telephoneNumber}
                                            onChange={(value: string) => { setBookingFormData({ ...bookingFormData, telephoneNumber: value }) }}
                                            error=""
                                            formGroupClassName="mb-sm-0"
                                            setIsValidNumber={setIsValidNumber}
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="col-12 col-sm-6">
                                        <TextInput
                                            id="bookingEmail"
                                            name="email"
                                            label="Email"
                                            labelHtmlFor="bookingEmail"
                                            required={false}
                                            inputType="email"
                                            keyFilter={'email'}
                                            value={bookingFormData?.email}
                                            placeholder="Your email address"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                                            error={(!emailRegex.test(bookingFormData?.email) && bookingFormData?.email) ? "Please enter valid email!" : ""}
                                            inputAutoFocus={true}
                                        />
                                    </div>

                                    {/* Organization */}
                                    <div className="col-12 col-sm-6">
                                        <TextInput
                                            id="organization"
                                            label="Organization"
                                            labelHtmlFor="organization"
                                            required={false}
                                            inputType="text"
                                            value={bookingFormData?.organization}
                                            placeholder="Optional"
                                            onChange={handleChange}
                                            error={''}
                                            formGroupClassName="mb-2"
                                            name="organization"
                                        />
                                    </div>
                                </div>

                                {bookingFormData?.selectedLanesDtos?.length > 0 && (
                                    <>
                                        <hr className="form_divider" />

                                        <h5 className="form_title">Payment</h5>

                                        <div className="row">
                                            <div className="col-12">
                                                <div className="price_info_area">
                                                    <label htmlFor='bookingPrice' className={`custom_form_label`}>Booking price</label>
                                                    <h3 className="price_text">
                                                        {bookingPrice === 0 ? "Calculating..." : `$ ${bookingPrice.toFixed(2)}`}
                                                    </h3>

                                                    {bookingPrice && bookingPrice !== 0 && (
                                                        <span className="form_info">
                                                            (Tax included.)
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    ) : bookingStep === 2 ? (
                        <>
                            <div className="payment_area">

                            </div>
                        </>
                    ) : null}
                </div>
            </Dialog>
            {/*  */}
        </>
    )
}

export default BookingManagement;
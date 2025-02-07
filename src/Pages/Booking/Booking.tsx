import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Booking.css';
import './Booking-responsive.css';

import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { Dialog } from "primereact/dialog";
import { Calendar } from 'primereact/calendar';
import { FormEvent, Nullable } from "primereact/ts-helpers";
import { Dropdown, DropdownChangeEvent, DropdownProps } from "primereact/dropdown";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";

import TextInput from "../../Components/TextInput";
import TextArea from "../../Components/TextArea";

import { TimeList, timeList, CountryList, countryList } from "../../Utils/SiteData";
import { Lane, lanes } from "./BookingData";

import StripeFinalComponent from "../../Components/Stripe/StripeFinalComponent";
import PhoneNumberInput from "../../Components/PhoneNumberInput";

interface BookingFormData {
    email: string;
    fromTime: string;
    toTime: string;
    bookingTitle?: string;
    bookingDetails?: string;
    firstName: string;
    lastName: string;
    telephoneNumber?: string;
    organization?: string;
    selectedLanesDtos: string[];
    bookingDatesDtos: string[];
}


const Booking: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
    const [bookingStep, setBookingStep] = useState<number>(2);
    const [timeListData, setTimeListData] = useState<TimeList[]>([]);
    const [lanesListData, setLanesListData] = useState<Lane[]>([]);
    const [countryListData, setCountryListData] = useState<CountryList[]>([]);

    /* Booking detail fields */
    const [bookingPrice, setBookingPrice] = useState<number>(0);
    const [bookingEmail, setBookingEmail] = useState<string>('');
    const [bookingDates, setBookingDates] = useState<Nullable<Date[]>>(null);
    const [startTime, setStartTime] = useState<TimeList | null>(null);
    const [endTime, setEndTime] = useState<TimeList | null>(null);
    const [bookingLanes, setBookingLanes] = useState<Lane[]>([]);
    const [bookingTitle, setBookingTitle] = useState<string>('');
    const [bookingDescription, setBookingDescription] = useState<string>('');
    const [isAgree, setIsAgree] = useState<boolean>(false);

    /* Booking detail field errors */
    const [bookingEmailError, setBookingEmailError] = useState<string>('');
    const [bookingDateError, setBookingDateError] = useState<string>('');
    const [bookingLaneError, setBookingLaneError] = useState<string>('');
    const [timeError, setTimeError] = useState<string>('');
    const [bookingTitleError, setBookingTitleError] = useState<string>('');
    const [bookingDescriptionError, setBookingDescriptionError] = useState<string>('');

    /* Personal detail fields */
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [organization, setOrganization] = useState<string>('');

    /* Personal detail field errors */
    const [firstNameError, setFirstNameError] = useState<string>('');
    const [lastNameError, setLastNameError] = useState<string>('');
    const [phoneNumberError, setPhoneNumberError] = useState<string>('');
    const [organizationError, setOrganizationError] = useState<string>('');

    const initialBookingFormData = {
        email: '',
        fromTime: '',
        toTime: '',
        bookingTitle: '',
        bookingDetails: '',
        firstName: '',
        lastName: '',
        telephoneNumber: '',
        organization: '',
        selectedLanesDtos: [],
        bookingDatesDtos: []
    }
    const [bookingFormData, setBookingFormData] = useState<BookingFormData>(initialBookingFormData);
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    useEffect(() => {
        setTimeListData(timeList);
        setCountryListData(countryList);
    }, []);

    useEffect(() => {
        const fetchData = async () => {

            setLanesListData(lanes);
        }
        fetchData();
    }, []);

    const handleOpenBooking = () => {
        setShowBookingModal(true);
    }

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
    }

    const handleStartBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsRequired(true);
        setLoading(true);
        if (bookingFormData?.email && emailRegex.test(bookingFormData?.email)) {
            setTimeout(() => {
                setLoading(false);
                setIsRequired(false);
                setBookingStep(2);
            }, 500);
        } else {
            setLoading(false);
        }
    }

    const handleGoPreviousStep = () => {
        setBookingStep(bookingStep - 1);
    }

    const handleConfirmBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setBookingStep(3);
        }, 500);

    }

    // Function to filter valid end times based on selected start time
    const getValidEndTimes = (startTime?: string) => {
        if (!startTime) return [];

        const startIndex = timeList.findIndex((time) => time.value === startTime);
        if (startIndex === -1) return [];

        // Ensure the end times maintain the same minute part (e.g., :30 stays :30)
        return timeList.filter((_, index) => index > startIndex && (index - startIndex) % 2 === 0);
    };

    const endTimeOptions = getValidEndTimes(bookingFormData.fromTime);

    const handleDateChange = (e: FormEvent<Date[], React.SyntheticEvent<Element, Event>>) => {
        if (e && e?.value) {
            const formattedDates = e.value.map((date: Date) =>
                date.toISOString().split("T")[0]
            );
            setBookingDates(e?.value);
            setBookingFormData({ ...bookingFormData, bookingDatesDtos: formattedDates });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBookingFormData({
            ...bookingFormData,
            [name]: value
        });
    }

    console.log(bookingFormData, "fgsdf")

    const bookingModalHeader = (
        <div className="custom_modal_header_inner">
            <h5 className="modal-title fs-5">
                {bookingStep === 3 ? (
                    <>
                        <i className="bi bi-credit-card me-2 modal_head_icon"></i>
                        Payment
                    </>
                ) : (
                    <>
                        <i className="bi bi-calendar-plus me-2 modal_head_icon"></i>
                        New booking
                    </>
                )}
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
                label={`${loading ? 'Processing' : bookingStep === 1 ? 'Next' : bookingStep === 2 ? 'Confirm booking' : null}`}
                onClick={bookingStep === 1 ? handleStartBooking : bookingStep === 2 ? handleConfirmBooking : undefined}
                loading={loading}
                className="custom_btn primary"
            />
        </div>
    );

    const handleClearBookingDates = () => {
        setBookingDates([]);
        setBookingFormData({ ...bookingFormData, bookingDatesDtos: [] });
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


    return (
        <>
            This is booking page
            <Button label="Book Now" onClick={handleOpenBooking} />

            {/* Booking modal */}
            <Dialog
                visible={showBookingModal}
                header={bookingModalHeader}
                footer={bookingStep !== 3 && bookingModalFooter}
                headerClassName="custom_modal_header"
                className={`custom_modal_dialog ${bookingStep === 1 ? 'modal_dialog_sm' : 'modal_dialog_md'} `}
                onHide={handleCloseBookingModal}
            >
                <div className="custom_modal_body">
                    {bookingStep === 1 ? (
                        <>
                            <div className="booking_greeting">
                                <h4>Welcome to...&nbsp;
                                    <span>Kover <span>Drive</span></span>
                                </h4>
                                <h5>To start, please enter your email address.</h5>
                                <p>You'll be the holder of this new booking.</p>
                            </div>

                            <div className="row">
                                {/* Email */}
                                <div className="col-12">
                                    <TextInput
                                        id="bookingEmail"
                                        name="email"
                                        label="Email"
                                        labelHtmlFor="bookingEmail"
                                        required={true}
                                        inputType="email"
                                        keyFilter={'email'}
                                        value={bookingFormData?.email}
                                        placeholder="Your email address"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingFormData({ ...bookingFormData, email: e.target.value })}
                                        error={(isRequired && bookingFormData?.email === "") ? "Email is required!" : (!emailRegex.test(bookingFormData?.email) && bookingFormData?.email) ? "Please enter valid email!" : ""}
                                        formGroupClassName="mb-0"
                                        inputAutoFocus={true}
                                    />
                                </div>
                            </div>
                        </>
                    ) : bookingStep === 2 ? (
                        <>
                            <div className="message_label info mb-4">
                                <i className="bi bi-info-circle-fill me-2"></i>
                                Outside shoes are not allowed at the facility. Metal spikes are not allowed on Cricket lanes.
                            </div>

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
                                                        onChange={(e: DropdownChangeEvent) => { setBookingFormData({ ...bookingFormData, fromTime: e?.value || "", toTime: "" }) }}
                                                        options={timeListData}
                                                        optionLabel="label"
                                                        valueTemplate={selectedStartTimeTemplate}
                                                        placeholder="Start time"
                                                        className="form_dropdown w-100"
                                                        showClear
                                                    />
                                                </div>

                                                {/* End time */}
                                                <div className="col-12 col-sm-6">
                                                    <Dropdown
                                                        id="endTime"
                                                        value={bookingFormData?.toTime || undefined}
                                                        onChange={(e: DropdownChangeEvent) => { setBookingFormData({ ...bookingFormData, toTime: e?.value || "" }) }}
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
                                    <div className="col-12">
                                        <div className="message_label danger mb-4">
                                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                            Your booking doesn't meet the advance-notice requirements. Bookings are not allowed to be made less than 1 hour in advance.
                                        </div>
                                    </div>



                                    {/* Lanes */}
                                    <div className="col-12">
                                        <div className="page_form_group">
                                            <label htmlFor='bookingLanes' className={`custom_form_label is_required`}>Spaces</label>
                                            <MultiSelect
                                                value={bookingLanes}
                                                onChange={(e: MultiSelectChangeEvent) => setBookingLanes(e.value)}
                                                options={lanesListData}
                                                display="chip"
                                                optionLabel="name"
                                                showClear
                                                placeholder="Select space"
                                                maxSelectedLabels={4}
                                                className="w-100"
                                                emptyMessage="No spaces found!"
                                            />

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

                                    {/* Terms and conditions agreement */}
                                    <div className="col-12">
                                        <div className="page_form_group">
                                            <div className="form_check_area">
                                                <Checkbox
                                                    inputId="isAgree"
                                                    name="isAgree"
                                                    value={isAgree}
                                                    className="form_checkbox"
                                                    onChange={e => setIsAgree(e.checked ?? false)}
                                                    checked={isAgree}
                                                />
                                                <label htmlFor="isAgree" className="form_check_label is_required">I agree with <b>Kover Drive</b>' s&nbsp;
                                                    <Link to={'/terms-conditions'} target="_blank">Terms and Conditions</Link>
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Booking description */}
                                    <div className="col-12">
                                        <TextArea
                                            id="bookingDescription"
                                            label="Booking description"
                                            labelHtmlFor="bookingDescription"
                                            required={false}
                                            value={bookingFormData?.bookingDetails}
                                            placeholder="Enter a description for your booking"
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => { setBookingFormData({ ...bookingFormData, bookingDetails: e.target.value }) }}
                                            error={''}
                                            formGroupClassName="mb-0"
                                        />
                                    </div>
                                </div>

                                <hr className="form_divider" />

                                <h5 className="form_title">Your details ({bookingFormData?.email})</h5>
                                <div className="row">
                                    {/* First name */}
                                    <div className="col-12 col-sm-6">
                                        <TextInput
                                            id="firstName"
                                            label="First name"
                                            labelHtmlFor="firstName"
                                            required={true}
                                            inputType="text"
                                            value={bookingFormData?.firstName}
                                            name="firstName"
                                            placeholder="eg: John"
                                            onChange={handleChange}
                                            error={(isRequired && !bookingFormData?.firstName) ? "First name is required!" : ""}
                                        />
                                    </div>

                                    {/* Last name */}
                                    <div className="col-12 col-sm-6">
                                        <TextInput
                                            id="lastName"
                                            label="Last name"
                                            labelHtmlFor="lastName"
                                            required={true}
                                            inputType="text"
                                            value={bookingFormData?.lastName}
                                            placeholder="eg: Doe"
                                            onChange={handleChange}
                                            error={(isRequired && !bookingFormData?.lastName) ? "Last name is required!" : ""}
                                        />
                                    </div>

                                    {/* Phone number */}
                                    <div className="col-12 col-sm-6">
                                        {/* <TextInput
                                            id="phoneNumber"
                                            label="Phone number"
                                            labelHtmlFor="phoneNumber"
                                            required={false}
                                            inputType="number"
                                            value={phoneNumber}
                                            placeholder="eg: 077 123 4567"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(e.target.value)}
                                            error={phoneNumberError}
                                            formGroupClassName="mb-sm-0"
                                        /> */}
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
                                            formGroupClassName="mb-0"
                                        />
                                    </div>
                                </div>

                                <hr className="form_divider" />

                                <h5 className="form_title">Payment and Cancellation/Changes</h5>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="price_info_area">
                                            <label htmlFor='bookingPrice' className={`custom_form_label`}>Booking price</label>
                                            <h3 className="price_text">£ {String(bookingPrice).padStart(2, '0')}</h3>
                                            <p className="form_info">
                                                There is no charge for this booking, however we still need a valid credit card in order to secure it and prevent abuse. Rest assured that your credit card will not be charged.
                                            </p>
                                            <hr />
                                            <label htmlFor='bookingCancellation' className={`custom_form_label`}>Cancellation/Change options</label>
                                            <p className="form_info mt-2">
                                                You will not be able to self-service cancel or change this booking once you confirm it below.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : bookingStep === 3 ? (
                        <div className="payment_area">
                            <StripeFinalComponent />
                        </div>
                    ) : null}
                </div>
            </Dialog>
        </>
    )
}

export default Booking;
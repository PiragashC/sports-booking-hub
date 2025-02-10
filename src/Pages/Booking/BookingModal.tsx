import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './Booking.css';
import './Booking-responsive.css';

import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { Dialog } from "primereact/dialog";
import { Calendar } from 'primereact/calendar';
import { FormEvent, Nullable } from "primereact/ts-helpers";
import { Dropdown, DropdownChangeEvent, DropdownProps } from "primereact/dropdown";
import { MultiSelect, MultiSelectChangeEvent } from "primereact/multiselect";
import { Checkbox } from "primereact/checkbox";

import TextInput from "../../Components/TextInput";
import TextArea from "../../Components/TextArea";

import { TimeList, timeList } from "../../Utils/SiteData";
import { Lane } from "./BookingData";

import PhoneNumberInput from "../../Components/PhoneNumberInput";
import apiRequest from "../../Utils/apiRequest";
import { removeEmptyValues, showSuccessToast, showErrorToast } from "../../Utils/commonLogic";
import { loadStripe, PaymentIntent, Stripe } from "@stripe/stripe-js";
import StripePayment from "../../Components/Stripe/StripePayment";
import { Toast } from "primereact/toast";

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

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    toastRef: React.RefObject<Toast>;
    fetchBookingsForCalenderView?: () => Promise<void>;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, toastRef, fetchBookingsForCalenderView }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
    const [bookingStep, setBookingStep] = useState<number>(1);
    const [timeListData, setTimeListData] = useState<TimeList[]>([]);
    const [lanesListData, setLanesListData] = useState<Lane[]>([]);

    /* Booking detail fields */
    const [bookingPrice, setBookingPrice] = useState<number>(0);
    const [bookingDates, setBookingDates] = useState<Nullable<Date[]>>(null);
    const [bookingLanes, setBookingLanes] = useState<Lane[]>([]);
    const [isAgree, setIsAgree] = useState<boolean>(false);

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
    const [isValidNumber, setIsValidNumber] = useState<boolean>(true);

    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
    const [clientSecret, setClientSecret] = useState<string>("");
    const [bookingId, setBookingId] = useState<string>("");
    const [enableTimeOutComponent, setEnableTimeOutComponent] = useState<boolean>(false);


    useEffect(() => {
        if (isOpen) {
            setTimeListData(timeList);
        }
    }, [isOpen]);

    const handleClose = () => {
        setLoading(false);
        onClose();

        setBookingStep(1);
        setTimeListData([]);
        setLanesListData([]);
        setBookingPrice(0);
        setBookingDates(null);
        setBookingLanes([]);
        setIsAgree(false);
        setBookingFormData(initialBookingFormData);
        setIsRequired(false);
        setIsValidNumber(true);
        setStripePromise(null);
        setClientSecret("");
        setBookingId("");
        setEnableTimeOutComponent(false);
    }

    const changeBookingStatus = async (status: string) => {
        const response = await apiRequest({
            method: "put",
            url: "/booking",
            params: {
                bookingId,
                status
            }
        });

        console.log(response);
        if (response) {
            if (status === "SUCCESS") {
                showSuccessToast(toastRef, "Booking Confirmed", "Your payment was successful, and your reservation is confirmed! A confirmation email has been sent to you.");
                handleClose();
            } else {
                showErrorToast(toastRef, "Booking Failed", "Your payment was not completed, and your booking could not be confirmed. Please try again.");
            }
            fetchBookingsForCalenderView && fetchBookingsForCalenderView();

        } else {
            if (status === "SUCCESS") {
                showErrorToast(toastRef, "Payment Successful, But Confirmation Pending", "Your payment was successful, but we couldn't finalize your reservation. Your booking is marked as pending. Please contact support for confirmation.");
            }
        }
    }

    const onPaymentComplete = (paymentIntent: PaymentIntent | undefined) => {
        console.log(paymentIntent);
        changeBookingStatus("SUCCESS");
    }

    const handleCloseBookingModal = () => {
        handleClose();
        if (bookingStep === 3) {
            changeBookingStatus("FAILURE");
        }
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

    const confirmBooking = async () => {
        setLoading(true);
        const response: any = await apiRequest({
            method: "post",
            url: "/booking",
            data: removeEmptyValues({ ...bookingFormData, telephoneNumber: bookingFormData.telephoneNumber ? `+${bookingFormData.telephoneNumber}` : "" }),
        });

        console.log(response);
        if (response?.bookingId) {
            showSuccessToast(toastRef, "Booking Pending Payment", "Your booking has been successfully created! Please complete the payment to confirm your reservation.")
            setBookingId(response.bookingId);

            const [configResponse, intentResponse] = await Promise.all([
                apiRequest<{ stripe_PUBLISHABLE_KEY: string }>({
                    method: "get",
                    url: "/payment/config",
                }),

                apiRequest<{ clientSecret: string }>({
                    method: "post",
                    url: `/payment/create-payment-intent`,
                    params: { bookingId: response.bookingId },
                }),
            ]);

            console.log("Payment Config:", configResponse.stripe_PUBLISHABLE_KEY);
            console.log("Client Secret:", intentResponse.clientSecret);

            if (configResponse.stripe_PUBLISHABLE_KEY && intentResponse.clientSecret) {
                setStripePromise(loadStripe(configResponse.stripe_PUBLISHABLE_KEY));
                setClientSecret(intentResponse.clientSecret);
                setBookingStep(3);
                setLoading(false);
            } else {
                setStripePromise(null);
                setClientSecret("");
                setLoading(false);
                showErrorToast(toastRef, "Payment Setup Failed", "We couldn't initialize the payment process. Please try again or contact support if the issue persists.");
            }



        } else {
            setLoading(false);
            showErrorToast(toastRef, " Booking Failed", "We couldn’t process your booking due to a technical issue. Please try again later or contact support if the issue persists.");
        }
        fetchBookingsForCalenderView && fetchBookingsForCalenderView();
    };

    const handleConfirmBooking = async (e: React.FormEvent) => {
        setIsRequired(true);
        e.preventDefault();
        if (bookingFormData?.bookingDatesDtos?.length === 0 || !bookingFormData?.fromTime || !bookingFormData?.toTime || bookingFormData?.selectedLanesDtos?.length === 0 || !isAgree || !bookingFormData?.firstName || !bookingFormData?.lastName || !isValidNumber) {
            return;
        }

        confirmBooking();
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
            const formattedDates = e.value.map((date: Date) => {
                const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
                return localDate.toISOString().split("T")[0];
            });

            setLanesListData([]);
            setBookingLanes([]);
            setBookingFormData({
                ...bookingFormData,
                selectedLanesDtos: [],
                bookingDatesDtos: formattedDates
            });
            setBookingDates(e?.value);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBookingFormData({
            ...bookingFormData,
            [name]: value
        });
    }

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
                disabled={bookingStep === 2 ? !isAgree : false}
            />
        </div>
    );

    const handleClearBookingDates = () => {
        setBookingDates([]);
        setBookingFormData({ ...bookingFormData, bookingDatesDtos: [], selectedLanesDtos: [] });
        setLanesListData([]);
        setBookingLanes([]);
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

    const fetchLanes = async () => {
        setLanesListData([]);

        const response = await apiRequest({
            method: "get",
            url: "/booking/check-availability",
            params: {
                fromTime: bookingFormData?.fromTime,
                toTime: bookingFormData?.toTime,
                date: bookingFormData?.bookingDatesDtos?.join(',')
            }
        });

        console.log(response);

        setLanesListData(Array.isArray(response) ? response.map((laneObj: any) => ({
            id: laneObj?.laneId || 0,
            name: laneObj?.laneName || ""
        })) : []);
        fetchBookingsForCalenderView && fetchBookingsForCalenderView();
    };


    const fetchBookingAmount = async () => {
        setBookingPrice(0);
        const response = await apiRequest({
            method: "get",
            url: "/booking",
            params: {
                noOfLanes: bookingFormData?.selectedLanesDtos?.length,
                noOfDates: bookingFormData?.bookingDatesDtos?.length,
                fromTime: bookingFormData?.fromTime,
                toTime: bookingFormData?.toTime
            }
        });

        console.log(response);
        setBookingPrice(response && response?.bookingPrice ? Number(response.bookingPrice) : 0);
    }

    useEffect(() => {
        if (bookingFormData?.bookingDatesDtos && bookingFormData?.bookingDatesDtos?.length > 0 && bookingFormData?.fromTime && bookingFormData?.toTime) fetchLanes();
    }, [bookingFormData?.bookingDatesDtos, bookingFormData?.fromTime, bookingFormData?.toTime]);

    useEffect(() => {
        if (bookingFormData?.selectedLanesDtos && bookingFormData?.selectedLanesDtos?.length > 0 && bookingFormData?.bookingDatesDtos && bookingFormData?.bookingDatesDtos?.length > 0 && bookingFormData?.fromTime && bookingFormData?.toTime) fetchBookingAmount();
    }, [bookingFormData?.selectedLanesDtos, bookingFormData?.bookingDatesDtos, bookingFormData?.fromTime, bookingFormData?.toTime]);

    return (
        <>
            {/* Booking modal */}
            <Dialog
                visible={isOpen}
                header={bookingModalHeader}
                footer={bookingStep !== 3 && bookingModalFooter}
                headerClassName="custom_modal_header"
                className={`custom_modal_dialog ${bookingStep === 1 ? 'modal_dialog_sm' : 'modal_dialog_md'} `}
                onHide={onClose}
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
                                                    // minDate={new Date()}
                                                    minDate={new Date(new Date().setDate(new Date().getDate() + 1))}
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
                                                        className="form_dropdown w-100"
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
                                                placeholder="Select space"
                                                maxSelectedLabels={4}
                                                className="w-100"
                                                emptyMessage="No spaces found!"
                                                disabled={lanesListData?.length === 0}
                                            />

                                            {(lanesListData?.length === 0 && bookingFormData?.bookingDatesDtos?.length > 0 && bookingFormData?.fromTime && bookingFormData?.toTime) && (
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
                                            name="lastName"
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
                                            setIsValidNumber={setIsValidNumber}
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
                                            name="organization"
                                        />
                                    </div>
                                </div>
                                {bookingFormData?.selectedLanesDtos?.length > 0 && <>
                                    <hr className="form_divider" />

                                    <h5 className="form_title">Payment and Cancellation/Changes</h5>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="price_info_area">
                                                <label htmlFor='bookingPrice' className={`custom_form_label`}>Booking price</label>
                                                <h3 className="price_text">
                                                    {bookingPrice === 0 ? "Calculating..." : `$ ${String(bookingPrice).padStart(2, '0')}`}
                                                </h3>

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
                                </>}
                            </div>
                        </>
                    ) : bookingStep === 3 ? (
                        <div className="payment_area">

                            {stripePromise && clientSecret && !enableTimeOutComponent ? <StripePayment
                                stripePromise={stripePromise}
                                clientSecret={clientSecret} onPaymentComplete={onPaymentComplete}
                                changeBookingStatus={changeBookingStatus}
                                handleClose={() => { setEnableTimeOutComponent(true); }}
                            /> : <div>
                                <p>Oops! time out for your booking</p>
                                <Button
                                    label="Start new slot for booking"
                                    className="custom_btn secondary"
                                    onClick={handleCloseBookingModal}
                                />
                            </div>}

                        </div>
                    ) : null}
                </div>
            </Dialog>
        </>
    )
}

export default BookingModal;
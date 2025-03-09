import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import './Booking.css';
import './Booking-responsive.css';
import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { Dialog } from "primereact/dialog";
import { Nullable } from "primereact/ts-helpers";
import TextInput from "../../Components/TextInput";
import { TimeList, timeList } from "../../Utils/SiteData";
import { Lane } from "./BookingData";
import apiRequest from "../../Utils/apiRequest";
import { showSuccessToast, showErrorToast, emailRegex } from "../../Utils/commonLogic";
import { loadStripe, PaymentIntent, Stripe } from "@stripe/stripe-js";
import StripePayment from "../../Components/Stripe/StripePayment";
import { Toast } from "primereact/toast";
import BookingStep2 from "../../Components/Booking/BookingStep2";

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

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    toastRef: React.RefObject<Toast>;
    fetchBookingsForCalenderView: () => Promise<void>;
}

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, toastRef, fetchBookingsForCalenderView }) => {
    const bookingStep2Ref = useRef<{ handleConfirmBooking: (e?: React.FormEvent) => void } | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [bookingStep, setBookingStep] = useState<number>(1);
    const [timeListData, setTimeListData] = useState<TimeList[]>([]);
    const [lanesListData, setLanesListData] = useState<Lane[]>([]);

    /* Booking detail fields */
    const [bookingPrice, setBookingPrice] = useState<number>(0);
    const [bookingDates, setBookingDates] = useState<Nullable<Date[]>>(null);
    const [bookingLanes, setBookingLanes] = useState<Lane[]>([]);
    const [isAgree, setIsAgree] = useState<{ terms: boolean, privacy: boolean }>({ terms: false, privacy: false });
    //test
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
        bookingType: "Online" as BookingType,
        promoCode: ''
    }
    const [bookingFormData, setBookingFormData] = useState<BookingFormData>(initialBookingFormData);
    const [isRequired, setIsRequired] = useState<boolean>(false);
    // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const [isValidNumber, setIsValidNumber] = useState<boolean>(true);

    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
    const [clientSecret, setClientSecret] = useState<string>("");
    const [bookingId, setBookingId] = useState<string>("");
    const [enableTimeOutComponent, setEnableTimeOutComponent] = useState<boolean>(false);
    /* For Terms and conditions */
    const [showTermsConditionModal, setShowTermsConditionModal] = useState<boolean>(false);
    /* For Privacy policy */
    const [showPrivacyPolicyModal, setShowPrivacyPolicyModal] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setTimeListData(timeList);
        }
    }, [isOpen]);

    const checkIsBookingIdInLocal = () => {
        const bookingIdString = localStorage.getItem("bookingId");

        if (bookingIdString) {
            const bookingId = JSON.parse(bookingIdString);
            changeBookingStatus("FAILURE", bookingId);
        }
    }


    const handleClose = () => {
        setLoading(false);
        onClose();

        setBookingStep(1);
        setTimeListData([]);
        setLanesListData([]);
        setBookingPrice(0);
        setBookingDates(null);
        setBookingLanes([]);
        setIsAgree({ terms: false, privacy: false });
        setBookingFormData(initialBookingFormData);
        setIsRequired(false);
        setIsValidNumber(true);
        setStripePromise(null);
        setClientSecret("");
        setBookingId("");
        setEnableTimeOutComponent(false);
        localStorage.removeItem("bookingId");
    }

    const changeBookingStatus = async (status: string, localBookingId?: string) => {
        const response = await apiRequest({
            method: "put",
            url: "/booking",
            params: {
                bookingId: localBookingId || bookingId,
                status
            }
        });

        console.log(response);
        if (response && !response.error) {
            if (status === "SUCCESS") {
                showSuccessToast(toastRef, "Booking Confirmed", "Your payment was successful, and your reservation is confirmed! A confirmation email has been sent to you.");
                handleClose();
            } else {
                showErrorToast(toastRef, "Booking Failed", "Your payment was not completed, and your booking could not be confirmed. Please try again.");
            }
            fetchBookingsForCalenderView();

        } else {
            if (status === "SUCCESS") {
                // showErrorToast(toastRef, "Payment Successful, But Confirmation Pending", "Your payment was successful, but we couldn't finalize your reservation. Your booking is marked as pending. Please contact support for confirmation.");
                showErrorToast(toastRef, "Payment Successful, But Confirmation Pending", response?.error);
            }
        }
    }

    const onPaymentComplete = (paymentIntent: PaymentIntent | undefined) => {
        console.log(paymentIntent);
        changeBookingStatus("SUCCESS");
        localStorage.removeItem("bookingId");
    }

    const handleCloseBookingModal = () => {
        handleClose();
        if (bookingStep === 3) {
            changeBookingStatus("FAILURE");
            localStorage.removeItem("bookingId");
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

    const fnCallAfterSucessToastOfBooking = async (response: any) => {
        setBookingId(response.bookingId);
        localStorage.setItem("bookingId", JSON.stringify(response.bookingId));

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
            // showErrorToast(toastRef, "Payment Setup Failed", "We couldn't initialize the payment process. Please try again or contact support if the issue persists.");
            showErrorToast(toastRef, "Payment Setup Failed", response?.error);
            localStorage.removeItem("bookingId");
        }
    }

    const handleConfirmBooking = async (e: React.FormEvent) => {
        if (bookingStep2Ref.current) {
            bookingStep2Ref.current.handleConfirmBooking();
        }
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
                disabled={bookingStep === 2 ? (!isAgree?.terms || !isAgree?.privacy) : false}
            />
        </div>
    );

    const handleCloseTermsConditionModal = () => {
        setShowTermsConditionModal(false);
        setIsAgree({ ...isAgree, terms: true });
    }

    const termsConditionModalHeader = (
        <h5 className="modal-title">
            <i className="bi bi-journal-check me-2"></i>
            Terms and Conditions
        </h5>
    )

    const termsConditionModalFooter = (
        <div className="custom_modal_footer">
            <Button
                label="Ok"
                className="custom_btn secondary"
                onClick={handleCloseTermsConditionModal}
            />
        </div>
    );
    /*  */

    const handleClosePrivacyPolicyModal = () => {
        setShowPrivacyPolicyModal(false);
        setIsAgree({ ...isAgree, privacy: true });
    }

    const privacyPolicyModalHeader = (
        <h5 className="modal-title">
            <i className="bi bi-shield-check me-2"></i>
            Privacy Policy
        </h5>
    )

    const privacyPolicyModalFooter = (
        <div className="custom_modal_footer">
            <Button
                label="Ok"
                className="custom_btn secondary"
                onClick={handleClosePrivacyPolicyModal}
            />
        </div>
    );

    useEffect(() => { checkIsBookingIdInLocal() }, []);

    /*  */

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
                closable={false}
            >
                <div className="custom_modal_body">
                    {bookingStep === 1 ? (
                        <>
                            <div className="booking_greeting">
                                <h4>Welcome to&nbsp;
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
                                isOpen={isOpen}
                                toastRef={toastRef}
                                setLoading={setLoading}
                                fetchBookings={fetchBookingsForCalenderView}
                                onSuccessFnCall={fnCallAfterSucessToastOfBooking}
                                isAgree={isAgree}
                                setShowTermsConditionModal={setShowTermsConditionModal}
                                setShowPrivacyPolicyModal={setShowPrivacyPolicyModal}
                            />
                        </>
                    ) : bookingStep === 3 ? (
                        <div className="payment_area">

                            {stripePromise && clientSecret && !enableTimeOutComponent ? <StripePayment
                                stripePromise={stripePromise}
                                clientSecret={clientSecret} onPaymentComplete={onPaymentComplete}
                                changeBookingStatus={changeBookingStatus}
                                handleClose={() => { setEnableTimeOutComponent(true); }}
                            /> : <div>

                                <div className="message_label danger mb-4">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    Oops! Your booking time has expired.
                                </div>

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

            {/* Terms condition modal */}
            <Dialog
                visible={showTermsConditionModal}
                header={termsConditionModalHeader}
                footer={termsConditionModalFooter}
                headerClassName="content_modal_header"
                className={`custom_modal_dialog content_modal modal_dialog_lg`}
                onHide={handleCloseTermsConditionModal}
                contentClassName="content_modal_content"
                closable={false}
            >
                <div className="custom_modal_body p-0">
                    <div className="content_modal_body">
                        <div className="content_group">
                            <h6 className="content_head">Liability Release Waiver</h6>
                            <h6 className="content_head">Kover Drive Cricket</h6>
                        </div>

                        <div className="content_group">
                            <p className="content_desc">
                                This liability waiver applies to all cricket-related activities, including but not limited to training sessions, practices, tournaments, and matches conducted at Kover Drive Cricket (hereinafter referred to as 'Kover Drive'), whether at this facility or at any alternate location organized by Kover Drive.
                            </p>
                        </div>

                        <div className="content_group">
                            <p className="content_desc">
                                In consideration of the privilege to participate, the undersigned hereby:
                            </p>
                        </div>

                        <div className="content_group">
                            <ul className="content_list">
                                <li>
                                    Agrees that, prior to engaging in any cricket activity, I will inspect the facilities and equipment. If I identify any potential hazards, I commit to promptly notifying Kover Drive management.
                                </li>

                                <li>
                                    Understands and acknowledges that I am voluntarily participating in cricket activities that involve known and unknown risks of injury, which may include serious injuries, permanent disabilities, and even fatality.
                                </li>

                                <li>
                                    Recognizes that such risks may result from my own actions, omissions, or negligence, as well as the actions, omissions, or negligence of others, including but not limited to Kover Drive, the rules of play, premises conditions, or equipment usage. I assume all such risks and accept personal responsibility for any injuries or damages that may arise.
                                </li>

                                <li>
                                    Unconditionally releases, waives, indemnifies, and agrees not to pursue legal action against the officers, directors, administrators, agents, coaches, staff, volunteers, sponsors, advertisers, and any affiliated individuals or entities associated with Kover Drive Cricket.
                                </li>

                                <li>
                                    As a player or coach signing this liability waiver, I acknowledge that I am responsible for any individuals accompanying me. Kover Drive Cricket is not liable for any incidents involving these individuals.
                                </li>

                                <li>
                                    Acknowledges that as a parent or individual adult signing this document, I understand the risks involved and assume full responsibility for any incidents that may occur. I also confirm that I have my own insurance coverage. Kover Drive Cricket is not liable for any injuries or damages that may arise.
                                </li>

                                <li>
                                    Accepts full responsibility for all medical expenses incurred, regardless of insurance coverage. In the event of an emergency, accident, or illness, I authorize ambulance transportation to a hospital and grant permission to physicians, athletic trainers, first-aid personnel, and medical professionals to perform necessary diagnostic, treatment, or operative procedures, including x-rays.
                                </li>

                                <li>
                                    Acknowledge that this waiver applies to all future cricket sessions I attend at Kover Drive Cricket, without the need to sign a new waiver for each session. This waiver remains in effect until I notify Kover Drive Cricket in writing of any changes.
                                </li>

                                <li>
                                    Understands that no assurances have been given regarding the outcomes of medical examinations or treatments. I assume full responsibility for any and all medical costs and the decision to continue participation despite any existing injuries.
                                </li>

                                <li>
                                    <b>Facility Rules:</b> Strictly indoor shoes must be worn at all times. No metal spikes or soccer studs are allowed in the facility.
                                </li>
                            </ul>
                        </div>

                        <div className="content_group pt-3">
                            <h6 className="content_head">Cancellation Policy:</h6>
                            <p className="content_desc">
                                Cancellations and changes to all reservations (drop-in/court bookings) follow the policy outlined below:
                            </p>

                            <ul className="content_list">
                                <li className="mb-2">
                                    <b>24 hours or more: </b>Full refund provided.
                                </li>
                                <li className="mb-2">
                                    <b>24-12 hours: </b>50% refund credited to the account.
                                </li>
                                <li>
                                    <b>Less than 12 hours: </b>No refund.
                                </li>
                            </ul>
                        </div>

                        <div className="content_group mb-0">
                            <p className="content_desc mb-0">
                                I have thoroughly read and understand the terms and conditions outlined in Kover Drive Cricket’s liability waiver.
                            </p>
                        </div>
                    </div>
                </div>
            </Dialog>
            {/*  */}

            {/* Privacy Policy modal */}
            <Dialog
                visible={showPrivacyPolicyModal}
                header={privacyPolicyModalHeader}
                footer={privacyPolicyModalFooter}
                headerClassName="content_modal_header"
                className={`custom_modal_dialog content_modal modal_dialog_lg`}
                onHide={handleClosePrivacyPolicyModal}
                contentClassName="content_modal_content"
                closable={false}
            >
                <div className="custom_modal_body p-0">
                    <div className="content_modal_body">
                        <div className="content_group">
                            <p className="content_desc">
                                At Kover Drive, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you interact with our services. By using our services, you agree to the practices described in this Privacy Policy.
                            </p>
                        </div>

                        <div className="content_group pb-1">
                            <h6 className="content_head">1. Information We Collect</h6>
                            <p className="content_desc">
                                We may collect the following personal information:
                            </p>
                            <ul className="content_list mb-0">
                                <li className="mb-2"><b>Contact Information: </b>Name, phone number, email address.</li>
                                <li className="mb-2"><b>Booking Details: </b>Date, time, and type of booking.</li>
                                <li className="mb-2"><b>Payment Information: </b>Securely processed billing and payment details.</li>
                                <li className="mb-2"><b>Usage Data: </b>Information on how you use our website and booking system.</li>
                                <li className="mb-2"><b>Technical Information: </b>IP address, browser type, and device information.</li>
                            </ul>
                        </div>

                        <div className="content_group pb-1">
                            <h6 className="content_head">2. How We Use Your Information</h6>
                            <p className="content_desc">
                                Your information is used to:
                            </p>
                            <ul className="content_list mb-0">
                                <li className="mb-2">Facilitate bookings and provide access to our indoor cricket facility.</li>
                                <li className="mb-2">Communicate with you about bookings, promotions, and updates.</li>
                                <li className="mb-2">Process payments and refunds securely.</li>
                                <li className="mb-2">Improve our services and enhance customer experience.</li>
                                <li className="mb-2">Maintain security and prevent fraud.</li>
                            </ul>
                        </div>

                        <div className="content_group pb-1">
                            <h6 className="content_head">3. Sharing Your Information</h6>
                            <p className="content_desc">
                                We do not sell or share your personal data, except in these cases:
                            </p>
                            <ul className="content_list mb-0">
                                <li className="mb-2"><b>Service Providers: </b>We use third-party services to manage bookings and payments.</li>
                                <li className="mb-2"><b>Legal Requirements: </b>We may disclose information if required by law.</li>
                            </ul>
                        </div>

                        <div className="content_group pb-1">
                            <h6 className="content_head">4. Data Security and Retention</h6>
                            <p className="content_desc mb-2">
                                Your personal information is securely stored and protected using industry-standard security measures. We retain your data only as long as necessary for operational and legal purposes.
                            </p>
                        </div>

                        <div className="content_group pb-1">
                            <h6 className="content_head">5. Your Rights</h6>
                            <p className="content_desc">
                                You have the right to:
                            </p>
                            <ul className="content_list">
                                <li className="mb-2">Access, update, or request deletion of your personal data.</li>
                                <li className="mb-2">Opt out of marketing communications.</li>
                                <li className="mb-2">Request a copy or transfer of your data.</li>
                            </ul>
                            <p className="content_desc mb-0">
                                To exercise these rights, contact us at <Link className="content_link" to={`mailto:koverdrivelondonon@gmail.com`}><b>koverdrivelondonon@gmail.com</b></Link>.
                            </p>
                        </div>

                        <div className="content_group pb-1">
                            <h6 className="content_head">6. Cookies and Tracking</h6>
                            <p className="content_desc mb-2">
                                We use cookies and tracking technologies to enhance your experience. You can manage cookie preferences through your browser settings.
                            </p>
                        </div>

                        <div className="content_group pb-1">
                            <h6 className="content_head">7. Policy Updates</h6>
                            <p className="content_desc mb-2">
                                We may update this Privacy Policy periodically. Any changes will be posted on our website.
                            </p>
                        </div>

                        <div className="content_group pb-1 mb-0">
                            <h6 className="content_head">8. Contact Us</h6>
                            <p className="content_desc ">
                                For any privacy-related inquiries, contact:
                            </p>
                            <h6 className="content_head">
                                Kover Drive Indoor Cricket:&nbsp;
                                <Link className="content_link" to={`mailto:koverdrivelondonon@gmail.com`}>koverdrivelondonon@gmail.com</Link>
                            </h6>

                            <p className="content_desc mt-3 mb-0">
                                By using our services, you acknowledge that you have read and understood this Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </Dialog>
            {/*  */}
        </>
    )
}

export default BookingModal;
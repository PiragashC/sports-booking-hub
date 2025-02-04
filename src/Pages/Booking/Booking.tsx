import React, { useState, useEffect, useRef } from "react";
import './Booking.css';
import './Booking-responsive.css';

import { Button } from "primereact/button";
import { Ripple } from "primereact/ripple";
import { Dialog } from "primereact/dialog";
import { Calendar } from 'primereact/calendar';
import { Nullable } from "primereact/ts-helpers";


import TextInput from "../../Components/TextInput";

const Booking: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
    const [bookingStep, setBookingStep] = useState<number>(1);

    const [bookingEmail, setBookingEmail] = useState<string>('');
    const [bookingEmailError, setBookingEmailError] = useState<string>('');
    const [bookingDates, setBookingDates] = useState<Nullable<Date[]>>(null);

    const handleOpenBooking = () => {
        setShowBookingModal(true);
    }

    const handleCloseBookingModal = () => {
        setShowBookingModal(false);
    }

    const handleStartBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            setLoading(false);
            setBookingStep(bookingStep + 1);
        }, 500);
    }

    const handleGoPreviousStep = () => {
        setBookingStep(bookingStep - 1);
    }

    const handleMakeBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);


    }

    console.log(bookingDates)

    const bookingModalHeader = (
        <div className="custom_modal_header_inner">
            <h5 className="modal-title fs-5">
                <i className="bi bi-calendar-plus me-2 modal_head_icon"></i>
                New booking
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
                label={`${loading ? 'Processing' : bookingStep === 1 ? 'Next' : 'Book'}`}
                onClick={bookingStep === 1 ? handleStartBooking : handleMakeBooking}
                loading={loading}
                className="custom_btn primary"
            />
        </div>
    );

    return (
        <>
            This is booking page
            <Button label="Book Now" onClick={handleOpenBooking} />

            {/* Booking modal */}
            <Dialog
                visible={showBookingModal}
                header={bookingModalHeader}
                footer={bookingModalFooter}
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
                                <div className="col-12">
                                    <TextInput
                                        id="bookingEmail"
                                        label="Email"
                                        labelHtmlFor="bookingEmail"
                                        required={true}
                                        inputType="email"
                                        keyFilter={'email'}
                                        value={bookingEmail}
                                        placeholder="Your email address"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingEmail(e.target.value)}
                                        error={bookingEmailError}
                                        formGroupClassName="mb-0"
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="message_label info mb-4">
                                <i className="bi bi-info-circle-fill me-2"></i>
                                Outside shoes are not allowed at the facility. Metal spikes are not allowed on Cricket lanes.
                            </div>

                            <div className="booking_form_area">
                                <h5 className="booking_title">Booking details</h5>

                                <div className="row">
                                    <div className="col-12">
                                        <div className="page_form_group">
                                            <label htmlFor='date' className={`custom_form_label is_required`}>Date</label>
                                            <div className="multi_date_input_group">
                                                <Calendar
                                                    value={bookingDates}
                                                    onChange={(e) => setBookingDates(e.value)}
                                                    selectionMode="multiple"
                                                    readOnlyInput
                                                    className="multi_date_input w-100"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </Dialog>
        </>
    )
}

export default Booking;
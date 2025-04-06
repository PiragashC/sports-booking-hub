import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Events.css';
import './Events-responsive.css';

import { Toast } from "primereact/toast";
import { Ripple } from "primereact/ripple";
import { Nullable } from "primereact/ts-helpers";
import { Fade, Slide } from "react-awesome-reveal";

import BreadCrumbSection from "../../Components/BreadCrumbSection";
import NoData from "../../Components/NoData";
import TextInput from "../../Components/TextInput";
import TextArea from "../../Components/TextArea";
import DatePicker from "../../Components/DatePicker";
import { parseStringToDate, parseStringToTime } from "../../Utils/Helper";

import { EventsList, eventsList } from "./EventsSampleData";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";

const Events: React.FC = () => {
    const toastRef = useRef<Toast>(null);
    const [dataState, setDataState] = useState<'Add' | 'Edit'>('Add');
    const [loading, setLoading] = useState<boolean>(false);
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const today = new Date();

    const [eventsData, setEventsData] = useState<EventsList[]>([]);
    const [selectedEventDetails, setSelectedEventDetails] = useState<EventsList | null>(null);

    /* Event form fields */
    const [title, setTitle] = useState<string>('');
    const [image, setImage] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [date, setDate] = useState<Nullable<Date>>(null);
    const [time, setTime] = useState<Nullable<Date>>(null);
    const [location, setLocation] = useState<string>('');
    const [status, setStatus] = useState<boolean>(false);

    const [showEventModal, setShowEventModal] = useState<boolean>(false);
    const [showEventDetailsModal, setShowEventDetailsModal] = useState<boolean>(false);

    useEffect(() => {
        if (eventsList && eventsList?.length > 0) {
            const activeData = eventsList?.filter((item) => item?.status === true);
            setEventsData(activeData);
        } else {
            setEventsData([]);
        }
    }, [])

    /* Modify event */
    const handleCloseEventModal = () => {
        setShowEventModal(false);
        handleClearEventFields();
    }

    const handleAddEvent = () => {
        setDataState('Add');
        setShowEventModal(true);
    }

    const handleCreateEvent = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {

        } catch (error) {

        }
    }

    const handleEditEvent = (event: EventsList) => {
        setDataState('Edit');
        setShowEventModal(true);

        if (event) {
            setSelectedEventDetails(event);

            setTitle(event.title || '');
            setDescription(event.description || '');
            setDate(parseStringToDate(event.date || ''));
            setTime(parseStringToTime(event.time || ''));
            setLocation(event.location || '');
        }
    }

    const handleUpdateEvent = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
    }

    const handleDeleteEvent = (event: EventsList) => {
        const eventId = event?.id;

        confirmDialog({
            message: 'Are you sure you want to delete this event?',
            header: 'Confirm the deletion',
            headerClassName: 'confirmation_danger',
            icon: 'bi bi-info-circle',
            defaultFocus: 'accept',
            acceptClassName: 'p-button-danger',
            dismissableMask: true,
            accept: () => deleteEvent(eventId!),
        });
    }

    const deleteEvent = (eventId: string) => {
    }

    const handleClearEventFields = () => {
        setTitle('');
        setImage('');
        setDescription('');
        setDate(null);
        setTime(null);
        setLocation('');

        setSelectedEventDetails(null);
    }

    const eventModalHeader = (
        <div className="custom_modal_header_inner">
            <h5 className="modal-title fs-5">
                <i className={`bi ${dataState === 'Add' ? ' bi-plus-square' : ' bi-pencil-square'} me-2 modal_head_icon`}></i>
                {dataState} Event
            </h5>
            <button
                type="button"
                aria-label="Close"
                className="close_modal_btn p-ripple"
                onClick={handleCloseEventModal}
            >
                <i className="bi bi-x-circle"></i>
                <Ripple />
            </button>
        </div>
    )

    const eventModalFooter = (
        <div className="custom_modal_footer">
            <Button
                label="Cancel"
                className="custom_btn secondary"
                onClick={handleCloseEventModal}
            />

            <Button
                label={`${loading ? 'Processing' : dataState === 'Add' ? 'Save' : 'Update'}`}
                onClick={dataState === 'Add' ? handleCreateEvent : handleUpdateEvent}
                loading={loading}
                className="custom_btn primary"
            />
        </div>
    )
    /*  */

    /* View Event */
    const handleViewEvent = (event: EventsList) => {
        setSelectedEventDetails(event);
        setShowEventDetailsModal(true);
    }

    const handleCloseEventDetailsModal = () => {
        setShowEventDetailsModal(false);
        setSelectedEventDetails(null);
    }


    return (
        <React.Fragment>
            <Toast ref={toastRef} />

            <BreadCrumbSection
                title={'Events'}
                parentTitle={'Home'}
                parentIcon={'bi-house-fill'}
                parentLink={`/`}
                activeIcon={'bi-calendar2-event-fill'}
            />

            <section className="page_section events_section">
                <div className="container-md">
                    <div className="event_content">
                        <div className="section_body">
                            <Slide direction="up" triggerOnce>
                                <h3 className="section_title text-center">
                                    Upcoming Events
                                </h3>
                            </Slide>

                            <div className="section_content">
                                <Fade triggerOnce className="w-100">
                                    <div className="customize_data_area">
                                        <div className="customize_data_sub">
                                            <h5>
                                                <i className="bi bi-pencil-square me-2"></i>
                                                Customize Events
                                            </h5>
                                            <p>Total events: {String(eventsData?.length).padStart(2, '0')}</p>
                                        </div>

                                        <button
                                            className="new_data_button m-0 is_btn p-ripple"
                                            aria-label="New Event"
                                            onClick={handleAddEvent}>
                                            <i className="bi bi-plus-circle"></i>
                                            <span>Add Event</span>
                                            <Ripple />
                                        </button>
                                    </div>
                                </Fade>

                                {eventsData && eventsData?.length > 0 ? (
                                    <div className="row event_content_row">
                                        {eventsData?.map((event, index) => {
                                            return (
                                                <div key={event?.id}
                                                    className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-4">
                                                    <Slide direction="up" delay={index * 50} className="w-100" triggerOnce>
                                                        <article className="event_content_card p-ripple">
                                                            <div className="event_img_area">
                                                                <img
                                                                    className={`event_img ${event?.image === null ? 'no_image' : ''}`}
                                                                    src={event?.image ? (process.env.PUBLIC_URL + event?.image) : (process.env.PUBLIC_URL + '/event/no_event.jpg')}
                                                                    alt={event?.title}
                                                                    loading="lazy"
                                                                />
                                                            </div>

                                                            <div className="event_detail_area">
                                                                <div className="event_detail_header">
                                                                    <div className="event_date">
                                                                        <h6>APR</h6>
                                                                        <h1>15</h1>
                                                                    </div>
                                                                    <div className="event_detail_sub">
                                                                        <h5 className="event_title">
                                                                            {event?.title ? event?.title : '---------------'}
                                                                        </h5>

                                                                        <p className="event_desc">
                                                                            {event?.description ? event?.description : '---------------'}
                                                                        </p>
                                                                    </div>
                                                                </div>

                                                                <div className="event_detail_footer">
                                                                    <div className="event_label">
                                                                        <i className="bi bi-clock"></i>
                                                                        <span>{event?.time ? event?.time : '-----'}</span>
                                                                    </div>

                                                                    <div className="event_label">
                                                                        <i className="bi bi-geo-alt"></i>
                                                                        <span>{event?.location ? event?.location : '-----'}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <Ripple />
                                                        </article>
                                                    </Slide>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <NoData
                                        showImage={true}
                                        message="Oops! No events found!"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Dialog
                visible={showEventModal}
                header={eventModalHeader}
                footer={eventModalFooter}
                headerClassName="custom_modal_header"
                className={`custom_modal_dialog modal_dialog_md`}
                onHide={handleCloseEventModal}
                dismissableMask
            >
                <div className="custom_modal_body">
                    <div className="row">
                        <div className="col-12">
                            <TextInput
                                id="title"
                                key={`title`}
                                label="Title"
                                labelHtmlFor="title"
                                required={true}
                                inputType="text"
                                value={title}
                                name="title"
                                placeholder="Enter event title"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                                inputAutoFocus={true}
                                error={(isRequired && !title) ? "Event title is required!" : ""}
                            />
                        </div>

                        <div className="col-12 col-sm-6">
                            <DatePicker
                                id="date"
                                name="date"
                                label="Date"
                                labelHtmlFor="date"
                                required={true}
                                value={date}
                                minDate={today}
                                placeholder="dd/mm/yyyy"
                                onChange={setDate}
                                error={(isRequired && !date) ? "Event date is required!" : ""}
                                showClear
                                onClear={() => setDate(null)}
                            />
                        </div>

                        <div className="col-12 col-sm-6">
                            <DatePicker
                                id="date"
                                name="date"
                                label="Time"
                                labelHtmlFor="date"
                                required={true}
                                value={date}
                                minDate={today}
                                placeholder="dd/mm/yyyy"
                                onChange={setDate}
                                error={(isRequired && !date) ? "Event date is required!" : ""}
                                showClear
                                onClear={() => setDate(null)}
                            />
                        </div>

                        <div className="col-12">
                            <TextArea
                                id="descrition"
                                key={`description`}
                                label="Description"
                                labelHtmlFor="description"
                                required={false}
                                value={description}
                                name="description"
                                placeholder="Enter event descrition"
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                inputAutoFocus={true}
                                formGroupClassName="mb-sm-2"
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        </React.Fragment>
    )
}

export default Events;
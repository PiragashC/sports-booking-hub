// import React, { useEffect, useRef, useState } from "react";
// import './Events.css';
// import './Events-responsive.css';

// import { Toast } from "primereact/toast";
// import { Ripple } from "primereact/ripple";
// import { Nullable } from "primereact/ts-helpers";
// import { Fade, Slide } from "react-awesome-reveal";
// import { Button } from "primereact/button";
// import { Dialog } from "primereact/dialog";
// import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
// import { Image } from 'primereact/image';
// import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
// import { IconField } from "primereact/iconfield";
// import { InputIcon } from "primereact/inputicon";
// import { InputText } from "primereact/inputtext";

// import BreadCrumbSection from "../../Components/BreadCrumbSection";
// import NoData from "../../Components/NoData";
// import TextInput from "../../Components/TextInput";
// import TextArea from "../../Components/TextArea";
// import DatePicker from "../../Components/DatePicker";
// import TimePicker from "../../Components/TimePicker";
// import FileInput from "../../Components/FileInput";
// import { parseStringToDate, parseStringToTime, formatTime, formatDate } from "../../Utils/Helper";

// import { format, parse, parseISO } from 'date-fns';

// import { EventsList, eventsList } from "./EventsSampleData";
// import { useAppDispatch, useAppSelector } from "../../redux/hook";
// import { useSelector } from "react-redux";
// import { useDeleteConfirmation } from "../../Components/DeleteConfirmationDialog";
// import { initialWebContents, WebContent } from "../Home/HomeData";
// const Events: React.FC = () => {
//     const toastRef = useRef<Toast>(null);
//     const [dataState, setDataState] = useState<'Add' | 'Edit'>('Add');
//     const [loading, setLoading] = useState<boolean>(false);
//     const [isRequired, setIsRequired] = useState<boolean>(false);
//     const today = new Date();

//     const eventEmptyImage: string = process.env.PUBLIC_URL + '/event/no_event.jpg';

//     const [eventsData, setEventsData] = useState<EventsList[]>([]);
//     const [filteredEventsData, setFilteredEventsData] = useState<EventsList[]>([]);
//     const [eventSearchKey, setEventSearchKey] = useState<string>('');
//     const [eventState, setEventState] = useState<'All' | 'Active' | 'Inactive'>('All');
//     const [selectedEventDetails, setSelectedEventDetails] = useState<EventsList | null>(null);

//     const [contentEditable, setContentEditable] = useState<boolean>(true);
//     const [actionButtonHoverd, setActionButtonHoverd] = useState<boolean>(false);

//     /* Event form fields */
//     const [title, setTitle] = useState<string>('');
//     const [description, setDescription] = useState<string>('');
//     const [date, setDate] = useState<Nullable<Date>>(null);
//     const [time, setTime] = useState<Nullable<Date>>(null);
//     const [location, setLocation] = useState<string>('');
//     const [imageFile, setImageFile] = useState<File | null>(null);
//     const [imageFileName, setImageFileName] = useState<string>("");
//     const [status, setStatus] = useState<boolean>(true);

//     const [showEventModal, setShowEventModal] = useState<boolean>(false);
//     const [showEventDetailsModal, setShowEventDetailsModal] = useState<boolean>(false);

//     const dispatch = useAppDispatch();
//     const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
//     const { data, loading: WebContenLoading, error, postStatus } = useAppSelector((state) => state.webContent);
//     const showDialog = useDeleteConfirmation();
//     const [webContents, setWebContents] = useState<WebContent>(initialWebContents);
//     const eventItems = webContents?.contentFourteen || [];


//     // useEffect(() => {
//     //     if (eventsList && eventsList.length > 0) {
//     //         const activeData = eventsList.filter(item => item.status === true);
//     //         setEventsData(token ? eventsList : activeData);
//     //     } else {
//     //         setEventsData([]);
//     //     }
//     // }, [eventsList, token]);

//     // useEffect(() => {
//     //     let filteredData = [...eventsData];

//     //     if (eventSearchKey) {
//     //         filteredData = filteredData.filter(event =>
//     //             event.title?.toLowerCase().includes(eventSearchKey.toLowerCase())
//     //         );
//     //     }

//     //     if (eventState === 'Active') {
//     //         filteredData = filteredData.filter(event => event.status === true);
//     //     } else if (eventState === 'Inactive') {
//     //         filteredData = filteredData.filter(event => event.status === false);
//     //     }

//     //     setFilteredEventsData(filteredData);
//     // }, [eventSearchKey, eventState, eventsData]);

//     const handleChangeEventState = (state: 'All' | 'Active' | 'Inactive') => {
//         setEventState(state);
//     }

//     /* Modify event */
//     const handleCloseEventModal = () => {
//         setShowEventModal(false);
//         handleClearEventFields();
//     }

//     const handleAddEvent = () => {
//         setDataState('Add');
//         setShowEventModal(true);
//     }

//     const handleCreateEvent = (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             setTimeout(() => {
//                 setLoading(false);
//                 handleCloseEventModal();

//                 if (toastRef.current) {
//                     toastRef.current.show({
//                         severity: "success",
//                         summary: "Success",
//                         detail: "Event created successfully.",
//                         life: 3000,
//                     });
//                 }
//             }, 500);
//         } catch (error) {
//             setLoading(false);

//             if (toastRef.current) {
//                 toastRef.current.show({
//                     severity: "error",
//                     summary: "Failed",
//                     detail: "There was an error creating the event.",
//                     life: 3000,
//                 });
//             }
//         }
//     }

//     const handleEditEvent = (event: EventsList) => {
//         setDataState('Edit');
//         setShowEventModal(true);

//         if (event) {
//             setSelectedEventDetails(event);

//             setTitle(event.title || '');
//             setDescription(event.description || '');
//             setDate(parseStringToDate(event.date || ''));
//             setTime(parseStringToTime(event.time || ''));
//             setLocation(event.location || '');
//             setStatus(event?.status || false);
//         }
//     }

//     const handleUpdateEvent = (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);

//         try {
//             setTimeout(() => {
//                 setLoading(false);
//                 handleCloseEventModal();
//                 setSelectedEventDetails(null);

//                 if (toastRef.current) {
//                     toastRef.current.show({
//                         severity: "success",
//                         summary: "Success",
//                         detail: "Event updated successfully.",
//                         life: 3000,
//                     });
//                 }
//             }, 500);
//         } catch (error) {
//             setLoading(false);

//             if (toastRef.current) {
//                 toastRef.current.show({
//                     severity: "error",
//                     summary: "Failed",
//                     detail: "There was an error updating the event.",
//                     life: 3000,
//                 });
//             }
//         }
//     }

//     const handleDeleteEvent = (event: EventsList) => {
//         const eventId = event?.id;
//         console.log(eventId)

//         confirmDialog({
//             message: 'Are you sure you want to delete this event?',
//             header: 'Confirm the deletion',
//             headerClassName: 'confirmation_danger',
//             icon: 'bi bi-info-circle',
//             defaultFocus: 'accept',
//             acceptClassName: 'p-button-danger',
//             rejectClassName: 'p-button-secondary',
//             dismissableMask: true,
//             accept: () => deleteEvent(eventId!)
//         });
//     }

//     const deleteEvent = (eventId: string) => {
//         try {
//             if (toastRef.current) {
//                 toastRef.current.show({
//                     severity: "success",
//                     summary: "Success",
//                     detail: "Event deleted successfully.",
//                     life: 3000,
//                 });
//             }
//         } catch (error) {
//             if (toastRef.current) {
//                 toastRef.current.show({
//                     severity: "error",
//                     summary: "Failed",
//                     detail: "There was an error deleting the event.",
//                     life: 3000,
//                 });
//             }
//         }
//     }

//     const handleClearEventFields = () => {
//         setTitle('');
//         setDescription('');
//         setDate(null);
//         setTime(null);
//         setLocation('');
//         setImageFile(null);
//         setImageFileName('');

//         setSelectedEventDetails(null);
//     }

//     const eventModalHeader = (
//         <div className="custom_modal_header_inner">
//             <h5 className="modal-title fs-5">
//                 <i className={`bi ${dataState === 'Add' ? ' bi-plus-square' : ' bi-pencil-square'} me-2 modal_head_icon`}></i>
//                 {dataState} Event
//             </h5>
//             <button
//                 type="button"
//                 aria-label="Close"
//                 className="close_modal_btn p-ripple"
//                 onClick={handleCloseEventModal}
//             >
//                 <i className="bi bi-x-circle"></i>
//                 <Ripple />
//             </button>
//         </div>
//     )

//     const eventModalFooter = (
//         <div className="custom_modal_footer">
//             <Button
//                 label="Cancel"
//                 className="custom_btn secondary"
//                 onClick={handleCloseEventModal}
//             />

//             <Button
//                 label={`${loading ? 'Processing' : dataState === 'Add' ? 'Save' : 'Update'}`}
//                 onClick={dataState === 'Add' ? handleCreateEvent : handleUpdateEvent}
//                 loading={loading}
//                 className="custom_btn primary"
//             />
//         </div>
//     )

//     const handleImageUpload = (file: File) => {
//         setImageFile(file);
//         setImageFileName(file.name);
//     };

//     const handleClearImage = () => {
//         setImageFile(null);
//         setImageFileName("");
//     };
//     /*  */

//     /* View Event */
//     const handleViewEvent = (event: EventsList) => {
//         setSelectedEventDetails(event);
//         setShowEventDetailsModal(true);
//     }

//     const handleCloseEventDetailsModal = () => {
//         setShowEventDetailsModal(false);
//         setSelectedEventDetails(null);
//     }


//     const evenDetailModalHeader = (
//         <h5 className="modal-title fs-5">
//             <i className={`bi ${dataState === 'Add' ? ' bi-plus-square' : ' bi-pencil-square'} me-2 modal_head_icon`}></i>
//             Event details
//         </h5>
//     )

//     useEffect(() => { setWebContents(data || initialWebContents) }, [data, dispatch]);


//     return (
//         <React.Fragment>
//             <Toast ref={toastRef} />

//             <BreadCrumbSection
//                 title={'Events'}
//                 parentTitle={'Home'}
//                 parentIcon={'bi-house-fill'}
//                 parentLink={`/`}
//                 activeIcon={'bi-calendar2-event-fill'}
//             />

//             <section className="page_section events_section">
//                 <div className="container-md">
//                     <div className="event_content">
//                         <div className="section_body">
//                             <Slide direction="up" triggerOnce>
//                                 <h3 className="section_title text-center">
//                                     Upcoming Events
//                                 </h3>
//                             </Slide>

//                             <div className="section_content">
//                                 {contentEditable && (
//                                     <Fade triggerOnce className="w-100">
//                                         <div className="customize_data_container">
//                                             <div className="customize_data_area">
//                                                 <div className="customize_data_sub">
//                                                     <h5>
//                                                         <i className="bi bi-pencil-square me-2"></i>
//                                                         Customize Events
//                                                     </h5>
//                                                     <p>Total events: {String(eventItems?.length || 0).padStart(2, '0')}</p>
//                                                 </div>

//                                                 <button
//                                                     className="new_data_button m-0 is_btn p-ripple"
//                                                     aria-label="New Event"
//                                                     onClick={handleAddEvent}>
//                                                     <i className="bi bi-plus-circle"></i>
//                                                     <span>Add Event</span>
//                                                     <Ripple />
//                                                 </button>
//                                             </div>

//                                             {/* <div className="customize_data_area ">
//                                                 <div className="data_tab_area">
//                                                     <button
//                                                         className={`data_tab_btn ${eventState === 'All' ? 'active' : ''} p-ripple`}
//                                                         type="button"
//                                                         onClick={() => handleChangeEventState('All')}>
//                                                         All
//                                                         <Ripple pt={{ root: { style: { background: 'rgba(0, 70, 128, 0.2)' } } }} />
//                                                     </button>
//                                                     <button
//                                                         className={`data_tab_btn ${eventState === 'Active' ? 'active' : ''} p-ripple`}
//                                                         type="button"
//                                                         onClick={() => handleChangeEventState('Active')}>
//                                                         Active
//                                                         <Ripple pt={{ root: { style: { background: 'rgba(0, 70, 128, 0.2)' } } }} />
//                                                     </button>
//                                                     <button
//                                                         className={`data_tab_btn ${eventState === 'Inactive' ? 'active' : ''} p-ripple`}
//                                                         type="button"
//                                                         onClick={() => handleChangeEventState('Inactive')}>
//                                                         Inactive
//                                                         <Ripple pt={{ root: { style: { background: 'rgba(0, 70, 128, 0.2)' } } }} />
//                                                     </button>
//                                                 </div>

//                                                 <IconField iconPosition="left">
//                                                     <InputIcon className="bi bi-search"></InputIcon>
//                                                     <InputText
//                                                         placeholder="Search event by title..."
//                                                         className="search_input"
//                                                         value={eventSearchKey}
//                                                         onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventSearchKey(e.target.value)}
//                                                         type="search"
//                                                     />
//                                                 </IconField>
//                                             </div> */}
//                                         </div>
//                                     </Fade>
//                                 )}

//                                 {webContents && eventItems && Array.isArray(eventItems) && eventItems.length > 0 ? (
//                                     <div className="row event_content_row">
//                                         {webContents && eventItems && Array.isArray(eventItems) && eventItems?.map((event, index) => {
//                                             let month = '---';
//                                             let day = '--';

//                                             if (event.eventDate) {
//                                                 const parsedDate = parseISO(event.eventDate);
//                                                 month = format(parsedDate, 'MMM').toUpperCase();
//                                                 day = format(parsedDate, 'dd');
//                                             }

//                                             return (
//                                                 <div key={event?.id}
//                                                     className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-4">
//                                                     <Slide direction="up" delay={index * 50} className="w-100" triggerOnce>
//                                                         <article className="event_content_card p-ripple"
//                                                             onClick={(e) => {
//                                                                 e.stopPropagation();
//                                                                 handleViewEvent(event);
//                                                             }}>
//                                                             <div className="event_img_area">
//                                                                 <img
//                                                                     className={`event_img ${event?.imageViewUrl === null ? 'no_image' : ''}`}
//                                                                     src={event?.imageViewUrl ? (event?.imageViewUrl) : eventEmptyImage}
//                                                                     alt={event?.eventTitle}
//                                                                     loading="lazy"
//                                                                 />
//                                                             </div>

//                                                             <div className="event_detail_area">
//                                                                 <div className="event_detail_header">
//                                                                     <div className="event_date">
//                                                                         <h6>{month}</h6>
//                                                                         <h1>{day}</h1>
//                                                                     </div>

//                                                                     <div className="event_detail_sub">
//                                                                         <h5 className="event_title">
//                                                                             {event?.eventTitle ? event?.eventTitle : '---------------'}
//                                                                         </h5>

//                                                                         <p className="event_desc">
//                                                                             {event?.description
//                                                                                 ? event.description.length > 80
//                                                                                     ? `${event.description.slice(0, 80)}...`
//                                                                                     : event.description
//                                                                                 : '---------------'}
//                                                                         </p>
//                                                                     </div>
//                                                                 </div>

//                                                                 <div className="event_detail_footer">
//                                                                     <div className="event_label">
//                                                                         <i className="bi bi-clock"></i>
//                                                                         <span>
//                                                                             {event?.eventTime
//                                                                                 ? format(parse(event.eventTime, 'HH:mm:ss', new Date()), 'hh:mm a')
//                                                                                 : '-----'}
//                                                                         </span>
//                                                                     </div>

//                                                                     <div className="event_label">
//                                                                         <i className="bi bi-geo-alt"></i>
//                                                                         <span>{event?.location ? event?.location : '-----'}</span>
//                                                                     </div>
//                                                                 </div>
//                                                             </div>

//                                                             {contentEditable && (
//                                                                 <div className="event_action_btn_grp">
//                                                                     <button
//                                                                         type="button"
//                                                                         onClick={(e) => {
//                                                                             e.stopPropagation();
//                                                                             handleEditEvent(event);
//                                                                         }}
//                                                                         onMouseOver={() => setActionButtonHoverd(true)}
//                                                                         onMouseLeave={() => setActionButtonHoverd(false)}
//                                                                         className="event_action_btn edit is_btn p-ripple"
//                                                                     >
//                                                                         <i className="bi bi-pencil-square"></i>
//                                                                         Edit
//                                                                         <Ripple />
//                                                                     </button>

//                                                                     <button
//                                                                         type="button"
//                                                                         onClick={(e) => {
//                                                                             e.stopPropagation();
//                                                                             handleDeleteEvent(event);
//                                                                         }}
//                                                                         onMouseOver={() => setActionButtonHoverd(true)}
//                                                                         onMouseLeave={() => setActionButtonHoverd(false)}
//                                                                         className="event_action_btn delete is_btn p-ripple"
//                                                                     >
//                                                                         <i className="bi bi-trash3"></i>
//                                                                         <Ripple />
//                                                                     </button>
//                                                                 </div>
//                                                             )}

//                                                             {!actionButtonHoverd && <Ripple />}
//                                                         </article>
//                                                     </Slide>
//                                                 </div>
//                                             )
//                                         })}
//                                     </div>
//                                 ) : (
//                                     <NoData
//                                         showImage={true}
//                                         message="Oops! No events found!"
//                                     />
//                                 )}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* Event add/edit modal */}
//             <Dialog
//                 visible={showEventModal}
//                 header={eventModalHeader}
//                 footer={eventModalFooter}
//                 headerClassName="custom_modal_header"
//                 className={`custom_modal_dialog modal_dialog_md`}
//                 onHide={handleCloseEventModal}
//                 dismissableMask
//             >
//                 <div className="custom_modal_body">
//                     <div className="row">
//                         <div className="col-12">
//                             <TextInput
//                                 id="title"
//                                 key={`title`}
//                                 label="Title"
//                                 labelHtmlFor="title"
//                                 required={true}
//                                 inputType="text"
//                                 value={title}
//                                 name="title"
//                                 placeholder="Enter event title"
//                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
//                                 inputAutoFocus={true}
//                                 error={(isRequired && !title) ? "Event title is required!" : ""}
//                             />
//                         </div>

//                         <div className="col-12 col-sm-6">
//                             <DatePicker
//                                 id="date"
//                                 name="date"
//                                 label="Date"
//                                 labelHtmlFor="date"
//                                 required={true}
//                                 value={date}
//                                 minDate={today}
//                                 placeholder="dd/mm/yyyy"
//                                 onChange={setDate}
//                                 error={(isRequired && !date) ? "Event date is required!" : ""}
//                                 showClear
//                                 onClear={() => setDate(null)}
//                             />
//                         </div>

//                         <div className="col-12 col-sm-6">
//                             <TimePicker
//                                 id="time"
//                                 name="time"
//                                 label="Time"
//                                 labelHtmlFor="time"
//                                 required={true}
//                                 value={time}
//                                 placeholder="hh:mm"
//                                 onChange={setTime}
//                                 error={(isRequired && !time) ? "Event time is required!" : ""}
//                                 showClear
//                                 hourFormat="12"
//                                 onClear={() => setTime(null)}
//                             />
//                         </div>

//                         <div className="col-12">
//                             <TextInput
//                                 id="location"
//                                 key={`location`}
//                                 label="Location"
//                                 labelHtmlFor="location"
//                                 required={true}
//                                 inputType="text"
//                                 value={location}
//                                 name="location"
//                                 placeholder="Enter event location"
//                                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
//                                 inputAutoFocus={true}
//                                 error={(isRequired && !location) ? "Event location is required!" : ""}
//                             />
//                         </div>

//                         <div className="col-12">
//                             <TextArea
//                                 id="descrition"
//                                 key={`description`}
//                                 label="Description"
//                                 labelHtmlFor="description"
//                                 required={false}
//                                 value={description}
//                                 name="description"
//                                 placeholder="Enter event descrition"
//                                 onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
//                                 inputAutoFocus={true}
//                             />
//                         </div>

//                         <div className="col-12">
//                             <div className="page_form_group">
//                                 <div className="custom_form_group_sub">
//                                     <label className="custom_form_label" htmlFor="status">Status: </label>

//                                     <div className="event_status_grp">
//                                         <span className="text_danger event_status_label">Inactive</span>
//                                         <InputSwitch checked={status} onChange={(e: InputSwitchChangeEvent) => setStatus(e.value)} />
//                                         <span className="text_success event_status_label">Active</span>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         <div className="col-12">
//                             <FileInput
//                                 key={`imageFile`}
//                                 id="imageFile"
//                                 label="Event image"
//                                 labelHtmlFor="imageFile"
//                                 required={true}
//                                 value={imageFileName}
//                                 name="imageFile"
//                                 hasMaxFileSize
//                                 maxFileSize={2} // 2MB
//                                 onUpload={handleImageUpload}
//                                 onClear={handleClearImage}
//                                 toast={toastRef}
//                                 error={(isRequired && !imageFile) ? "Event image is required!" : ""}
//                                 containerClassName="mb-2"
//                                 additionalFileInfo="A landscape image is recommended."
//                             />
//                         </div>

//                         {(imageFile || (selectedEventDetails && selectedEventDetails?.image)) && (
//                             <div className="col-12">
//                                 <div className="uploaded_image_area">
//                                     <img
//                                         src={imageFile ? URL.createObjectURL(imageFile) : selectedEventDetails?.image ? selectedEventDetails?.image : ''}
//                                         alt={imageFileName}
//                                         className="uploaded_image"
//                                     />
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </Dialog>
//             {/*  */}


//             {/* Event detail modal */}
//             <Dialog
//                 visible={showEventDetailsModal}
//                 header={evenDetailModalHeader}
//                 headerClassName="content_modal_header"
//                 className={`custom_modal_dialog content_modal modal_dialog_md`}
//                 onHide={handleCloseEventDetailsModal}
//                 contentClassName="content_modal_content"
//                 dismissableMask
//             >
//                 <div className="custom_modal_body p-0">
//                     <div className="content_modal_body">
//                         {selectedEventDetails && selectedEventDetails !== null ? (
//                             <div className="event_view_area">
//                                 <Image
//                                     src={selectedEventDetails?.image ? selectedEventDetails?.image : eventEmptyImage}
//                                     alt="Image"
//                                     className="event_view_img_area"
//                                     preview={selectedEventDetails?.image ? true : false}
//                                 />

//                                 <h5 className="event_view_title">
//                                     {selectedEventDetails?.title}
//                                 </h5>

//                                 {selectedEventDetails?.description && (
//                                     <p className="event_view_desc">
//                                         {selectedEventDetails?.description}
//                                     </p>
//                                 )}

//                                 <div className="row">
//                                     <div className="col-12 mb-2">
//                                         <div className="event_view_detail_item">
//                                             <i className="bi bi-geo-alt-fill"></i>
//                                             {selectedEventDetails?.location ? (
//                                                 <span>{selectedEventDetails?.location}</span>
//                                             ) : (
//                                                 <span className="not_available">Not Available</span>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="col-6 pe-1">
//                                         <div className="event_view_detail_item">
//                                             <i className="bi bi-calendar2-event-fill"></i>
//                                             {selectedEventDetails?.date ? (
//                                                 <span>
//                                                     {selectedEventDetails?.date}
//                                                 </span>
//                                             ) : (
//                                                 <span className="not_available">Not Available</span>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="col-6 ps-1">
//                                         <div className="event_view_detail_item">
//                                             <i className="bi bi-clock-fill"></i>
//                                             {selectedEventDetails?.time ? (
//                                                 <span>
//                                                     {selectedEventDetails?.time
//                                                         ? format(parse(selectedEventDetails.time, 'HH:mm:ss', new Date()), 'hh:mm a')
//                                                         : '-----'}
//                                                 </span>
//                                             ) : (
//                                                 <span className="not_available">Not Available</span>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         ) : (
//                             <div className="no_data_found_area">
//                                 <img src={process.env.PUBLIC_URL + '/no_data/no_data_icon.svg'} alt="" />
//                                 <p>
//                                     <i className="bi bi-exclamation-circle me-1"></i>
//                                     No details found!
//                                 </p>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </Dialog>
//             {/*  */}
//         </React.Fragment>
//     )
// }

// export default Events;

import React, { useEffect, useRef, useState } from "react";
import './Events.css';
import './Events-responsive.css';
import { format, parseISO, parse } from 'date-fns';
import { Toast } from "primereact/toast";
import { Ripple } from "primereact/ripple";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Image } from "primereact/image";

import { Fade, Slide } from "react-awesome-reveal";

import NoData from "../../Components/NoData";
import TextInput from "../../Components/TextInput";
import TextArea from "../../Components/TextArea";
import DatePicker from "../../Components/DatePicker";
import TimePicker from "../../Components/TimePicker";
import FileInput from "../../Components/FileInput";
import { ImageEditorNew } from "../../Components/ImageEditor/ImageEditor";

import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { initialWebContents, WebContent } from "../Home/HomeData";
import { postWebContentsThunk } from "../../redux/webContentSlice";
import { useSelector } from "react-redux";
import { uploadImageService } from "../../Utils/commonService";
import { showErrorToast } from "../../Utils/commonLogic";
import { useDeleteConfirmation } from "../../Components/DeleteConfirmationDialog";
import BreadCrumbSection from "../../Components/BreadCrumbSection";

interface EventFormState {
    title: string;
    description: string;
    date: Date | null;
    time: Date | null;
    location: string;
    imageFile: File | null;
    imageFileName: string;
    status: boolean;
}

const initialEventFormState: EventFormState = {
    title: '',
    description: '',
    date: null,
    time: null,
    location: '',
    imageFile: null,
    imageFileName: '',
    status: true
};

const Events: React.FC = () => {
    const toastRef = useRef<Toast>(null);
    const [dataState, setDataState] = useState<'Add' | 'Edit'>('Add');
    const [loading, setLoading] = useState<boolean>(false);
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const today = new Date();

    const [contentEditable, setContentEditable] = useState<boolean>(true);
    const [actionButtonHoverd, setActionButtonHoverd] = useState<boolean>(false);
    const [formState, setFormState] = useState<EventFormState>(initialEventFormState);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [showEventModal, setShowEventModal] = useState<boolean>(false);
    const [showEventDetailsModal, setShowEventDetailsModal] = useState<boolean>(false);
    const [showImageEditor, setShowImageEditor] = useState<boolean>(false);

    const dispatch = useAppDispatch();
    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
    const { data, loading: webContentLoading, error } = useAppSelector((state) => state.webContent);
    const [webContents, setWebContents] = useState<WebContent>(initialWebContents);
    const eventItems = webContents?.contentFourteen || [];
    const eventEmptyImage: string = process.env.PUBLIC_URL + '/event/no_event.jpg';
    const showDialog = useDeleteConfirmation();


    useEffect(() => {
        setWebContents(data || initialWebContents)
    }, [data, dispatch]);

    const handleCloseEventModal = () => {
        setShowEventModal(false);
        setFormState(initialEventFormState);
        setSelectedEvent(null);
    };

    const handleAddEvent = () => {
        setDataState('Add');
        setShowEventModal(true);
    };

    const handleEditEvent = (event: any) => {
        setDataState('Edit');
        setSelectedEvent(event);

        setFormState({
            title: event?.eventTitle || '',
            description: event?.description || '',
            date: event?.eventDate ? new Date(event.eventDate) : null,
            time: event?.eventTime ? parse(event.eventTime, 'HH:mm:ss', new Date()) : null,
            location: event?.location || '',
            imageFile: null,
            imageFileName: event?.imageViewUrl ? 'Current image' : '',
            status: event?.status || true
        });

        setShowEventModal(true);
    };

    const handleViewEvent = (event: any) => {
        setSelectedEvent(event);
        setShowEventDetailsModal(true);
    };

    const handleCloseEventDetailsModal = () => {
        setShowEventDetailsModal(false);
        setSelectedEvent(null);
    };

    const validateForm = (): boolean => {
        if (!formState.title || !formState.date || !formState.time || !formState.location) {
            showErrorToast(toastRef, 'Validation Error', 'Please fill all required fields');
            setIsRequired(true);
            return false;
        }

        // if (dataState === 'Add' && !formState.imageFile) {
        //     showErrorToast(toastRef, 'Validation Error', 'Event image is required');
        //     setIsRequired(true);
        //     return false;
        // }

        return true;
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);

        try {
            // Upload image first if exists
            let imageUrl = '';
            if (formState.imageFile) {
                const uploadResponse = await uploadImageService([formState.imageFile], token);
                if (uploadResponse.length > 0) {
                    imageUrl = uploadResponse[0];
                }
            }

            const newEvent = {
                eventTitle: formState.title,
                description: formState.description,
                eventDate: formState.date?.toISOString() || '',
                eventTime: formState.time ? format(formState.time, 'HH:mm:ss') : '',
                location: formState.location,
                image: imageUrl,
                status: formState.status,
            };

            const updatedContent = {
                ...webContents,
                contentFourteen: [...(webContents?.contentFourteen || []), newEvent]
            };

            await dispatch(postWebContentsThunk({
                webContent: updatedContent,
                toastRef
            }));

            handleCloseEventModal();
        } catch (error) {
            console.error('Error creating event:', error);
            showErrorToast(toastRef, 'Error', 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !selectedEvent) return;

        setLoading(true);

        try {
            // Only upload new image if one was selected
            let imageUrl = selectedEvent.image;
            if (formState.imageFile) {
                const uploadResponse = await uploadImageService([formState.imageFile], token);
                if (uploadResponse.length > 0) {
                    imageUrl = uploadResponse[0];
                }
            }

            const updatedEvent = {
                id: selectedEvent.id,
                eventTitle: formState.title,
                description: formState.description,
                eventDate: formState.date?.toISOString() || '',
                eventTime: formState.time ? format(formState.time, 'HH:mm:ss') : '',
                location: formState.location,
                image: imageUrl,
                status: formState.status
            };

            const updatedItems = eventItems.map(item =>
                item.id === selectedEvent.id ? updatedEvent : item
            );

            const updatedContent = {
                ...webContents,
                contentFourteen: updatedItems
            };

            await dispatch(postWebContentsThunk({
                webContent: updatedContent,
                toastRef
            }));

            handleCloseEventModal();
        } catch (error) {
            console.error('Error updating event:', error);
            showErrorToast(toastRef, 'Error', 'Failed to update event');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEvent = (event: any) => {
        if (!event) return;
        showDialog({
            message: 'Are you sure you want to delete this event?',
            header: 'Confirm the deletion',
            accept: () => {
                const updatedContent = {
                    ...webContents,
                    contentFourteen: webContents.contentFourteen.filter(e => e.id !== event.id)
                };

                dispatch(postWebContentsThunk({
                    webContent: updatedContent,
                    toastRef
                }));
            }
        });
    };

    const handleImageUpload = (file: File) => {
        setFormState(prev => ({
            ...prev,
            imageFile: file,
            imageFileName: file.name
        }));
    };

    const handleClearImage = () => {
        setFormState(prev => ({
            ...prev,
            imageFile: null,
            imageFileName: ''
        }));
    };

    const handleEditImage = () => {
        if (formState.imageFile) {
            setShowEventModal(false);
            setShowImageEditor(true);
        }
    };

    const handleSaveEditedImage = (file: File) => {
        setFormState(prev => ({
            ...prev,
            imageFile: file,
            imageFileName: file.name
        }));
        setShowImageEditor(false);
        setShowEventModal(true);
    };

    const eventModalHeader = (
        <div className="custom_modal_header_inner">
            <h5 className="modal-title fs-5">
                <i className={`bi ${dataState === 'Add' ? 'bi-plus-square' : 'bi-pencil-square'} me-2 modal_head_icon`}></i>
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
    );

    const eventModalFooter = (
        <div className="custom_modal_footer">
            <Button
                label="Cancel"
                className="custom_btn secondary"
                onClick={handleCloseEventModal}
                disabled={loading}
            />

            <Button
                label={`${loading ? 'Processing' : dataState === 'Add' ? 'Save' : 'Update'}`}
                onClick={dataState === 'Add' ? handleCreateEvent : handleUpdateEvent}
                loading={loading}
                className="custom_btn primary"
                disabled={loading}
            />
        </div>
    );

    const evenDetailModalHeader = (
        <h5 className="modal-title fs-5">
            <i className="bi bi-info-circle me-2 modal_head_icon"></i>
            Event details
        </h5>
    );

    return (
        <React.Fragment>
            <Toast ref={toastRef} />

            <BreadCrumbSection
                title={'Event'}
                parentTitle={'Home'}
                parentIcon={'bi-house-fill'}
                parentLink={`/`}
                activeIcon={'bi-image-fill'}
            />

            <div className="section_content">
                {contentEditable && (
                    <Fade triggerOnce className="w-100">
                        <div className="customize_data_container">
                            <div className="customize_data_area">
                                <div className="customize_data_sub">
                                    <h5>
                                        <i className="bi bi-pencil-square me-2"></i>
                                        Customize Events
                                    </h5>
                                    <p>Total events: {String(eventItems?.length || 0).padStart(2, '0')}</p>
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
                        </div>
                    </Fade>
                )}

                {webContents && eventItems && Array.isArray(eventItems) && eventItems.length > 0 ? (
                    <div className="row event_content_row">
                        {eventItems.map((event, index) => {
                            let month = '---';
                            let day = '--';

                            if (event.eventDate) {
                                const parsedDate = parseISO(event.eventDate);
                                month = format(parsedDate, 'MMM').toUpperCase();
                                day = format(parsedDate, 'dd');
                            }

                            return (
                                <div key={event?.id}
                                    className="col-12 col-sm-6 col-lg-4 col-xl-4 col-xxl-4">
                                    <Slide direction="up" delay={index * 50} className="w-100" triggerOnce>
                                        <article className="event_content_card p-ripple"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewEvent(event);
                                            }}>
                                            <div className="event_img_area">
                                                <img
                                                    className={`event_img ${!event?.imageViewUrl ? 'no_image' : ''}`}
                                                    src={event?.imageViewUrl || eventEmptyImage}
                                                    alt={event?.eventTitle}
                                                    loading="lazy"
                                                />
                                            </div>

                                            <div className="event_detail_area">
                                                <div className="event_detail_header">
                                                    <div className="event_date">
                                                        <h6>{month}</h6>
                                                        <h1>{day}</h1>
                                                    </div>

                                                    <div className="event_detail_sub">
                                                        <h5 className="event_title">
                                                            {event?.eventTitle || '---------------'}
                                                        </h5>

                                                        <p className="event_desc">
                                                            {event?.description
                                                                ? event.description.length > 80
                                                                    ? `${event.description.slice(0, 80)}...`
                                                                    : event.description
                                                                : '---------------'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="event_detail_footer">
                                                    <div className="event_label">
                                                        <i className="bi bi-clock"></i>
                                                        <span>
                                                            {event?.eventTime
                                                                ? format(parse(event.eventTime, 'HH:mm:ss', new Date()), 'hh:mm a')
                                                                : '-----'}
                                                        </span>
                                                    </div>

                                                    <div className="event_label">
                                                        <i className="bi bi-geo-alt"></i>
                                                        <span>{event?.location || '-----'}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {contentEditable && (
                                                <div className="event_action_btn_grp">
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditEvent(event);
                                                        }}
                                                        onMouseOver={() => setActionButtonHoverd(true)}
                                                        onMouseLeave={() => setActionButtonHoverd(false)}
                                                        className="event_action_btn edit is_btn p-ripple"
                                                    >
                                                        <i className="bi bi-pencil-square"></i>
                                                        Edit
                                                        <Ripple />
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteEvent(event);
                                                        }}
                                                        onMouseOver={() => setActionButtonHoverd(true)}
                                                        onMouseLeave={() => setActionButtonHoverd(false)}
                                                        className="event_action_btn delete is_btn p-ripple"
                                                    >
                                                        <i className="bi bi-trash3"></i>
                                                        <Ripple />
                                                    </button>
                                                </div>
                                            )}

                                            {!actionButtonHoverd && <Ripple />}
                                        </article>
                                    </Slide>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <NoData
                        showImage={true}
                        message="Oops! No events found!"
                    />
                )}
            </div>

            {/* Event add/edit modal */}
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
                                value={formState.title}
                                name="title"
                                placeholder="Enter event title"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormState(prev => ({ ...prev, title: e.target.value }))
                                }
                                inputAutoFocus={true}
                                error={(isRequired && !formState.title) ? "Event title is required!" : ""}
                            />
                        </div>

                        <div className="col-12 col-sm-6">
                            <DatePicker
                                id="date"
                                name="date"
                                label="Date"
                                labelHtmlFor="date"
                                required={true}
                                value={formState.date}
                                minDate={today}
                                placeholder="dd/mm/yyyy"
                                onChange={(value) => {
                                    if (value) {
                                        setFormState(prev => ({ ...prev, date: value }))
                                    }
                                }
                                }
                                error={(isRequired && !formState.date) ? "Event date is required!" : ""}
                                showClear
                                onClear={() => setFormState(prev => ({ ...prev, date: null }))}
                            />
                        </div>

                        <div className="col-12 col-sm-6">
                            <TimePicker
                                id="time"
                                name="time"
                                label="Time"
                                labelHtmlFor="time"
                                required={true}
                                value={formState.time}
                                placeholder="hh:mm"
                                onChange={(value) => {
                                    if (value) {
                                        setFormState(prev => ({ ...prev, time: value }))
                                    }
                                }
                                }
                                error={(isRequired && !formState.time) ? "Event time is required!" : ""}
                                showClear
                                hourFormat="12"
                                onClear={() => setFormState(prev => ({ ...prev, time: null }))}
                            />
                        </div>

                        <div className="col-12">
                            <TextInput
                                id="location"
                                key={`location`}
                                label="Location"
                                labelHtmlFor="location"
                                required={true}
                                inputType="text"
                                value={formState.location}
                                name="location"
                                placeholder="Enter event location"
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    setFormState(prev => ({ ...prev, location: e.target.value }))
                                }
                                error={(isRequired && !formState.location) ? "Event location is required!" : ""}
                            />
                        </div>

                        <div className="col-12">
                            <TextArea
                                id="description"
                                key={`description`}
                                label="Description"
                                labelHtmlFor="description"
                                required={false}
                                value={formState.description}
                                name="description"
                                placeholder="Enter event description"
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                    setFormState(prev => ({ ...prev, description: e.target.value }))
                                }
                            />
                        </div>

                        <div className="col-12">
                            <FileInput
                                key={`imageFile-${dataState}`}
                                id="imageFile"
                                label="Event image"
                                labelHtmlFor="imageFile"
                                required={false}
                                value={formState.imageFileName}
                                name="imageFile"
                                hasMaxFileSize
                                maxFileSize={2} // 2MB
                                onUpload={handleImageUpload}
                                onClear={handleClearImage}
                                toast={toastRef}
                                // error={(isRequired && !formState.imageFile && dataState === 'Add') ? "Event image is required!" : ""}
                                containerClassName="mb-2"
                                additionalFileInfo="Optional - A landscape image is recommended."
                            />
                        </div>

                        {(formState.imageFile || (selectedEvent && selectedEvent?.imageViewUrl)) && (
                            <div className="col-12">
                                <div className="uploaded_image_area">
                                    <img
                                        src={formState.imageFile
                                            ? URL.createObjectURL(formState.imageFile)
                                            : selectedEvent?.imageViewUrl || ''}
                                        alt={formState.imageFileName}
                                        className="uploaded_image"
                                    />
                                    {formState.imageFile && (
                                        <button
                                            className="edit_image_btn is_btn p-ripple"
                                            onClick={handleEditImage}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                            Edit Image
                                            <Ripple />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>

            {/* Event detail modal */}
            <Dialog
                visible={showEventDetailsModal}
                header={evenDetailModalHeader}
                headerClassName="content_modal_header"
                className={`custom_modal_dialog content_modal modal_dialog_md`}
                onHide={handleCloseEventDetailsModal}
                contentClassName="content_modal_content"
                dismissableMask
            >
                <div className="custom_modal_body p-0">
                    <div className="content_modal_body">
                        {selectedEvent ? (
                            <div className="event_view_area">
                                <Image
                                    src={selectedEvent?.imageViewUrl || eventEmptyImage}
                                    alt="Image"
                                    className="event_view_img_area"
                                    preview={!!selectedEvent?.imageViewUrl}
                                />

                                <h5 className="event_view_title">
                                    {selectedEvent?.eventTitle}
                                </h5>

                                {selectedEvent?.description && (
                                    <p className="event_view_desc">
                                        {selectedEvent?.description}
                                    </p>
                                )}

                                <div className="row">
                                    <div className="col-12 mb-2">
                                        <div className="event_view_detail_item">
                                            <i className="bi bi-geo-alt-fill"></i>
                                            {selectedEvent?.location ? (
                                                <span>{selectedEvent?.location}</span>
                                            ) : (
                                                <span className="not_available">Not Available</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-6 pe-1">
                                        <div className="event_view_detail_item">
                                            <i className="bi bi-calendar2-event-fill"></i>
                                            {selectedEvent?.eventDate ? (
                                                <span>
                                                    {format(parseISO(selectedEvent.eventDate), 'MMM dd, yyyy')}
                                                </span>
                                            ) : (
                                                <span className="not_available">Not Available</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="col-6 ps-1">
                                        <div className="event_view_detail_item">
                                            <i className="bi bi-clock-fill"></i>
                                            {selectedEvent?.eventTime ? (
                                                <span>
                                                    {format(parse(selectedEvent.eventTime, 'HH:mm:ss', new Date()), 'hh:mm a')}
                                                </span>
                                            ) : (
                                                <span className="not_available">Not Available</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="no_data_found_area">
                                <img src={process.env.PUBLIC_URL + '/no_data/no_data_icon.svg'} alt="" />
                                <p>
                                    <i className="bi bi-exclamation-circle me-1"></i>
                                    No details found!
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>

            <ImageEditorNew
                isOpen={showImageEditor}
                onClose={() => {
                    setShowImageEditor(false);
                    setShowEventModal(true);
                }}
                onSave={handleSaveEditedImage}
                imageToEdit={formState.imageFile}
            />
        </React.Fragment>
    );
};

export default Events;
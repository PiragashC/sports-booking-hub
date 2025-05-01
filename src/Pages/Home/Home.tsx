import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './Home.css';
import './Home-responsive.css';
import { Button } from "primereact/button";
import { Slide, Fade, Zoom } from "react-awesome-reveal";

import { goToTop } from "../../Components/GoToTop";
import { initialWebContents, WebContent } from "./HomeData";
import TextInput from "../../Components/TextInput";
import TextArea from "../../Components/TextArea";
import apiRequest from "../../Utils/Axios/apiRequest";
import { emailRegex, removeEmptyValues, showErrorToast, showSuccessToast } from "../../Utils/commonLogic";
import { Toast } from "primereact/toast";
import { ImageEditorNew } from "../../Components/ImageEditor/ImageEditor";
import { Edit, Pencil, Plus, Trash2 } from "lucide-react";
import { useDeleteConfirmation } from "../../Components/DeleteConfirmationDialog";
import { CardFormModal } from "./CardFormModal";
import { FeatureFormModal } from "./FeatureFormModal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { ProgressSpinner } from "primereact/progressspinner";
import { postWebContentsThunk } from "../../redux/webContentSlice";
import { uploadImageService } from "../../Utils/commonService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";


const Home: React.FC = () => {
    const toastRef = useRef<Toast>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    const [modalVisible, setModalVisible] = useState(false);
    const showDialog = useDeleteConfirmation();
    const [isEdit, setIsEdit] = useState(false);
    const [currentEditCard, setCurrentEditCard] = useState<any>(null);

    const [featureModalVisible, setFeatureModalVisible] = useState(false);
    const [currentEditFeature, setCurrentEditFeature] = useState<any>(null);
    const [isFeatureEdit, setIsFeatureEdit] = useState(false);

    const intialReachUsForm = {
        name: '',
        email: '',
        subject: '',
        message: ''
    }
    const [reachUsForm, setReachUsForm] = useState<typeof intialReachUsForm>(intialReachUsForm);
    const [isRequired, setIsRequired] = useState<boolean>(false);

    const [isEditMode, setIsEditMode] = useState<boolean>(true);

    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
    const dispatch = useAppDispatch();
    const { data, loading: WebContenLoading, error, postStatus } = useAppSelector((state) => state.webContent);
    const [webContents, setWebContents] = useState<WebContent>(initialWebContents);

    const [openImageEditor, setOpenImageEditor] = useState<boolean>(false);
    const [contentKeyForImageEditor, setContentKeyForImageEditor] = useState<'contentFourViewUrl' | 'contentTenViewUrl'>();

    const handleNavigateBooking = () => {
        navigate(`/booking`);
        goToTop();
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setReachUsForm((prev) => ({ ...prev, [name]: value }));
    }

    const handleSubmitContactForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsRequired(false);
        if (!reachUsForm?.email || !emailRegex.test(reachUsForm.email) || !reachUsForm?.name || !reachUsForm?.message || !reachUsForm?.subject) {
            setIsRequired(true);
            return
        }
        setLoading(true);
        const response: any = await apiRequest({
            method: "post",
            url: "/booking/reach-us",
            data: removeEmptyValues(reachUsForm),
        });
        console.log(response);
        if (response && !response?.error) {
            showSuccessToast(toastRef, "Contact message sent successfully", "");
            setReachUsForm(intialReachUsForm);
        } else {
            showErrorToast(toastRef, "Failed to send contact message. Please try again.", response?.error);
        }
        setLoading(false);
    }

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const handleAddCard = () => {
        setIsEdit(false);
        setCurrentEditCard(null);
        setModalVisible(true);
    };

    const handleEditCard = (card: any) => {
        setIsEdit(true);
        setCurrentEditCard(card);
        setModalVisible(true);
    };

    const handleSubmitCard = (cardData: any) => {
        let updatedContent;

        if (isEdit) {
            updatedContent = {
                ...webContents,
                contentThree: webContents.contentThree.map(card =>
                    card.id === cardData.id ? cardData : card
                )
            };
        } else {
            updatedContent = {
                ...webContents,
                contentThree: [...webContents.contentThree, cardData]
            };
        }

        setWebContents(updatedContent);

        dispatch(postWebContentsThunk({
            webContent: updatedContent,
            toastRef: toastRef
        })).unwrap();
    };


    const handleDeleteCard = (id: number) => {
        // Prevent deletion if only one card exists
        if (webContents.contentThree.length <= 1) {
            return;
        }

        showDialog({
            message: 'Are you sure you want to delete this card?',
            header: 'Confirm the deletion',
            accept: () => {
                const updatedContent = {
                    ...webContents,
                    contentThree: webContents.contentThree.filter(card => card.id !== id)
                };

                setWebContents(updatedContent);
                dispatch(postWebContentsThunk({
                    webContent: updatedContent,
                    toastRef: toastRef
                })).unwrap();
            }
        });
    };

    const handleAddFeature = () => {
        setIsFeatureEdit(false);
        setCurrentEditFeature(null);
        setFeatureModalVisible(true);
    };

    const handleEditFeature = (feature: any) => {
        setIsFeatureEdit(true);
        setCurrentEditFeature(feature);
        setFeatureModalVisible(true);
    };

    const handleSubmitFeature = (featureData: any) => {
        let updatedContent;

        if (isFeatureEdit) {
            updatedContent = {
                ...webContents,
                contentTwelve: webContents.contentTwelve.map(feature =>
                    feature.id === featureData.id ? featureData : feature
                )
            };
        } else {
            updatedContent = {
                ...webContents,
                contentTwelve: [...webContents.contentTwelve, featureData]
            };
        }

        setWebContents(updatedContent);
        dispatch(postWebContentsThunk({
            webContent: updatedContent,
            toastRef: toastRef
        })).unwrap();
    };

    const handleDeleteFeature = (id: number | string) => {
        if (webContents.contentTwelve.length <= 1) {
            return;
        }

        showDialog({
            message: 'Are you sure you want to delete this feature?',
            header: 'Confirm the deletion',
            accept: () => {
                const updatedContent = {
                    ...webContents,
                    contentTwelve: webContents.contentTwelve.filter(feature => feature.id !== id)
                };

                setWebContents(updatedContent);
                dispatch(postWebContentsThunk({
                    webContent: updatedContent,
                    toastRef: toastRef
                })).unwrap();
            }
        });
    };

    const handleContentChange = (event: React.FormEvent<HTMLHeadingElement | HTMLParagraphElement>) => {
        const target = event.target as HTMLElement;
        const contentKey = target.dataset.contentKey;

        if (contentKey) {
            setWebContents(prevContents => {
                const updatedContent = {
                    ...prevContents,
                    [contentKey]: target.innerText
                };

                // Dispatch after state update
                dispatch(postWebContentsThunk({
                    webContent: updatedContent,
                    toastRef: toastRef
                })).unwrap();
                return updatedContent;
            });
        }
    };

    const handleOnSaveForImageEditor = async (file: File) => {
        if (!contentKeyForImageEditor) return;

        const tempUrl = URL.createObjectURL(file);
        try {

            setWebContents(prev => ({
                ...prev,
                [contentKeyForImageEditor]: tempUrl
            }));

            const imagePaths = await uploadImageService([file], token);
            const permanentUrl = imagePaths[0];

            setWebContents(prev => {
                const updatedContent = {
                    ...prev,
                    [contentKeyForImageEditor]: permanentUrl
                };
                dispatch(postWebContentsThunk({
                    webContent: updatedContent,
                    toastRef: toastRef
                })).unwrap();
                return updatedContent;
            });

        } catch (error) {
            console.error('Upload failed:', error);
            setWebContents(prev => ({
                ...prev,
                [contentKeyForImageEditor]: prev[contentKeyForImageEditor]
            }));
            showErrorToast(toastRef, 'Image upload failed', 'Please try again');
        } finally {
            if (tempUrl) URL.revokeObjectURL(tempUrl);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => { setWebContents(data || initialWebContents) }, [data, dispatch]);

    if (!webContents || WebContenLoading) return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100vw",
                position: "fixed",
                top: 0,
                left: 0,
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                zIndex: 9999,
            }}
        >
            <ProgressSpinner strokeWidth="4" fill="var(--surface-ground)" animationDuration=".5s" />
        </div>
    )

    return (
        <>
            <Toast ref={toastRef} />
            {/* Hero section */}
            <section className={`home_hero_section page_init_section ${isScrolled && 'scrolled'}`} overflow-hidden id="home" style={{
                backgroundImage: `url(${webContents.contentFourViewUrl})`
            }}>
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <article className="home_hero_content">
                                <Slide direction="up" triggerOnce>
                                    <h1>
                                        Welcome to <span>Kover<span>Drive</span></span> Sports {isEditMode && <Edit size={16} className="ms-2" onClick={(() => {
                                            setOpenImageEditor(true);
                                            setContentKeyForImageEditor('contentFourViewUrl');
                                        })} />}
                                    </h1>
                                </Slide>

                                <Slide direction="up" delay={100} triggerOnce>
                                    <h2 contentEditable={isEditMode}
                                        onBlur={handleContentChange}
                                        data-content-key="contentOne"
                                        suppressContentEditableWarning
                                        style={{ minHeight: '1em', border: isEditMode ? '1px dashed gray' : 'none', padding: '4px' }}
                                    >
                                        {webContents?.contentOne || ''}
                                    </h2>
                                </Slide>

                                <Slide direction="up" delay={200} triggerOnce>
                                    <p contentEditable={isEditMode}
                                        onBlur={handleContentChange}
                                        data-content-key="contentTwo"
                                        suppressContentEditableWarning
                                        style={{ minHeight: '1em', border: isEditMode ? '1px dashed gray' : 'none', padding: '4px' }}
                                    >
                                        {webContents?.contentTwo || ''}
                                    </p>
                                </Slide>

                                {/* <Zoom delay={200} duration={1500} triggerOnce className="w-100">
                                    <div className="home_hero_buttons">
                                        <Button
                                            label="Book Cricket Lane"
                                            className="custom_button primary"
                                            onClick={handleNavigateBooking}
                                        />

                                        <Button
                                            label="Awaiting More Facilities"
                                            className="custom_button secondary"
                                            onClick={() => scrollToSection("features")}
                                        />
                                    </div>
                                </Zoom> */}
                            </article>
                        </div>

                        <div className="col-12 col-xl-5 col-md-8 col-sm-8 mx-auto">
                            {isEditMode && <div className="d-flex justify-content-end mb-3">
                                <Button
                                    icon={<Plus size={16} />}
                                    label="Add Card"
                                    className="p-button-rounded p-button-success p-button-sm"
                                    onClick={handleAddCard}
                                />
                            </div>}

                            {webContents?.contentThree && Array.isArray(webContents?.contentThree) &&
                                webContents.contentThree.map((content) => (
                                    <Slide direction="up" triggerOnce delay={100} key={content.id}>
                                        <article className="home_hero_card">
                                            <div className="home_hero_card_header d-flex justify-content-between align-items-center">
                                                <h4>{content?.laneCardTitle}</h4>
                                                {isEditMode && <div className="d-flex gap-1">
                                                    <Button
                                                        icon={<Pencil size={16} />}
                                                        className="p-button-rounded p-button-info p-button-text"
                                                        onClick={() => handleEditCard(content)}
                                                    />
                                                    {webContents.contentThree.length > 1 && (
                                                        <Button
                                                            icon={<Trash2 size={16} />}
                                                            className="p-button-rounded p-button-danger p-button-text"
                                                            onClick={() => handleDeleteCard(content.id)}
                                                        />
                                                    )}
                                                </div>}
                                            </div>

                                            <div className="home_hero_card_body">
                                                <p><i className="bi bi-clock-fill me-1"></i> {content?.frequency}</p>
                                                <p>{content?.timeInterval}</p>
                                            </div>

                                            <div className="home_hero_card_footer">
                                                <h3>{content?.ratePerHour}
                                                    <span> + Tax</span>
                                                </h3>
                                                <hr className="home_hero_card_footer_divider" />
                                                <div className="home_hero_buttons">
                                                    <Button
                                                        label={content?.laneCardTitle}
                                                        className="custom_button primary"
                                                        onClick={handleNavigateBooking}
                                                    />
                                                </div>
                                            </div>
                                        </article>
                                    </Slide>
                                ))
                            }

                            <CardFormModal
                                visible={modalVisible}
                                onHide={() => { setModalVisible(false); setCurrentEditCard(null); }}
                                onSubmit={handleSubmitCard}
                                editData={currentEditCard}
                                isEdit={isEdit}
                            />
                        </div>
                    </div>
                </div>
            </section>
            {/*  */}

            {/* About section */}
            <section className="page_section about_section" id="about">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12 col-xl-6 d-flex align-items-center">
                            <div className="section_body">
                                <Slide direction="up" triggerOnce>
                                    <h3 className="section_title">
                                        <span>About</span> Kover Drive Sports
                                    </h3>
                                </Slide>

                                <Slide direction="up" delay={100} triggerOnce>
                                    <h4 className="section_sub_title" contentEditable={isEditMode}
                                        onBlur={handleContentChange}
                                        data-content-key="contentFive"
                                        suppressContentEditableWarning
                                        style={{ minHeight: '1em', border: isEditMode ? '1px dashed gray' : 'none', padding: '4px' }}
                                    >
                                        {webContents?.contentFive || ''}
                                    </h4>
                                </Slide>

                                <div className="section_content">
                                    <Fade triggerOnce>
                                        <p className="section_desc" contentEditable={isEditMode}
                                            onBlur={handleContentChange}
                                            data-content-key="contentSix"
                                            suppressContentEditableWarning
                                            style={{ minHeight: '1em', border: isEditMode ? '1px dashed gray' : 'none', padding: '4px' }}
                                        >
                                            {webContents?.contentSix || ''}
                                        </p>

                                        <p className="section_desc" contentEditable={isEditMode}
                                            onBlur={handleContentChange}
                                            data-content-key="contentSeven"
                                            suppressContentEditableWarning
                                            style={{ minHeight: '1em', border: isEditMode ? '1px dashed gray' : 'none', padding: '4px' }}
                                        >
                                            {webContents?.contentSeven || ''}
                                        </p>

                                        <p className="section_desc" contentEditable={isEditMode}
                                            onBlur={handleContentChange}
                                            data-content-key="contentEight"
                                            suppressContentEditableWarning
                                            style={{ minHeight: '1em', border: isEditMode ? '1px dashed gray' : 'none', padding: '4px' }}
                                        >
                                            {webContents?.contentEight || ''}
                                        </p>

                                        <p className="section_desc" contentEditable={isEditMode}
                                            onBlur={handleContentChange}
                                            data-content-key="contentNine"
                                            suppressContentEditableWarning
                                            style={{ minHeight: '1em', border: isEditMode ? '1px dashed gray' : 'none', padding: '4px' }}
                                        >
                                            {webContents?.contentNine || ''}
                                        </p>
                                    </Fade>

                                    <Slide direction="up" delay={200} duration={1500} triggerOnce>
                                        <div className="home_hero_buttons justify-content-start">
                                            <Button
                                                icon={`ri ri-customer-service-fill`}
                                                label="Contact us"
                                                className="custom_button secondary custom"
                                                onClick={() => scrollToSection("contact")}
                                            />
                                        </div>
                                    </Slide>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-xl-6">
                            <div className="">
                                {isEditMode && <Edit size={16} className="ms-2 " onClick={(() => {
                                    setOpenImageEditor(true);
                                    setContentKeyForImageEditor('contentTenViewUrl');
                                })} />}
                            </div>
                            <Fade triggerOnce duration={1500} className="w-100">
                                <div className="section_image_area">
                                    <img src={webContents?.contentTenViewUrl} alt="" />
                                </div>
                            </Fade>
                        </div>
                    </div>
                </div>
            </section>
            {/*  */}

            {/* Feature section */}
            <section className="page_section features_section" id="features">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <div className="section_body">
                                <Slide direction="up" triggerOnce>
                                    <h3 className="section_title text-center">
                                        <span>Key Features</span> of Kover Drive Sports
                                    </h3>
                                </Slide>

                                <Slide direction="up" delay={100} triggerOnce>
                                    <h4 className="section_sub_title text-center" contentEditable={isEditMode}
                                        onBlur={handleContentChange}
                                        data-content-key="contentEleven"
                                        suppressContentEditableWarning
                                        style={{ minHeight: '1em', border: isEditMode ? '1px dashed gray' : 'none', padding: '4px' }}
                                    >
                                        {webContents?.contentEleven || ''}
                                    </h4>
                                </Slide>

                                <div className="section_content">
                                    {isEditMode && <div className="d-flex justify-content-end mb-3">
                                        <Button
                                            icon={<Plus size={16} />}
                                            label="Add Feature"
                                            className="p-button-rounded p-button-success p-button-sm"
                                            onClick={handleAddFeature}
                                        />
                                    </div>}

                                    {webContents?.contentTwelve && Array.isArray(webContents?.contentTwelve) && (
                                        <div className="row features_row">
                                            {webContents?.contentTwelve?.map((feature, index) => (
                                                <div key={feature?.id} className="col-12 col-xl-4 col-md-6 col-sm-8 mx-auto features_col">
                                                    <Slide direction="up" delay={index * 50} triggerOnce className="feature_card_area h-100">
                                                        <article className="feature_card">
                                                            <div className="feature_card_header d-flex justify-content-between align-items-center">
                                                                <div className="d-flex align-items-center">
                                                                    <div className="feature_icon_area">
                                                                        <img src={feature?.icon} alt={feature?.name} />
                                                                    </div>
                                                                    <h5 className="feature_title">
                                                                        {feature?.name}
                                                                    </h5>
                                                                </div>
                                                                {isEditMode && <div className="d-flex gap-1">
                                                                    <Button
                                                                        icon={<Pencil size={16} />}
                                                                        className="p-button-rounded p-button-info p-button-text"
                                                                        onClick={() => handleEditFeature(feature)}
                                                                    />
                                                                    {webContents.contentTwelve.length > 1 && (
                                                                        <Button
                                                                            icon={<Trash2 size={16} />}
                                                                            className="p-button-rounded p-button-danger p-button-text"
                                                                            onClick={() => handleDeleteFeature(feature.id || '')}
                                                                        />
                                                                    )}
                                                                </div>}
                                                            </div>

                                                            <div className="feature_card_body">
                                                                <p className="feature_desc">
                                                                    {feature?.description}
                                                                </p>
                                                            </div>
                                                        </article>
                                                    </Slide>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <FeatureFormModal
                                        visible={featureModalVisible}
                                        onHide={() => { setFeatureModalVisible(false); setCurrentEditFeature(null); }}
                                        onSubmit={handleSubmitFeature}
                                        editData={currentEditFeature}
                                        isEdit={isFeatureEdit}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*  */}

            {/* Contact us section */}
            <section className="page_section contact_us_section" id="contact">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <div className="section_body">
                                <Slide direction="up" triggerOnce>
                                    <h3 className="section_title text-center">
                                        <span>Get in touch</span> with us
                                    </h3>
                                </Slide>

                                <Slide direction="up" delay={100} triggerOnce>
                                    <h4 className="section_sub_title text-center">
                                        We're Here to Help – Reach Out Today!
                                    </h4>
                                </Slide>

                                <div className="section_content">
                                    <div className="row contact_us_row">
                                        <div className="col-12 col-md-12 col-sm-8 mx-auto col-lg-4">
                                            <Zoom triggerOnce className="h-100">
                                                <article className="contact_us_card">
                                                    <div className="contact_card_icon">
                                                        <i className="bi bi-geo-alt-fill"></i>
                                                    </div>
                                                    <h4 className="contact_card_head">
                                                        Location
                                                    </h4>
                                                    <div className="contact_card_link_group">
                                                        <Link to={`https://maps.app.goo.gl/XtnfBT1nHxvnLZDZ7`} target="_blank">
                                                            1299 Oxford St E, London, ON N5Y 4W5, Canada
                                                        </Link>
                                                    </div>
                                                </article>
                                            </Zoom>
                                        </div>

                                        <div className="col-12 col-md-6 col-sm-8 mx-auto col-lg-4">
                                            <Zoom triggerOnce delay={100} className="h-100">
                                                <article className="contact_us_card high_lighted">
                                                    <div className="contact_card_icon">
                                                        <i className="bi bi-telephone-fill"></i>
                                                    </div>
                                                    <h4 className="contact_card_head">
                                                        Give us a call
                                                    </h4>
                                                    <div className="contact_card_link_group">
                                                        <Link to={`tel:+14036811246`}>
                                                            +1 (403) 681-1246
                                                        </Link>
                                                        <span>|</span>
                                                        <Link to={`tel:+15197022683`}>
                                                            +1 (519) 702-2683
                                                        </Link>
                                                    </div>
                                                </article>
                                            </Zoom>
                                        </div>

                                        <div className="col-12 col-md-6 col-sm-8 mx-auto col-lg-4">
                                            <Zoom triggerOnce delay={200} className="h-100">
                                                <article className="contact_us_card">
                                                    <div className="contact_card_icon">
                                                        <i className="bi bi-envelope-fill"></i>
                                                    </div>
                                                    <h4 className="contact_card_head">
                                                        Email us
                                                    </h4>
                                                    <div className="contact_card_link_group">
                                                        <Link to={`mailto:koverdrivelondonon@gmail.com`}>
                                                            koverdrivelondonon@gmail.com
                                                        </Link>
                                                    </div>
                                                </article>
                                            </Zoom>
                                        </div>
                                    </div>

                                    <div className="section_content_sub">
                                        <div className="row">
                                            <div className="col-12">
                                                <Fade triggerOnce delay={100} className="h-100">
                                                    <article className="contact_form_card">
                                                        <div className="row">
                                                            <div className="col-12 col-lg-6 pe-lg-0">
                                                                <iframe
                                                                    title="Kover Drive"
                                                                    className="map_container"
                                                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2917.6494829276908!2d-81.2110879!3d43.006714800000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x882eed006ba619d1%3A0xe9205b592e1f63be!2sKover%20Drive%20Sports!5e0!3m2!1sen!2slk!4v1739845810056!5m2!1sen!2slk"
                                                                    allowFullScreen
                                                                    loading="lazy"
                                                                    referrerPolicy="no-referrer-when-downgrade"
                                                                ></iframe>
                                                            </div>
                                                            <div className="col-12 col-lg-6 ps-lg-0">

                                                                <form className="contact_form" onSubmit={handleSubmitContactForm}>
                                                                    <div className="row">
                                                                        <div className="col-12">
                                                                            <h4 className="contact_form_head">Reach us</h4>
                                                                        </div>

                                                                        <div className="col-12 col-sm-6">
                                                                            <TextInput
                                                                                id="name"
                                                                                label="Name"
                                                                                labelHtmlFor="name"
                                                                                required={true}
                                                                                inputType="text"
                                                                                value={reachUsForm?.name}
                                                                                placeholder="Your name"
                                                                                onChange={handleInputChange}
                                                                                error={(isRequired && !reachUsForm.name) ? "Name is required!" : ""}
                                                                                name="name"
                                                                            />
                                                                        </div>

                                                                        <div className="col-12 col-sm-6">
                                                                            <TextInput
                                                                                id="email"
                                                                                label="Email"
                                                                                labelHtmlFor="email"
                                                                                required={true}
                                                                                inputType="email"
                                                                                value={reachUsForm.email}
                                                                                placeholder="Your email"
                                                                                onChange={handleInputChange}
                                                                                error={(isRequired && !reachUsForm.email) ? "Email is required!" : (!emailRegex.test(reachUsForm?.email) && reachUsForm?.email) ? "Please enter valid email!" : ""}
                                                                                name="email"
                                                                            />
                                                                        </div>

                                                                        <div className="col-12">
                                                                            <TextInput
                                                                                id="subject"
                                                                                label="Subject"
                                                                                labelHtmlFor="subject"
                                                                                required={true}
                                                                                inputType="text"
                                                                                value={reachUsForm.subject}
                                                                                placeholder="Subject"
                                                                                onChange={handleInputChange}
                                                                                error={(isRequired && !reachUsForm.subject) ? "Subject is required!" : ""}
                                                                                name="subject"
                                                                            />
                                                                        </div>

                                                                        <div className="col-12">
                                                                            <TextArea
                                                                                id="message"
                                                                                label="Message"
                                                                                labelHtmlFor="message"
                                                                                required={true}
                                                                                value={reachUsForm.message}
                                                                                placeholder="Your message"
                                                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setReachUsForm({ ...reachUsForm, message: e.target.value })}
                                                                                error={(isRequired && !reachUsForm.message) ? "Message is required!" : ""}

                                                                            />
                                                                        </div>

                                                                        <div className="col-12">
                                                                            <Button
                                                                                loading={loading}
                                                                                type="submit"
                                                                                label="Submit"
                                                                                className="custom_btn primary"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </article>
                                                </Fade>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/*  */}

            <ImageEditorNew
                isOpen={openImageEditor}
                onClose={() => { setOpenImageEditor(false); setContentKeyForImageEditor(undefined); }}
                onSave={handleOnSaveForImageEditor}
                acceptedFileTypes={['.jpg', '.jpeg', '.png']}
                maxFileSize={5 * 1024 * 1024} // 5MB
            />
        </>
    );
};

export default Home;

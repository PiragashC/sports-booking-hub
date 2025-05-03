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
import { emailRegex, removeEmptyValues, showErrorToast, showSuccessToast, useUploadStatus } from "../../Utils/commonLogic";
import { Toast } from "primereact/toast";
import { ImageEditorNew } from "../../Components/ImageEditor/ImageEditor";
import { Edit, PenSquare, PlusCircle, Trash2, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { useDeleteConfirmation } from "../../Components/DeleteConfirmationDialog";
import { CardFormModal } from "./CardFormModal";
import { FeatureFormModal } from "./FeatureFormModal";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { postWebContentsThunk } from "../../redux/webContentSlice";
import { uploadImageService } from "../../Utils/commonService";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper/types';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import MediaUploadToast from "../../Components/MediaUploadToast";
import AppLoader from "../../Components/AppLoader";
import { confirmDialog } from "primereact/confirmdialog";

const Home: React.FC = () => {
    const toastRef = useRef<Toast>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [isScrolled, setIsScrolled] = useState<boolean>(false);
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

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

    const isEditMode = useSelector((state: RootState) => state.ui.editMode);

    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
    const dispatch = useAppDispatch();
    const { data, loading: WebContenLoading, error, postStatus } = useAppSelector((state) => state.webContent);
    const [webContents, setWebContents] = useState<WebContent>(initialWebContents);
    const uploadStatus = useUploadStatus();

    const [openImageEditor, setOpenImageEditor] = useState<boolean>(false);
    const [contentKeyForImageEditor, setContentKeyForImageEditor] = useState<'contentFour' | 'contentTen'>();

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

        // setWebContents(updatedContent);

        dispatch(postWebContentsThunk({
            webContent: updatedContent,
            toastRef: toastRef
        })).unwrap();
    };


    const handleDeleteCard = (id: number | string) => {
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

                // setWebContents(updatedContent);
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

        // setWebContents(updatedContent);
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

                // setWebContents(updatedContent);
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
            // setWebContents(prevContents => {
            //     const updatedContent = {
            //         ...prevContents,
            //         [contentKey]: target.innerText
            //     };

            //     // Dispatch after state update
            //     dispatch(postWebContentsThunk({
            //         webContent: updatedContent,
            //         toastRef: toastRef
            //     })).unwrap();
            //     return updatedContent;
            // });
            const updatedContent = {
                ...webContents,
                [contentKey]: target.innerText
            };

            // Dispatch after state update
            dispatch(postWebContentsThunk({
                webContent: updatedContent,
                toastRef: toastRef
            })).unwrap();
        }
    };

    const handleOnSaveForImageEditor = async (file: File) => {
        if (!contentKeyForImageEditor) return;

        try {
            uploadStatus.startUpload([file]);
            const imagePaths = await uploadImageService(
                [file],
                token,
                (index, progress) => {
                    uploadStatus.updateStatus(index, { progress });
                }
            );

            const permanentUrl = imagePaths[0];
            uploadStatus.updateStatus(0, { status: 'success' });

            const updatedContent = {
                ...webContents,
                [contentKeyForImageEditor]: permanentUrl
            };

            await dispatch(postWebContentsThunk({
                webContent: updatedContent,
                toastRef: toastRef
            })).unwrap();

        } catch (error) {
            console.error('Upload failed:', error);
            uploadStatus.updateStatus(0, {
                status: 'error',
                error: error instanceof Error ? error.message : 'Upload failed'
            });
            showErrorToast(toastRef, 'Image upload failed', 'Please try again');
        } finally {
            // Clear after a short delay to allow users to see the final status
            setTimeout(() => {
                uploadStatus.resetUploadStatus();
            }, 2000); // 2 seconds delay
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

    useEffect(() => { if (error) showErrorToast(toastRef, 'Web Content Error', error) }, [error]);

    useEffect(() => { setWebContents(data || initialWebContents) }, [data, dispatch]);


    const handleResetContent = (content?: string) => {
        confirmDialog({
            message: 'Are you sure you want to reset this content?',
            header: 'Confirmation',
            headerClassName: 'confirmation_succcess',
            icon: 'bi bi-info-circle',
            defaultFocus: 'accept',
            acceptClassName: 'p-button-success',
            rejectClassName: 'p-button-secondary',
            dismissableMask: true,
            accept: () => resetContent(content!)
        });
    }

    const resetContent = (content: string) => {

    }

    return (
        <React.Fragment>
            <AppLoader
                visible={!webContents || WebContenLoading || postStatus === 'loading'}
                title="Loading..."
                message="Please wait, Processing your request..."
                backdropBlur
            />

            <Toast ref={toastRef} />

            <MediaUploadToast
                loading={uploadStatus.isUploading}
                fileStatuses={uploadStatus.fileStatuses}
            />

            {/* Hero section */}
            <section className={`home_hero_section page_init_section ${isScrolled && 'scrolled'}`} overflow-hidden id="home" style={{
                backgroundImage: `url(${webContents.contentFourViewUrl})`
            }}>
                {isEditMode && (
                    <div className="image_edit_btn_area pos_abs at_hero_sec">
                        <Button
                            icon={<Edit size={16} />}
                            label="Edit"
                            className="image_edit_btn"
                            onClick={(() => {
                                setOpenImageEditor(true);
                                setContentKeyForImageEditor('contentFour');
                            })}
                        />
                        <Button
                            icon={<RotateCcw size={16} />}
                            className="image_edit_btn icon_only"
                            onClick={() => handleResetContent('heroImage')}
                        />
                    </div>
                )}
                <div className="container-md">
                    <div className="row">
                        <div className="col-12">
                            <article className="home_hero_content">
                                <Slide direction="up" triggerOnce>
                                    <h1>
                                        Welcome to <span>Kover<span>Drive</span></span> Sports
                                    </h1>
                                </Slide>

                                <Slide direction="up" delay={100} triggerOnce>
                                    <div className="content_in_edit_mode_area">
                                        <h2
                                            className={isEditMode ? 'content_in_edit_mode' : ''}
                                            contentEditable={isEditMode}
                                            onBlur={handleContentChange}
                                            data-content-key="contentOne"
                                            suppressContentEditableWarning
                                        >
                                            {webContents?.contentOne || ''}
                                        </h2>

                                        {isEditMode && (
                                            <button className="content_reset_button"
                                                onClick={() => handleResetContent(webContents?.contentOne)}>
                                                <i className="bi bi-arrow-counterclockwise"></i>
                                            </button>
                                        )}
                                    </div>
                                </Slide>

                                <Slide direction="up" delay={200} triggerOnce>
                                    <div className="content_in_edit_mode_area">
                                        <p
                                            className={isEditMode ? 'content_in_edit_mode' : ''}
                                            contentEditable={isEditMode}
                                            onBlur={handleContentChange}
                                            data-content-key="contentTwo"
                                            suppressContentEditableWarning
                                        >
                                            {webContents?.contentTwo || ''}
                                        </p>

                                        {isEditMode && (
                                            <button className="content_reset_button"
                                                onClick={() => handleResetContent(webContents?.contentTwo)}>
                                                <i className="bi bi-arrow-counterclockwise"></i>
                                            </button>
                                        )}
                                    </div>
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
                            <div className="booking_card_area">
                                <button
                                    ref={prevRef}
                                    className="book_card_swiper_nav_btn prev">
                                    <ChevronLeft size={25} />
                                </button>

                                <button
                                    ref={nextRef}
                                    className="book_card_swiper_nav_btn next">
                                    <ChevronRight size={25} />
                                </button>

                                {webContents?.contentThree && Array.isArray(webContents?.contentThree) &&
                                    <Swiper
                                        modules={[Autoplay, Navigation]}
                                        spaceBetween={10}
                                        slidesPerView={1}
                                        grabCursor={true}
                                        autoplay={{ delay: 3000, disableOnInteraction: false, waitForTransition: true }}
                                        navigation={{
                                            prevEl: prevRef.current,
                                            nextEl: nextRef.current,
                                        }}
                                        speed={1500}
                                        loop={true}
                                        onSlideChange={() => console.log('slide change')}
                                        onBeforeInit={(swiper: SwiperClass) => {
                                            const navigation = swiper.params.navigation;
                                            if (navigation && typeof navigation !== 'boolean') {
                                                navigation.prevEl = prevRef.current;
                                                navigation.nextEl = nextRef.current;
                                            }
                                        }}
                                    >
                                        {webContents.contentThree.map((content) => (
                                            <SwiperSlide key={content.id}>
                                                <Zoom
                                                    // direction="up"
                                                    delay={100}
                                                >
                                                    <article className="home_hero_card">
                                                        <div className={`home_hero_card_header ${isEditMode ? 'editable_mode' : ''}`}>
                                                            <h4>{content?.laneCardTitle}</h4>
                                                            {isEditMode &&
                                                                <div className="hero_card_edit_btn_area">
                                                                    <Button
                                                                        icon={<PenSquare size={20} />}
                                                                        className="action_btn icon_only success"
                                                                        onClick={() => handleEditCard(content)}
                                                                    />
                                                                    {webContents.contentThree.length > 1 && (
                                                                        <Button
                                                                            icon={<Trash2 size={20} />}
                                                                            className="action_btn icon_only danger"
                                                                            onClick={() => handleDeleteCard(content.id || '')}
                                                                        />
                                                                    )}
                                                                </div>
                                                            }
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
                                                            <div className="home_hero_buttons mt-2">
                                                                <Button
                                                                    label={content?.laneCardTitle}
                                                                    className="custom_button primary"
                                                                    onClick={handleNavigateBooking}
                                                                />
                                                            </div>
                                                        </div>
                                                    </article>
                                                </Zoom>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                }
                            </div>

                            {isEditMode && (
                                <Slide direction="up" delay={100} triggerOnce>
                                    <div className="add_data_btn_area">
                                        <Button
                                            icon={<PlusCircle size={20} />}
                                            label="Add new"
                                            className="add_data_button p-button-success"
                                            onClick={handleAddCard}
                                        />

                                        <Button
                                            icon={<RotateCcw size={20} />}
                                            className="add_data_button icon_only p-button-success"
                                            onClick={() => handleResetContent('homeCard')}
                                        />
                                    </div>
                                </Slide>
                            )}

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
                                    <div className="content_in_edit_mode_area ms-0">
                                        <h4 className={`section_sub_title ${isEditMode ? 'content_in_edit_mode' : ''}`}
                                            contentEditable={isEditMode}
                                            onBlur={handleContentChange}
                                            data-content-key="contentFive"
                                            suppressContentEditableWarning
                                        >
                                            {webContents?.contentFive || ''}
                                        </h4>

                                        {isEditMode && (
                                            <button className="content_reset_button"
                                                onClick={() => handleResetContent(webContents?.contentFive)}>
                                                <i className="bi bi-arrow-counterclockwise"></i>
                                            </button>
                                        )}
                                    </div>
                                </Slide>

                                <div className="section_content">
                                    <Fade triggerOnce>
                                        <div className="content_in_edit_mode_area">
                                            <p className={`section_desc ${isEditMode ? 'content_in_edit_mode' : ''}`}
                                                contentEditable={isEditMode}
                                                onBlur={handleContentChange}
                                                data-content-key="contentSix"
                                                suppressContentEditableWarning
                                            >
                                                {webContents?.contentSix || ''}

                                            </p>
                                            {isEditMode && (
                                                <button className="content_reset_button"
                                                    onClick={() => handleResetContent(webContents?.contentSix)}>
                                                    <i className="bi bi-arrow-counterclockwise"></i>
                                                </button>
                                            )}
                                        </div>

                                        <div className="content_in_edit_mode_area">
                                            <p className={`section_desc ${isEditMode ? 'content_in_edit_mode' : ''}`}
                                                contentEditable={isEditMode}
                                                onBlur={handleContentChange}
                                                data-content-key="contentSeven"
                                                suppressContentEditableWarning
                                            >
                                                {webContents?.contentSeven || ''}
                                            </p>

                                            {isEditMode && (
                                                <button className="content_reset_button"
                                                    onClick={() => handleResetContent(webContents?.contentSeven)}>
                                                    <i className="bi bi-arrow-counterclockwise"></i>
                                                </button>
                                            )}
                                        </div>

                                        <div className="content_in_edit_mode_area">
                                            <p className={`section_desc ${isEditMode ? 'content_in_edit_mode' : ''}`}
                                                contentEditable={isEditMode}
                                                onBlur={handleContentChange}
                                                data-content-key="contentEight"
                                                suppressContentEditableWarning
                                            >
                                                {webContents?.contentEight || ''}
                                            </p>

                                            {isEditMode && (
                                                <button className="content_reset_button"
                                                    onClick={() => handleResetContent(webContents?.contentEight)}>
                                                    <i className="bi bi-arrow-counterclockwise"></i>
                                                </button>
                                            )}
                                        </div>

                                        <div className="content_in_edit_mode_area">
                                            <p className={`section_desc ${isEditMode ? 'content_in_edit_mode' : ''}`}
                                                contentEditable={isEditMode}
                                                onBlur={handleContentChange}
                                                data-content-key="contentNine"
                                                suppressContentEditableWarning
                                            >
                                                {webContents?.contentNine || ''}
                                            </p>

                                            {isEditMode && (
                                                <button className="content_reset_button"
                                                    onClick={() => handleResetContent(webContents?.contentNine)}>
                                                    <i className="bi bi-arrow-counterclockwise"></i>
                                                </button>
                                            )}
                                        </div>
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
                            <Fade triggerOnce duration={1500} className="w-100">
                                <div className="section_image_area">
                                    {isEditMode && (
                                        <React.Fragment>
                                            <div className="image_edit_btn_area pos_abs">
                                                <Button
                                                    icon={<Edit size={16} />}
                                                    label="Edit"
                                                    className="image_edit_btn"
                                                    onClick={(() => {
                                                        setOpenImageEditor(true);
                                                        setContentKeyForImageEditor('contentTen');
                                                    })}
                                                />
                                                <Button
                                                    icon={<RotateCcw size={16} />}
                                                    className="image_edit_btn icon_only"
                                                    onClick={() => handleResetContent('aboutImage')}
                                                />
                                            </div>
                                        </React.Fragment>
                                    )}
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
                                    <div className="content_in_edit_mode_area">
                                        <h4 className={`section_sub_title text-center ${isEditMode ? 'content_in_edit_mode' : ''}`}
                                            contentEditable={isEditMode}
                                            onBlur={handleContentChange}
                                            data-content-key="contentEleven"
                                            suppressContentEditableWarning
                                        >
                                            {webContents?.contentEleven || ''}
                                        </h4>

                                        {isEditMode && (
                                            <button className="content_reset_button"
                                                onClick={() => handleResetContent(webContents?.contentEleven)}>
                                                <i className="bi bi-arrow-counterclockwise"></i>
                                            </button>
                                        )}
                                    </div>
                                </Slide>

                                <div className="section_content">
                                    {webContents?.contentTwelve && Array.isArray(webContents?.contentTwelve) && (
                                        <div className="row features_row">
                                            {webContents?.contentTwelve?.map((feature, index) => (
                                                <div key={feature?.id} className="col-12 col-xl-4 col-md-6 col-sm-8 mx-auto features_col">
                                                    <Slide direction="up" delay={index * 50} triggerOnce className="feature_card_area h-100">
                                                        <article className="feature_card">
                                                            <div className="feature_card_header">
                                                                <div className="feature_icon_area">
                                                                    <img src={feature?.icon} alt={feature?.name} />
                                                                </div>
                                                                <h5 className="feature_title">
                                                                    {feature?.name}
                                                                </h5>
                                                            </div>

                                                            <div className={`feature_card_body ${isEditMode ? 'fix_height' : ''}`}>
                                                                <p className="feature_desc">
                                                                    {feature?.description}
                                                                </p>
                                                            </div>

                                                            {isEditMode && (
                                                                <div className="feature_card_footer">
                                                                    <div className="feature_action_btn_area">
                                                                        <Button
                                                                            icon={<PenSquare size={15} />}
                                                                            className="action_btn success"
                                                                            label="Edit"
                                                                            onClick={() => handleEditFeature(feature)}
                                                                        />
                                                                        {webContents.contentTwelve.length > 1 && (
                                                                            <Button
                                                                                icon={<Trash2 size={16} />}
                                                                                className="action_btn danger"
                                                                                label="Delete"
                                                                                onClick={() => handleDeleteFeature(feature.id || '')}
                                                                            />
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </article>
                                                    </Slide>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {isEditMode && (
                                        <Slide direction="up" delay={100} triggerOnce>
                                            <div className="add_data_btn_area">
                                                <Button
                                                    icon={<PlusCircle size={20} />}
                                                    label="Add new feature"
                                                    className="add_data_button p-button-success"
                                                    onClick={handleAddFeature}
                                                />

                                                <Button
                                                    icon={<RotateCcw size={20} />}
                                                    className="add_data_button icon_only p-button-success"
                                                    onClick={() => handleResetContent('featureCard')}
                                                />
                                            </div>
                                        </Slide>
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


            {/* Image editor */}
            <ImageEditorNew
                isOpen={openImageEditor}
                onClose={() => { setOpenImageEditor(false); setContentKeyForImageEditor(undefined); }}
                onSave={handleOnSaveForImageEditor}
                acceptedFileTypes={['.jpg', '.jpeg', '.png']}
                maxFileSize={5 * 1024 * 1024} // 5MB
            />
            {/*  */}
        </React.Fragment>
    );
};

export default Home;

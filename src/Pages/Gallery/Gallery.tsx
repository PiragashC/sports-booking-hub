import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Gallery.css';
import './Gallery-responsive.css';

import { Toast } from "primereact/toast";
import { Ripple } from "primereact/ripple";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { Image } from "primereact/image";

import { Fade, Zoom } from "react-awesome-reveal";

import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import Masonry from "react-masonry-css";

import BreadCrumbSection from "../../Components/BreadCrumbSection";
import NoData from "../../Components/NoData";
import TextInput from "../../Components/TextInput";
import MulipleFileInput from "../../Components/MulipleFileInput";

import { GalleryList, galleryList } from "./GallerySampleData";

const Gallery: React.FC = () => {
    const toastRef = useRef<Toast>(null);
    const [dataState, setDataState] = useState<'Add' | 'Edit'>('Add');
    const [loading, setLoading] = useState<boolean>(false);
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const today = new Date();
    const token = 'test';

    const [galleryData, setGalleryData] = useState<GalleryList[]>([]);
    const [filteredgalleryData, setFilteredGalleryData] = useState<GalleryList[]>([]);
    const [imageSearchKey, setImageSearchKey] = useState<string>('');
    const [imageState, setImageState] = useState<'All' | 'Visible' | 'Hidden'>('All');
    const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryList | null>(null);

    const [contentEditable, setContentEditable] = useState<boolean>(true);
    const [actionButtonHoverd, setActionButtonHoverd] = useState<boolean>(false);

    const [showGalleryModal, setShowGalleryModal] = useState<boolean>(false);

    /* Form fields */
    const [title, setTitle] = useState<string>('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [status, setStatus] = useState<boolean>(true);


    useEffect(() => {
        setContentEditable(!!token);
    }, [token]);

    useEffect(() => {
        if (galleryList && galleryList.length > 0) {
            const activeData = galleryList.filter(item => item.status === true);
            setGalleryData(token ? galleryList : activeData);
        } else {
            setGalleryData([]);
        }
    }, [galleryList, token]);

    useEffect(() => {
        let filteredData = [...galleryData];

        if (imageSearchKey) {
            filteredData = filteredData.filter(event =>
                event.title?.toLowerCase().includes(imageSearchKey.toLowerCase())
            );
        }

        if (imageState === 'Visible') {
            filteredData = filteredData.filter(event => event.status === true);
        } else if (imageState === 'Hidden') {
            filteredData = filteredData.filter(event => event.status === false);
        }

        setFilteredGalleryData(filteredData);
    }, [imageSearchKey, imageState, galleryData]);

    const handleChangeImageState = (state: 'All' | 'Visible' | 'Hidden') => {
        setImageState(state);
    }

    const handleCloseGalleryModal = () => {
        setShowGalleryModal(false);
        handleClearGalleryFields();
    }

    const handleClearGalleryFields = () => {
        setTitle("");
        setImageFiles([]);
        setStatus(true);
    }

    const handleAddImage = () => {
        setDataState('Add');
        setShowGalleryModal(true);
    }

    const handleEditImage = (image: GalleryList) => {
        setDataState('Edit');
        setShowGalleryModal(true);

    }

    const handleSaveImage = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

    }

    const handleUpdateImage = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

    }

    const handleDeleteImage = (image: GalleryList) => {
        const imageId = image?.id;
        console.log(imageId)

        confirmDialog({
            message: 'Are you sure you want to delete this image?',
            header: 'Confirm the deletion',
            headerClassName: 'confirmation_danger',
            icon: 'bi bi-info-circle',
            defaultFocus: 'accept',
            acceptClassName: 'p-button-danger',
            rejectClassName: 'p-button-secondary',
            dismissableMask: true,
            accept: () => deleteImage(imageId!)
        });
    }

    const deleteImage = async (imageId: string) => {
        try {
            if (toastRef.current) {
                toastRef.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Image deleted successfully.",
                    life: 3000,
                });
            }
        } catch (error) {
            if (toastRef.current) {
                toastRef.current.show({
                    severity: "error",
                    summary: "Failed",
                    detail: "There was an error deleting the image.",
                    life: 3000,
                });
            }
        }
    }

    const galleryModalHeader = (
        <div className="custom_modal_header_inner">
            <h5 className="modal-title fs-5">
                <i className={`bi ${dataState === 'Add' ? ' bi-plus-square' : ' bi-pencil-square'} me-2 modal_head_icon`}></i>
                {dataState} Image(s)
            </h5>
            <button
                type="button"
                aria-label="Close"
                className="close_modal_btn p-ripple"
                onClick={handleCloseGalleryModal}
            >
                <i className="bi bi-x-circle"></i>
                <Ripple />
            </button>
        </div>
    )

    const galleryModalFooter = (
        <div className="custom_modal_footer">
            <Button
                label="Cancel"
                className="custom_btn secondary"
                onClick={handleCloseGalleryModal}
            />

            <Button
                label={`${loading ? 'Processing' : dataState === 'Add' ? 'Save' : 'Update'}`}
                onClick={dataState === 'Add' ? handleSaveImage : handleUpdateImage}
                loading={loading}
                className="custom_btn primary"
            />
        </div>
    )

    const handleFilesUpload = (files: File[]) => {
        setImageFiles(files);
    };

    const handleClearFiles = () => {
        setImageFiles([]);
    };

    const handleClearFile = (index: number) => {
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 2,
    };

    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            const element = document.querySelector('.PhotoView-Portal') as HTMLElement;
            if (element) {
                element.requestFullscreen();
            }
        }
    };


    const handleFullscreenChange = () => {
        setIsFullscreen(!!document.fullscreenElement);
    };

    React.useEffect(() => {
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    return (
        <React.Fragment>
            <Toast ref={toastRef} />
            <ConfirmDialog />

            <BreadCrumbSection
                title={'Gallery'}
                parentTitle={'Home'}
                parentIcon={'bi-house-fill'}
                parentLink={`/`}
                activeIcon={'bi-image-fill'}
            />

            <section className="page_section gallery_section">
                <div className="container-md">
                    <div className="gallery_content">
                        {contentEditable && (
                            <Fade triggerOnce className="w-100">
                                <div className="customize_data_container">
                                    <div className="customize_data_area">
                                        <div className="customize_data_sub">
                                            <h5>
                                                <i className="bi bi-pencil-square me-2"></i>
                                                Customize Gallery
                                            </h5>
                                            <p>Total images: {String(galleryData?.length).padStart(2, '0')}</p>
                                        </div>

                                        <button
                                            className="new_data_button m-0 is_btn p-ripple"
                                            aria-label="New Event"
                                            onClick={handleAddImage}>
                                            <i className="bi bi-plus-circle"></i>
                                            <span>Add Image</span>
                                            <Ripple />
                                        </button>
                                    </div>

                                    <div className="customize_data_area ">
                                        <div className="data_tab_area">
                                            <button
                                                className={`data_tab_btn ${imageState === 'All' ? 'active' : ''} p-ripple`}
                                                type="button"
                                                onClick={() => handleChangeImageState('All')}>
                                                All
                                                <Ripple pt={{ root: { style: { background: 'rgba(0, 70, 128, 0.2)' } } }} />
                                            </button>
                                            <button
                                                className={`data_tab_btn ${imageState === 'Visible' ? 'active' : ''} p-ripple`}
                                                type="button"
                                                onClick={() => handleChangeImageState('Visible')}>
                                                Active
                                                <Ripple pt={{ root: { style: { background: 'rgba(0, 70, 128, 0.2)' } } }} />
                                            </button>
                                            <button
                                                className={`data_tab_btn ${imageState === 'Hidden' ? 'active' : ''} p-ripple`}
                                                type="button"
                                                onClick={() => handleChangeImageState('Hidden')}>
                                                Inactive
                                                <Ripple pt={{ root: { style: { background: 'rgba(0, 70, 128, 0.2)' } } }} />
                                            </button>
                                        </div>

                                        <IconField iconPosition="left">
                                            <InputIcon className="bi bi-search"></InputIcon>
                                            <InputText
                                                placeholder="Search image by title..."
                                                className="search_input"
                                                value={imageSearchKey}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImageSearchKey(e.target.value)}
                                                type="search"
                                            />
                                        </IconField>
                                    </div>
                                </div>
                            </Fade>
                        )}

                        {filteredgalleryData && filteredgalleryData?.length > 0 ? (
                            <PhotoProvider
                                toolbarRender={({ rotate, onRotate, onScale, scale }) => {
                                    return (
                                        <React.Fragment>
                                            <i className="ri-zoom-in-line photoview_tool_icon"
                                                onClick={() => onScale(scale + 0.2)}
                                            ></i>

                                            <i className="ri-zoom-out-line photoview_tool_icon"
                                                onClick={() => onScale(scale - 0.2)}
                                            ></i>

                                            <i className="bi bi-arrow-clockwise photoview_tool_icon"
                                                onClick={() => onRotate(rotate + 90)}
                                            ></i>

                                            <i className="bi bi-arrow-counterclockwise photoview_tool_icon"
                                                onClick={() => onRotate(rotate - 90)}
                                            ></i>

                                            {document.fullscreenEnabled && (
                                                <i className={`${isFullscreen ? 'ri-fullscreen-exit-fill' : 'ri-fullscreen-fill'} photoview_tool_icon`}
                                                    onClick={toggleFullScreen}
                                                ></i>
                                            )}
                                        </React.Fragment>
                                    )
                                }}>
                                <Masonry
                                    breakpointCols={breakpointColumnsObj}
                                    className="my-masonry-grid"
                                    columnClassName="my-masonry-grid_column"
                                >
                                    {filteredgalleryData.map((item) => (
                                        <Zoom
                                            key={item.id}
                                            duration={1000}
                                            triggerOnce
                                            cascade
                                        >
                                            <div className="gallery_img_container p-ripple">
                                                <PhotoView src={item.image || ''}>
                                                    <img
                                                        src={item.image}
                                                        alt={item.title}
                                                        className="gallery-image"
                                                        loading="lazy"
                                                    />
                                                </PhotoView>
                                                <div className="img_title_area">
                                                    <span>{item?.title}</span>
                                                </div>

                                                {contentEditable && (
                                                    <div className="event_action_btn_grp">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditImage(item);
                                                            }}
                                                            onMouseOver={() => setActionButtonHoverd(true)}
                                                            onMouseLeave={() => setActionButtonHoverd(false)}
                                                            className="event_action_btn custom edit is_btn p-ripple"
                                                        >
                                                            <i className="bi bi-pencil-square"></i>
                                                            Edit
                                                            <Ripple />
                                                        </button>

                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteImage(item);
                                                            }}
                                                            onMouseOver={() => setActionButtonHoverd(true)}
                                                            onMouseLeave={() => setActionButtonHoverd(false)}
                                                            className="event_action_btn custom delete is_btn p-ripple"
                                                        >
                                                            <i className="bi bi-trash3"></i>
                                                            <Ripple />
                                                        </button>
                                                    </div>
                                                )}
                                                {!actionButtonHoverd && <Ripple />}
                                            </div>
                                        </Zoom>
                                    ))}
                                </Masonry>
                            </PhotoProvider>
                        ) : (
                            <NoData
                                showImage={true}
                                message="Oops! No images found!"
                            />
                        )}
                    </div>
                </div>
            </section>


            {/* Gallery modal */}
            <Dialog
                visible={showGalleryModal}
                header={galleryModalHeader}
                footer={galleryModalFooter}
                headerClassName="custom_modal_header"
                className={`custom_modal_dialog modal_dialog_md`}
                onHide={handleCloseGalleryModal}
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

                        <div className="col-12">
                            <div className="page_form_group">
                                <div className="custom_form_group_sub">
                                    <label className="custom_form_label" htmlFor="status">Status: </label>

                                    <div className="event_status_grp">
                                        <span className="text_danger event_status_label">Hidden</span>
                                        <InputSwitch checked={status} onChange={(e: InputSwitchChangeEvent) => setStatus(e.value)} />
                                        <span className="text_success event_status_label">Visible</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12">
                            <MulipleFileInput
                                id="imageFiles"
                                label="Upload image(s)"
                                labelHtmlFor="imageFiles"
                                required={true}
                                onUpload={handleFilesUpload}
                                onClear={handleClearFiles}
                                toast={toastRef}
                                hasMaxFileSize
                                maxFileSize={2} //2 MB
                                containerClassName="mb-3"
                                error={(isRequired && !Image) ? "Image is required!" : ""}
                            />
                        </div>

                        {imageFiles && imageFiles?.length > 0 && (
                            <div className="col-12">
                                <div className="uploaded_files_area">
                                    <div className="row uploaded_file_row">
                                        {imageFiles?.map((file, index) => {
                                            return (
                                                <div key={index} className="col-4 col-sm-3 uploaded_file_col">
                                                    <div className="uploaded_file_container">
                                                        <Image
                                                            src={URL.createObjectURL(file)}
                                                            alt="Image"
                                                            className="uploaded_file_area"
                                                            loading="lazy"
                                                            preview
                                                        />
                                                        <div className="uploaded_file_action">
                                                            <button className="is_btn primary p-ripple">
                                                                <i className="bi bi-pencil-square"></i>
                                                                <Ripple />
                                                            </button>

                                                            <button className="is_btn danger p-ripple"
                                                                onClick={() => handleClearFile(index)}>
                                                                <i className="bi bi-trash3"></i>
                                                                <Ripple />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>
            {/*  */}
        </React.Fragment>
    )
}

export default Gallery;
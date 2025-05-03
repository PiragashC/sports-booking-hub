import React, { useEffect, useRef, useState } from "react";
import './Gallery.css';
import './Gallery-responsive.css';

import { Toast } from "primereact/toast";
import { Ripple } from "primereact/ripple";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Image } from "primereact/image";

import { Fade, Zoom } from "react-awesome-reveal";

import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import Masonry from "react-masonry-css";

import BreadCrumbSection from "../../Components/BreadCrumbSection";
import NoData from "../../Components/NoData";
import TextInput from "../../Components/TextInput";
import MulipleFileInput from "../../Components/MulipleFileInput";

import { GalleryList } from "./GallerySampleData";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { initialWebContents, WebContent } from "../Home/HomeData";
import { showErrorToast } from "../../Utils/commonLogic";
import { postWebContentsThunk } from "../../redux/webContentSlice";
import { useSelector } from "react-redux";
import { uploadImageService } from "../../Utils/commonService";
import { useDeleteConfirmation } from "../../Components/DeleteConfirmationDialog";
import { ImageEditorNew } from "../../Components/ImageEditor/ImageEditor";

const Gallery: React.FC = () => {
    const toastRef = useRef<Toast>(null);
    const [dataState, setDataState] = useState<'Add' | 'Edit'>('Add');
    const [loading, setLoading] = useState<boolean>(false);
    const [isRequired, setIsRequired] = useState<boolean>(false);


    const [contentEditable, setContentEditable] = useState<boolean>(true);
    const [actionButtonHoverd, setActionButtonHoverd] = useState<boolean>(false);

    const [showGalleryModal, setShowGalleryModal] = useState<boolean>(false);

    /* Form fields */
    const [title, setTitle] = useState<string>('');
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [selectedImage, setSelectedImage] = useState<GalleryList | null>(null);
    const [showImageEditor, setShowImageEditor] = useState(false);
    const [imageToEdit, setImageToEdit] = useState<File | null>(null);

    const dispatch = useAppDispatch();
    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
    const { data, loading: WebContenLoading, error, postStatus } = useAppSelector((state) => state.webContent);
    const showDialog = useDeleteConfirmation();
    const [webContents, setWebContents] = useState<WebContent>(initialWebContents);
    const galleryItems = webContents?.contentThirteen || [];


    // useEffect(() => {
    //     if (galleryList && galleryList.length > 0) {
    //         const activeData = galleryList.filter(item => item.status === true);
    //         setGalleryData(token ? galleryList : activeData);
    //     } else {
    //         setGalleryData([]);
    //     }
    // }, [galleryList, token]);

    // useEffect(() => {
    //     let filteredData = [...galleryData];

    //     if (imageSearchKey) {
    //         filteredData = filteredData.filter(event =>
    //             event.title?.toLowerCase().includes(imageSearchKey.toLowerCase())
    //         );
    //     }

    //     if (imageState === 'Visible') {
    //         filteredData = filteredData.filter(event => event.status === true);
    //     } else if (imageState === 'Hidden') {
    //         filteredData = filteredData.filter(event => event.status === false);
    //     }

    //     setFilteredGalleryData(filteredData);
    // }, [imageSearchKey, imageState, galleryData]);

    // const handleChangeImageState = (state: 'All' | 'Visible' | 'Hidden') => {
    //     setImageState(state);
    // }

    const handleCloseGalleryModal = () => {
        setShowGalleryModal(false);
        resetGalleryFields();
    };

    const resetGalleryFields = () => {
        setTitle('');
        setImageFiles([]);
        setSelectedImage(null);
        setIsRequired(false);
    };

    const handleAddImage = () => {
        setDataState('Add');
        setShowGalleryModal(true);
    };

    const handleEditImage = (image: GalleryList) => {
        setDataState('Edit');
        setSelectedImage(image);
        setTitle(image.title);
        setShowGalleryModal(true);
    };

    const handleSaveImage = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsRequired(false);


        if (!title || imageFiles.length === 0) {
            showErrorToast(toastRef, 'Validation Error', 'Title and at least one image are required');
            setIsRequired(true);
            return;
        }

        setLoading(true);

        try {

            const uploadResponse = await uploadImageService(imageFiles, token);

            const newGalleryItems = uploadResponse.map((uploadedImage, index) => ({
                title,
                image: uploadedImage,
                uploadedDate: new Date().toISOString().split('T')[0],
                status: true
            }));

            const updatedContent = {
                ...webContents,
                contentThirteen: [...(webContents?.contentThirteen || []), ...newGalleryItems]
            };

            await dispatch(postWebContentsThunk({
                webContent: updatedContent,
                toastRef
            }));

            handleCloseGalleryModal();
        } catch (error) {
            console.error('Error saving images:', error);
            showErrorToast(toastRef, 'Error', 'Failed to save images');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateImage = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsRequired(false);


        if (!selectedImage || !title) {
            showErrorToast(toastRef, 'Validation Error', 'Title is required');
            setIsRequired(true);

            return;
        }

        setLoading(true);

        try {
            // Update the selected image's title
            const updatedItems = galleryItems.map(item =>
                item.id === selectedImage.id ? { ...item, title } : item
            );

            // Update web content
            const updatedContent = {
                ...webContents,
                contentThirteen: updatedItems
            };

            // Post updated content
            await dispatch(postWebContentsThunk({
                webContent: updatedContent,
                toastRef
            }));

            handleCloseGalleryModal();
        } catch (error) {
            console.error('Error updating image:', error);
            showErrorToast(toastRef, 'Error', 'Failed to update image');
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteImage = (imageId: string) => {
        if (!imageId) return;

        showDialog({
            message: 'Are you sure you want to delete this image?',
            header: 'Confirm the deletion',
            accept: () => {
                const updatedContent = {
                    ...webContents,
                    contentThirteen: webContents.contentThirteen.filter(img => img.id !== imageId)
                };

                dispatch(postWebContentsThunk({
                    webContent: updatedContent,
                    toastRef: toastRef
                })).unwrap();
            }
        });
    }

    const handleEditImageFile = (file: File, index: number) => {
        setImageToEdit(file);
        setShowGalleryModal(false);
        setShowImageEditor(true);
    };

    const handleSaveEditedImage = (file: File) => {
        // Replace the edited image in the files array
        const updatedFiles = [...imageFiles];
        updatedFiles[imageFiles.findIndex(f => f === imageToEdit)] = file;
        setImageFiles(updatedFiles);
        setShowImageEditor(false);
        setShowGalleryModal(true);
        setImageToEdit(null);
    };

    const galleryModalHeader = (
        <div className="custom_modal_header_inner">
            <h5 className="modal-title fs-5">
                <i className={`bi ${dataState === 'Add' ? ' bi-plus-square' : ' bi-pencil-square'} me-2 modal_head_icon`}></i>
                {dataState} Image{dataState === 'Add' && imageFiles.length > 1 ? 's' : ''}
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
                disabled={loading}
            />

            <Button
                label={`${loading ? 'Processing' : dataState === 'Add' ? 'Save' : 'Update'}`}
                onClick={dataState === 'Add' ? handleSaveImage : handleUpdateImage}
                loading={loading}
                className="custom_btn primary"
                disabled={loading}
            />
        </div>
    )

    const handleFilesUpload = (newFiles: File[]) => {
        // Combine existing files with new files, avoiding duplicates
        const updatedFiles = [...imageFiles];

        newFiles.forEach(newFile => {
            // Check if file already exists (by name and size)
            const isDuplicate = imageFiles.some(
                existingFile =>
                    existingFile.name === newFile.name &&
                    existingFile.size === newFile.size
            );

            if (!isDuplicate) {
                updatedFiles.push(newFile);
            }
        });

        setImageFiles(updatedFiles);
    };

    const handleClearFiles = () => {
        setImageFiles([]);
    };

    const handleClearFile = (index: number) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
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

    // Add this useEffect to clean up object URLs
    useEffect(() => {
        return () => {
            imageFiles.forEach(file => {
                URL.revokeObjectURL(URL.createObjectURL(file));
            });
        };
    }, [imageFiles]);

    useEffect(() => { setWebContents(data || initialWebContents) }, [data, dispatch]);

    return (
        <React.Fragment>
            <Toast ref={toastRef} />

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
                                            <p>Total images: {String(galleryItems?.length || 0).padStart(2, '0')}</p>
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

                                    {/* <div className="customize_data_area ">
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
                                    </div> */}
                                </div>
                            </Fade>
                        )}

                        {webContents && galleryItems && Array.isArray(galleryItems) && galleryItems.length > 0 ? (
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
                                    {webContents && galleryItems && Array.isArray(galleryItems) && galleryItems.map((item) => (
                                        <Zoom
                                            key={item.id}
                                            duration={1000}
                                            triggerOnce
                                            cascade
                                        >
                                            <div className="gallery_img_container p-ripple">
                                                <PhotoView src={item.imageViewUrl || item?.image || ''}>
                                                    <img
                                                        src={item.imageViewUrl || item?.image}
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
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                e.nativeEvent.stopImmediatePropagation();
                                                                handleDeleteImage(item?.id || '');
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

                        {/* <div className="col-12">
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
                        </div> */}
                        {dataState === 'Add' &&
                            (<>
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
                                        error={(isRequired && imageFiles.length === 0) ? "Image is required!" : ""}
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
                                                                    <button className="is_btn primary p-ripple"
                                                                        onClick={() => handleEditImageFile(file, index)}
                                                                    >
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
                            </>)
                        }
                    </div>
                </div>
            </Dialog>
            {/*  */}

            <ImageEditorNew
                isOpen={showImageEditor}
                onClose={() => setShowImageEditor(false)}
                onSave={handleSaveEditedImage}
                imageToEdit={imageToEdit}
            />


        </React.Fragment>
    )
}

export default Gallery;
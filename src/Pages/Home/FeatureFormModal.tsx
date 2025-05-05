import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useEffect, useState, useRef } from 'react';
import TextInput from "../../Components/TextInput";
import { Check, SquarePen, X } from "lucide-react";
import { Ripple } from "primereact/ripple";
import TextArea from "../../Components/TextArea";
import FileInput from "../../Components/FileInput";
import { Toast } from "primereact/toast";
import { uploadImageService } from "../../Utils/commonService";
import { ImageEditorNew } from "../../Components/ImageEditor/ImageEditor";
import { showErrorToast, useUploadStatus } from "../../Utils/commonLogic";
import MediaUploadToast from "../../Components/MediaUploadToast";

interface FeatureFormModalProps {
    visible: boolean;
    onHide: () => void;
    onSubmit: (data: any) => void;
    editData?: any;
    isEdit?: boolean;
    token: string | null; // Add token prop
}

export const FeatureFormModal = ({
    visible,
    onHide,
    onSubmit,
    editData,
    isEdit = false,
    token
}: FeatureFormModalProps) => {
    const initialFormData = {
        id: '',
        name: '',
        description: '',
        icon: null as File | null,
        iconPreviewUrl: '',
        iconPath: '' // Added to store the uploaded path
    };
    const [formData, setFormData] = useState(initialFormData);
    const [isRequired, setIsRequired] = useState(false);
    const [showImageEditor, setShowImageEditor] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const toastRef = useRef<Toast>(null);
    const uploadStatus = useUploadStatus();


    useEffect(() => {
        if (isEdit && editData) {
            setFormData({
                id: editData.id,
                name: editData.name,
                description: editData.description,
                icon: null,
                iconPreviewUrl: editData.iconViewUrl || editData.icon || '',
                iconPath: editData.icon || ''
            });
        } else {
            setFormData(initialFormData);
        }
    }, [isEdit, editData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleIconUpload = (file: File) => {
        setFormData(prev => ({
            ...prev,
            icon: file,
            iconPreviewUrl: URL.createObjectURL(file),
            iconPath: '' // Clear previous path when new file is selected
        }));
    };

    const handleClearIcon = () => {
        if (formData.iconPreviewUrl && formData.icon) {
            URL.revokeObjectURL(formData.iconPreviewUrl);
        }
        setFormData(prev => ({
            ...prev,
            icon: null,
            iconPreviewUrl: isEdit ? editData?.iconViewUrl || editData?.icon || '' : '',
            iconPath: isEdit ? editData?.icon || '' : ''
        }));
    };

    const handleEditIcon = () => {
        if (formData.icon) {
            setShowImageEditor(true);
        }
    };

    const handleSaveEditedImage = (editedFile: File) => {
        if (formData.iconPreviewUrl) {
            URL.revokeObjectURL(formData.iconPreviewUrl);
        }
        setFormData(prev => ({
            ...prev,
            icon: editedFile,
            iconPreviewUrl: URL.createObjectURL(editedFile),
            iconPath: '' // Clear previous path when editing
        }));
        setShowImageEditor(false);
    };

    const handleSubmit = async () => {
        setIsRequired(false);
        if (!formData.name || !formData.description || (!formData.icon && !formData.iconPath)) {
            setIsRequired(true);
            return;
        }

        try {
            setIsUploading(true);

            let iconPath = formData.iconPath;

            // Upload new icon if one was selected
            if (formData.icon) {
                uploadStatus.startUpload([formData.icon]);
                const paths = await uploadImageService([formData.icon], token, (index, progress) => {
                    uploadStatus.updateStatus(index, { progress });
                });
                if (paths.length > 0) {
                    iconPath = paths[0];
                    uploadStatus.updateStatus(0, { status: 'success' });

                }
            }

            const submitData = {
                name: formData.name,
                description: formData.description,
                icon: iconPath,
                ...(isEdit && { id: formData.id })
            };

            onSubmit(submitData);
            handleClose();
        } catch (error) {
            uploadStatus.updateStatus(0, {
                status: 'error',
                error: error instanceof Error ? error.message : 'Failed to upload icon'
            });
            showErrorToast(toastRef, 'Upload Error', error instanceof Error ? error.message : 'Failed to upload icon');
        } finally {
            setIsUploading(false);
            // Clear after a short delay to allow users to see the final status
            setTimeout(() => {
                uploadStatus.resetUploadStatus();
            }, 2000); // 2 seconds delay
        }
    };

    const handleClose = () => {
        if (formData.iconPreviewUrl && formData.icon) {
            URL.revokeObjectURL(formData.iconPreviewUrl);
        }
        setFormData(initialFormData);
        setIsRequired(false);
        setIsUploading(false);
        onHide();
    };

    const footerContent = (
        <div className="custom_modal_footer">
            <Button
                label="Cancel"
                icon={<X size={16} className="me-1" />}
                onClick={handleClose}
                className="custom_btn secondary"
                disabled={isUploading}
            />
            <Button
                label={isEdit ? "Update" : "Save"}
                icon={isEdit ? <SquarePen size={16} className="me-2" /> : <Check size={16} className="me-2" />}
                onClick={handleSubmit}
                className="custom_btn primary"
                autoFocus
                loading={isUploading}
                disabled={isUploading}
            />
        </div>
    );

    const headerContent = (
        <div className="custom_modal_header_inner">
            <h5 className="modal-title fs-5">
                <i className={`bi ${!isEdit ? ' bi-plus-square' : ' bi-pencil-square'} me-2 modal_head_icon`}></i>
                {isEdit ? "Edit feature" : "Add new feature"}
            </h5>
            <button
                type="button"
                aria-label="Close"
                className="close_modal_btn p-ripple"
                onClick={handleClose}
                disabled={isUploading}
            >
                <i className="bi bi-x-circle"></i>
                <Ripple />
            </button>
        </div>
    );

    return (
        <>
            <Toast ref={toastRef} />
            <MediaUploadToast
                loading={uploadStatus.isUploading}
                fileStatuses={uploadStatus.fileStatuses}
            />
            <Dialog
                visible={visible}
                header={headerContent}
                footer={footerContent}
                headerClassName="custom_modal_header"
                className={`custom_modal_dialog modal_dialog_sm`}
                onHide={handleClose}
                dismissableMask
                closable={!isUploading}
            >
                <div className="custom_modal_body">
                    {isUploading && (
                        <div className="upload-progress-overlay">
                            <div className="upload-progress-content">
                                <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>
                                <p>Uploading icon...</p>
                            </div>
                        </div>
                    )}
                    <div className="row">
                        <div className="col-12">
                            <TextInput
                                id="featureName"
                                name="name"
                                labelHtmlFor="featureName"
                                value={formData.name}
                                onChange={handleChange}
                                label="Feature Name"
                                required={true}
                                placeholder="Enter feature name"
                                error={(isRequired && !formData.name) ? "Feature Name is required!" : ""}
                            />
                        </div>

                        <div className="col-12">
                            <TextArea
                                id="description"
                                name="description"
                                labelHtmlFor="description"
                                label="Description"
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                required={true}
                                placeholder="Enter description"
                                error={(isRequired && !formData.description) ? "Description is required!" : ""}
                            />
                        </div>

                        <div className="col-12">
                            <FileInput
                                key={`iconFile-${isEdit}`}
                                id="iconFile"
                                label="Feature Icon"
                                labelHtmlFor="iconFile"
                                required={true}
                                value={formData.icon?.name || ''}
                                name="iconFile"
                                hasMaxFileSize
                                maxFileSize={5} // 5MB
                                onUpload={handleIconUpload}
                                onClear={handleClearIcon}
                                toast={toastRef}
                                error={(isRequired && !formData.icon && !formData.iconPath) ? "Feature icon is required!" : ""}
                                containerClassName="mb-2"
                                additionalFileInfo="Recommended size: 100x100px"
                            />
                        </div>

                        {(formData.icon || formData.iconPreviewUrl) && (
                            <div className="col-12">
                                <div className="uploaded_image_area">
                                    <img
                                        src={formData.iconPreviewUrl || formData.iconPath}
                                        alt="Feature icon preview"
                                        className="uploaded_image"
                                        style={{ maxWidth: '100px', maxHeight: '100px' }}
                                    />
                                    {formData.icon && (
                                        <button
                                            className="edit_image_btn is_btn p-ripple"
                                            onClick={handleEditIcon}
                                            disabled={isUploading}
                                        >
                                            <i className="bi bi-pencil-square"></i>
                                            Edit Icon
                                            <Ripple />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Dialog>

            {/* Image Editor Modal */}
            <ImageEditorNew
                isOpen={showImageEditor}
                onClose={() => {
                    setShowImageEditor(false);
                }}
                onSave={handleSaveEditedImage}
                imageToEdit={formData.icon}
            />
        </>
    );
};
import React, { useState, useRef, useEffect } from "react";
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { InputIcon } from "primereact/inputicon";
import { Toast } from "primereact/toast";
import { Ripple } from "primereact/ripple";
import { imageFileExtension } from "../Utils/FileConstant";

interface FileInputProps {
    id: string;
    label: string;
    labelHtmlFor: string;
    required?: boolean;
    value: string;
    name?: string;
    onUpload?: (file: File) => void;
    onClear?: () => void;
    error?: string;
    hasMaxFileSize?: boolean;
    maxFileSize?: number;
    inputClassName?: string;
    containerClassName?: string;
    toast: React.RefObject<Toast>;
    additionalFileInfo?: string;
}

const FileInput: React.FC<FileInputProps> = ({
    id,
    label,
    labelHtmlFor,
    required,
    value,
    name,
    onUpload,
    onClear,
    error,
    toast,
    hasMaxFileSize,
    maxFileSize,
    inputClassName,
    containerClassName,
    additionalFileInfo
}) => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string>('');
    const [uploadedFileExtension, setUploadedFileExtension] = useState<string>('');
    const fileUploadRef = useRef<FileUpload>(null);

    const maxFileSizeInBytes = maxFileSize ? maxFileSize * 1024 * 1024 : null;

    const [showImageViewModal, setShowImageViewModal] = useState<boolean>(false);

    const handleImageViewModal = (filePath: string) => {
        setShowImageViewModal(true);
    }

    const handleUpload = (e: FileUploadHandlerEvent) => {
        const file = e.files[0];
        if (file) {
            if (maxFileSize && maxFileSizeInBytes && file.size > maxFileSizeInBytes) {
                if (toast.current) {
                    toast.current.show({
                        severity: 'error',
                        summary: 'File Upload error',
                        detail: `File size should not exceed ${maxFileSize >= 1
                            ? `${maxFileSize.toFixed(2)} MB`
                            : `${(maxFileSize * 1024).toFixed(0)} KB`
                            }`,
                        life: 3000
                    });
                }

                setUploadedFileName('');
                setUploadedFile(null);
                setUploadedFileExtension('');
                if (fileUploadRef.current) {
                    fileUploadRef.current.clear();
                }
                return;
            }
            setUploadedFileName(file.name);
            setUploadedFileExtension(file.type.split('/')[1]);
            setUploadedFile(file);
            if (onUpload) {
                onUpload(file);
            }
        }
    };

    const handleClear = () => {
        setUploadedFileName('');
        setUploadedFileExtension('');
        setUploadedFile(null);
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }

        if (onClear) {
            onClear();
        }
    };

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowImageViewModal(false);
            }
        };

        if (showImageViewModal) {
            window.addEventListener("keydown", handleEscape);
        }

        return () => {
            window.removeEventListener("keydown", handleEscape);
        };
    }, [showImageViewModal]);

    return (
        <React.Fragment>
            <div className={`page_form_group ${containerClassName}`}>
                <label htmlFor={labelHtmlFor} className={`custom_form_label ${required ? 'is_required' : ''}`}>{label}</label>

                <div className="file_upload_container">
                    <FileUpload
                        id={id}
                        ref={fileUploadRef}
                        mode="basic"
                        name={name}
                        customUpload
                        uploadHandler={handleUpload}
                        accept={imageFileExtension}
                        auto
                        disabled={uploadedFileName ? true : false}
                        chooseLabel={`${uploadedFileName ? 'Uploaded' : 'Upload'}`}
                        className={`doc_file_upload ${uploadedFileName ? 'uploaded' : ''} ${inputClassName}`}
                    />
                    {uploadedFile !== null ? (
                        <span className="upload_file_name uploaded"
                            onClick={() => {
                                handleImageViewModal(URL.createObjectURL(uploadedFile));
                            }}>
                            {uploadedFileName}
                        </span>
                    ) : (
                        <span className="upload_file_name">Select file</span>
                    )}

                    {uploadedFile &&
                        <InputIcon
                            className="bi bi-x clear_button icon_info"
                            onClick={handleClear}
                            title="Clear file"
                        ></InputIcon>
                    }
                </div>
                <span className="file_upload_info">
                    <i className="bi bi-info-circle"></i>

                    <ul className="file_upload_info_content">
                        <li>
                            Acceptable file format: {imageFileExtension}
                        </li>
                        {hasMaxFileSize && typeof maxFileSize === 'number' && (
                            <li>
                                {"Maximum file size is "}
                                {maxFileSize >= 1
                                    ? `${maxFileSize.toFixed(2)} MB`
                                    : `${(maxFileSize * 1024).toFixed(0)} KB`}
                            </li>
                        )}
                        {additionalFileInfo && (
                            <li>{additionalFileInfo}</li>
                        )}
                    </ul>
                </span>

                {error && <small className="form_error_msg">{error}</small>}
            </div>

            {/* Image view modal */}
            <div className={`image_gallery_modal ${showImageViewModal ? 'show' : ''}`}
                onClick={() => setShowImageViewModal(false)}>
                <button
                    className="image_gallery_close_button p-ripple"
                    onClick={() => setShowImageViewModal(false)}
                    title="Close"
                >
                    <i className="bi bi-x-lg"></i>
                    <Ripple />
                </button>
                <div className="image_view_modal_container container">
                    <img
                        src={uploadedFile ? URL.createObjectURL(uploadedFile) : ''}
                        alt={uploadedFileName}
                        className={`image_view_modal_image ${showImageViewModal ? 'show' : ''}`}
                    />
                </div>
            </div>
            {/*  */}
        </React.Fragment>
    )

}

export default FileInput;
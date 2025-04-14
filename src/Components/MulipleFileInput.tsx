import React, { useState, useRef } from "react";
import { FileUpload, FileUploadHandlerEvent } from 'primereact/fileupload';
import { imageFileExtension } from "../Utils/FileConstant";
import { InputIcon } from "primereact/inputicon";
import { Toast } from "primereact/toast";

interface MulipleFileInputProps {
    id: string;
    label: string;
    labelHtmlFor: string;
    required?: boolean;
    value?: string;
    name?: string;
    onUpload?: (file: File[]) => void;
    onClear?: () => void;
    error?: string;
    hasMaxFileSize?: boolean;
    maxFileSize?: number;
    inputClassName?: string;
    containerClassName?: string;
    toast: React.RefObject<Toast>;
    additionalFileInfo?: string;
}

const MulipleFileInput: React.FC<MulipleFileInputProps> = ({
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

    const [uploadedFiles, setUploadedFiles] = useState<{ name: string, size: number }[]>([]);
    const fileUploadRef = useRef<FileUpload>(null);

    const maxFileSizeInBytes = maxFileSize ? maxFileSize * 1024 * 1024 : null;

    const handleUpload = (e: FileUploadHandlerEvent) => {
        const files = e.files;
        const fileNames: string[] = [];
        const fileDetails: { name: string, size: number }[] = [];

        for (const file of files) {
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
                if (fileUploadRef.current) {
                    fileUploadRef.current.clear();
                }
                return;
            }
            fileNames.push(file.name);
            fileDetails.push({ name: file.name, size: file.size });
        }

        setUploadedFiles(fileDetails);

        if (onUpload) {
            onUpload(files);
        }
    };

    const handleClear = () => {
        setUploadedFiles([]);
        if (fileUploadRef.current) {
            fileUploadRef.current.clear();
        }
        if (onClear) {
            onClear();
        }
    };

    return (
        <React.Fragment>
            <div className={`page_form_group ${containerClassName}`}>
                <label htmlFor={labelHtmlFor} className={`custom_form_label ${required ? 'is_required' : ''}`}>{label}</label>

                <div className="file_upload_container">
                    <FileUpload
                        id={id}
                        ref={fileUploadRef}
                        mode="basic"
                        name="document"
                        customUpload
                        uploadHandler={handleUpload}
                        accept={imageFileExtension}
                        auto
                        multiple
                        disabled={uploadedFiles.length > 0}
                        chooseLabel={`${uploadedFiles.length > 0 ? 'Uploaded' : 'Upload'}`}
                        className={`doc_file_upload ${uploadedFiles.length > 0 ? 'uploaded' : ''} ${inputClassName}`}
                    />
                    <span className="upload_file_name">
                        {uploadedFiles.length === 0 ? 'Select file(s)' : uploadedFiles.length === 1 ? `${uploadedFiles.length} file uploaded` : uploadedFiles.length > 1 ? `${uploadedFiles.length} files uploaded` : ''}
                    </span>

                    {uploadedFiles.length > 0 && <InputIcon className="bi bi-x clear_button" onClick={handleClear}></InputIcon>}

                    {uploadedFiles.length > 0 && (
                        <div className="file_detail_window">
                            <h6>Uploaded File(s)</h6>
                            <ul>
                                {uploadedFiles.map((file, index) => (
                                    <li key={index}>
                                        {file.name} - <span>{(file.size / 1024).toFixed(2)} KB</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <span className="file_upload_info">
                    <i className="bi bi-info-circle"></i>

                    <ul className="file_upload_info_content">
                        <li>
                            Acceptable file format : {imageFileExtension}
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
        </React.Fragment>
    )

}

export default MulipleFileInput;
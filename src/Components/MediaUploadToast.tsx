import React from 'react';
import { ProgressBar } from 'primereact/progressbar';

interface FileStatus {
    file: File;
    status: 'uploading' | 'success' | 'error';
    progress?: number;
}

interface MediaUploadToastProps {
    loading: boolean;
    type?: string;
    fileStatuses?: FileStatus[];
}

const MediaUploadToast: React.FC<MediaUploadToastProps> = ({
    loading,
    type = "Image",
    fileStatuses = [],
}) => {
    if (!loading) return null;

    return (

        <div className="file_upload_backdrop">
            <div className="file_upload_status_area">
                {fileStatuses.length === 0 ? (
                    <div className="file_upload_status_container">
                        <div className="upload_loader"></div>
                        <span>{type} Uploading in progress...</span>
                    </div>
                ) : (
                    <React.Fragment>
                        {fileStatuses.map((fileStatus, index) => (
                            <div key={index} className="file_upload_status_sub">
                                <div className="file_upload_status_container_sub">
                                    <span className="upload_file_name">
                                        {fileStatus.file.name}
                                    </span>
                                    <span className={`${fileStatus.status === 'success' ? 'text_success' : fileStatus.status === 'error' ? 'text_danger' : 'text-dark'} upload_file_status`}>
                                        - {fileStatus.status}
                                    </span>
                                </div>
                                {fileStatus.status === 'uploading' && fileStatus.progress !== undefined && (
                                    <div className="file_progress_container">
                                        {/* <ProgressBar value={fileStatus.progress}></ProgressBar> */}
                                        <div className="progress_loader"></div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default MediaUploadToast;
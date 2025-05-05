import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

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
        <div
            className="p-3 border-1 surface-border border-round"
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                backgroundColor: 'var(--surface-ground)',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 1000,
                minWidth: '300px',
            }}
        >
            {fileStatuses.length === 0 ? (
                <div className="flex align-items-center">
                    <ProgressSpinner 
                        style={{ width: '30px', height: '30px' }} 
                        strokeWidth="6" 
                        animationDuration=".5s" 
                    />
                    <span className="ml-2">{type} Upload in progress...</span>
                </div>
            ) : (
                <div>
                    {fileStatuses.map((fileStatus, index) => (
                        <div key={index} className="mb-3">
                            <div className="flex align-items-center">
                                <span 
                                    className="text-overflow-ellipsis white-space-nowrap overflow-hidden"
                                    style={{ maxWidth: '150px' }}
                                >
                                    {fileStatus.file.name}
                                </span>
                                <span 
                                    className="ml-2"
                                    style={{
                                        color: fileStatus.status === 'success' 
                                            ? 'var(--green-500)' 
                                            : fileStatus.status === 'error' 
                                                ? 'var(--red-500)' 
                                                : 'var(--primary-500)'
                                    }}
                                >
                                    - {fileStatus.status}
                                </span>
                            </div>
                            {fileStatus.status === 'uploading' && fileStatus.progress !== undefined && (
                                <div className="flex align-items-center mt-1">
                                    <ProgressSpinner 
                                        style={{ width: '20px', height: '20px' }} 
                                        strokeWidth="6" 
                                        animationDuration=".5s" 
                                    />
                                    <span className="ml-2 text-sm">{fileStatus.progress}%</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MediaUploadToast;
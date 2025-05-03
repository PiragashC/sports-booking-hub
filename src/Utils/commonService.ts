import apiRequest from "./Axios/apiRequest";

export const fetchLanes = async (): Promise<{ id: string; name: string }[]> => {
    const response = await apiRequest({
        method: "get",
        url: "/booking/lanes"
    });

    return Array.isArray(response)
        ? response.map((laneObj: any) => ({
            id: laneObj?.laneId || 0,
            name: laneObj?.laneName || ""
        }))
        : [];

};

export const uploadImageService = async (
    files: File[],
    token: string | null,
    onProgress?: (index: number, progress: number) => void
): Promise<string[]> => {
    if (!files.length) {
        throw new Error('No files provided');
    }

    const MAX_SIZE_MB = 5;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    files.forEach(file => {
        if (file.size > MAX_SIZE_BYTES) {
            throw new Error(`File "${file.name}" exceeds the 5MB size limit`);
        }
    });

    const formData = new FormData();
    files.forEach(file => {
        formData.append('images', file);
    });

    const response = await apiRequest({
        method: "post",
        url: "/website/upload",
        data: formData,
        token,
        isFormData: true,
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.lengthComputable) {
                const progress = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                onProgress(0, progress); // Track first file's progress
            }
        }
    });

    if (!Array.isArray(response)) {
        throw new Error('Invalid response format');
    }

    return response.map(img => img.path);
};


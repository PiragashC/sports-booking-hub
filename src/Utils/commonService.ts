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

export const uploadImageService = async (files: File[]): Promise<string[]> => {
    if (!files.length) {
        throw new Error('No files provided');
    }

    const formData = new FormData();
    files.forEach(file => {
        formData.append('images', file);
    });

    const response = await apiRequest({
        method: "post",
        url: "/website/upload",
        data: formData,
        isFormData: true,
    });

    if (!Array.isArray(response)) {
        throw new Error('Invalid response format');
    }

    return response.map(img => img.path);
};

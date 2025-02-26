import apiRequest from "./apiRequest";

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

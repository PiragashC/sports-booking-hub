export interface Lane {
    laneId?: string;
    laneName?: string;
    isActive?: 1 | 0;
}

export const lanes: Lane[] = [
    { laneId: "1", laneName: 'Lane 1', isActive: 1 },
    { laneId: "2", laneName: 'Lane 2', isActive: 1 },
    { laneId: "3", laneName: 'Lane 3', isActive: 1 },
    { laneId: "4", laneName: 'Lane 4', isActive: 1 }
]

export interface BookingResponse {
    bookingId?: string;
    userName?: string;
    startTime?: string;
    endTime?: string;
}

export interface BookingsByDate {
    bookingDate?: string;
    laneName?: string;
    laneId?: string;
    bookingResponseDtos?: BookingResponse[];
}

export const bookingsByDate: BookingsByDate[] = [
    {
        "bookingDate": "2025-02-03",
        "laneName": "Lane One",
        "laneId": "1",
        "bookingResponseDtos": [
            {
                "bookingId": "402888e594e0bc7b0194e0cb1cd20000",
                "userName": "John Doe",
                "startTime": "14:00:00",
                "endTime": "15:00:00"
            }
        ]
    }
]

export interface BookingRangeResponse {
    bookingDate?: string;
    bookingResponseDtos?: BookingResponse[];
}

export interface BookingsByDateRange {
    laneName?: string;
    laneId?: string;
    weekMonthViewResponseDtos?: BookingRangeResponse[];
}

export const bookingsByDateRange: BookingsByDateRange[] = [
    {
        "laneName": "Lane One",
        "laneId": "1",
        "weekMonthViewResponseDtos": [
            {
                "bookingDate": "2025-02-03",
                "bookingResponseDtos": [
                    {
                        "bookingId": "402888e594e0bc7b0194e0cb1cd20000",
                        "userName": "John Doe",
                        "startTime": "14:00:00",
                        "endTime": "15:00:00"
                    }
                ]
            },
            {
                "bookingDate": "2025-02-04",
                "bookingResponseDtos": [
                    {
                        "bookingId": "402888e594e0bc7b0194e0cb1cd20000",
                        "userName": "John Doe",
                        "startTime": "14:00:00",
                        "endTime": "15:00:00"
                    }
                ]
            }
        ]
    }
]
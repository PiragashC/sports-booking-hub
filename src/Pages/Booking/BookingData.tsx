export interface Lane {
    id: number;
    name: string;
}

export const lanes: Lane[] = [
    { id: 1, name: 'Lane 1' },
    { id: 2, name: 'Lane 2' },
    { id: 3, name: 'Lane 3' },
    { id: 4, name: 'Lane 4' }
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
    laneId?: number;
    bookingResponseDtos?: BookingResponse[];
}

export const bookingsByDate: BookingsByDate[] = [
    {
        bookingDate: "2025-02-08",
        laneName: "Lane 1",
        laneId: 1,
        bookingResponseDtos: [
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20000",
                userName: "Bob Johnson",
                startTime: "10:00:00",
                endTime: "11:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20001",
                userName: "Charlie Brown",
                startTime: "11:00:00",
                endTime: "12:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20002",
                userName: "Eva Brown",
                startTime: "12:00:00",
                endTime: "13:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20003",
                userName: "Emma Wilson",
                startTime: "13:00:00",
                endTime: "14:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20004",
                userName: "John Doe",
                startTime: "14:00:00",
                endTime: "15:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20005",
                userName: "Alice Smith",
                startTime: "15:00:00",
                endTime: "16:00:00"
            }
        ]
    },
    {
        bookingDate: "2025-02-08",
        laneName: "Lane 2",
        laneId: 2,
        bookingResponseDtos: [
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20006",
                userName: "David Lee",
                startTime: "09:00:00",
                endTime: "10:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20007",
                userName: "Charlie Brown",
                startTime: "11:00:00",
                endTime: "12:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20008",
                userName: "Eva Brown",
                startTime: "12:00:00",
                endTime: "13:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20009",
                userName: "Emma Wilson",
                startTime: "13:00:00",
                endTime: "14:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20010",
                userName: "John Doe",
                startTime: "14:00:00",
                endTime: "15:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20011",
                userName: "Alice Smith",
                startTime: "16:00:00",
                endTime: "18:00:00"
            }
        ]
    },
    {
        bookingDate: "2025-02-08",
        laneName: "Lane 3",
        laneId: 3,
        bookingResponseDtos: [
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20012",
                userName: "Alice Johnson",
                startTime: "10:00:00",
                endTime: "11:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20013",
                userName: "Emily Willson",
                startTime: "11:00:00",
                endTime: "13:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20014",
                userName: "Jhon trevor",
                startTime: "13:00:00",
                endTime: "15:00:00"
            }
        ]
    },
    {
        bookingDate: "2025-02-08",
        laneName: "Lane 4",
        laneId: 4,
        bookingResponseDtos: [
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20015",
                userName: "Frank Harris",
                startTime: "10:00:00",
                endTime: "13:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20016",
                userName: "Grace Clark",
                startTime: "14:00:00",
                endTime: "16:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20017",
                userName: "Henry Miller",
                startTime: "16:00:00",
                endTime: "17:00:00"
            }
        ]
    },
    {
        bookingDate: "2025-02-09",
        laneName: "Lane 3",
        laneId: 3,
        bookingResponseDtos: [
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20009",
                userName: "Ivy Martinez",
                startTime: "11:00:00",
                endTime: "12:00:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20010",
                userName: "Jack White",
                startTime: "16:00:00",
                endTime: "17:30:00"
            }
        ]
    },
    {
        bookingDate: "2025-02-10",
        laneName: "Lane 4",
        laneId: 4,
        bookingResponseDtos: [
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20011",
                userName: "Karen Taylor",
                startTime: "08:30:00",
                endTime: "09:30:00"
            },
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20012",
                userName: "Leo Adams",
                startTime: "20:00:00",
                endTime: "21:00:00"
            }
        ]
    },
    {
        bookingDate: "2025-02-11",
        laneName: "Lane 1",
        laneId: 1,
        bookingResponseDtos: [
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20013",
                userName: "Mia Roberts",
                startTime: "10:00:00",
                endTime: "11:30:00"
            }
        ]
    },
    {
        bookingDate: "2025-02-12",
        laneName: "Lane 2",
        laneId: 2,
        bookingResponseDtos: [
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20014",
                userName: "Nathan Scott",
                startTime: "13:00:00",
                endTime: "14:30:00"
            }
        ]
    },
    {
        bookingDate: "2025-02-13",
        laneName: "Lane 3",
        laneId: 3,
        bookingResponseDtos: [
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20015",
                userName: "Olivia Evans",
                startTime: "15:00:00",
                endTime: "16:00:00"
            }
        ]
    },
    {
        bookingDate: "2025-02-14",
        laneName: "Lane 4",
        laneId: 4,
        bookingResponseDtos: [
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20016",
                userName: "Peter Williams",
                startTime: "17:00:00",
                endTime: "18:30:00"
            }
        ]
    },
    {
        bookingDate: "2025-02-15",
        laneName: "Lane 1",
        laneId: 1,
        bookingResponseDtos: [
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20017",
                userName: "Quinn Bell",
                startTime: "19:00:00",
                endTime: "20:00:00"
            }
        ]
    },
    {
        bookingDate: "2025-02-16",
        laneName: "Lane 2",
        laneId: 2,
        bookingResponseDtos: [
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20018",
                userName: "Rachel Green",
                startTime: "09:00:00",
                endTime: "10:30:00"
            }
        ]
    },
    {
        bookingDate: "2025-02-17",
        laneName: "Lane 3",
        laneId: 3,
        bookingResponseDtos: [
            {
                bookingId: "402888e594e0bc7b0194e0cb1cd20019",
                userName: "Samuel Carter",
                startTime: "12:30:00",
                endTime: "13:30:00"
            }
        ]
    }
];


export interface BookingRangeResponse {
    bookingDate?: string;
    bookingResponseDtos?: BookingResponse[];
}

export interface BookingsByDateRange {
    laneName?: string;
    laneId?: number;
    weekMonthViewResponseDtos?: BookingRangeResponse[];
}

export const bookingsByDateRange: BookingsByDateRange[] = [
    {
        "laneName": "Lane One",
        "laneId": 1,
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
export interface Bookings {
    id?: string;
    customerName?: string;
    date?: string;
    fromTime?: string;
    toTime?: string;
    laneName: string;
    status?: 'Success' | 'Pending' | 'Failed';
    bookingNumber?: string;
}

export const bookings: Bookings[] = [
    {
        "id": "8a5ff6299504c0a8019505b7c4c6002a",
        "customerName": "Sudhanshu Chopra",
        "date": "2025-02-16",
        "fromTime": "13:00:00",
        "toTime": "15:00:00",
        "laneName": "Lane One",
        "status": "Success",
        "bookingNumber": "B000001"
    },
    {
        "id": "8a5ff6299504c0a801950592b470001b",
        "customerName": "Arun Jentrick",
        "date": "2025-02-15",
        "fromTime": "08:00:00",
        "toTime": "10:00:00",
        "laneName": "Lane One",
        "status": "Pending",
        "bookingNumber": "B000002"
    },
    {
        "id": "8a5ff6299504c0a8019504f7c4690008",
        "customerName": "Ruberd Nijanthan",
        "date": "2025-02-14",
        "fromTime": "21:00:00",
        "toTime": "22:00:00",
        "laneName": "Lane One",
        "status": "Failed",
        "bookingNumber": "B000003"
    }
]

export interface Lane {
    id: string;
    name: string;
    isActive: boolean;
}

export const lanes: Lane[] = [
    {
        id: "1",
        name: 'Lane 1',
        isActive: true
    },
    {
        id: "2",
        name: 'Lane 2',
        isActive: true
    },
    {
        id: "3",
        name: 'Lane 3',
        isActive: false
    },
    {
        id: "4",
        name: 'Lane 4',
        isActive: false
    }
]
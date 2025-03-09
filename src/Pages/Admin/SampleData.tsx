export interface Bookings {
    id?: string;
    customerName?: string;
    date?: string;
    fromTime?: string;
    toTime?: string;
    laneName: string;
    status?: string;
    bookingNumber?: string;
    email?: string;
    telephoneNumber?: string;
}

export const bookings =
{
    "totalItems": 29,
    "data": [
        {
            "id": "402888e4950cdf2001950cdf644b0000",
            "customerName": "Nijanthan Ruberd",
            "date": "2025-02-18",
            "fromTime": "08:30:00",
            "toTime": "10:30:00",
            "laneName": "Lane Three",
            "status": "Failure",
            "bookingNumber": "B000001",
            "email": "nijanthanruber@gmail.com",
            "telephoneNumber": "+94779606541"
        },
        {
            "id": "402888e4950cf0dc01950cf755ba0000",
            "customerName": "Nijanthan Ruberd",
            "date": "2025-02-18",
            "fromTime": "08:30:00",
            "toTime": "10:30:00",
            "laneName": "Lane Two",
            "status": "Success",
            "bookingNumber": "B000002",
            "email": "nijanthanruberd@gmail.com",
            "telephoneNumber": "+94779606541"
        },
        {
            "id": "8a5ff6299504c0a8019504f7c558000c",
            "customerName": "fggfdg fgfgd",
            "date": "2025-02-13",
            "fromTime": "21:00:00",
            "toTime": "22:00:00",
            "laneName": "Lane One",
            "status": "Failure",
            "bookingNumber": "B000003",
            "email": "pragashconstantine13@gmail.com",
            "telephoneNumber": "+94769059433"
        },
        {
            "id": "8a5ff6299504c0a80195055556070018",
            "customerName": "Arun Jen",
            "date": "2025-02-15",
            "fromTime": "13:00:00",
            "toTime": "17:00:00",
            "laneName": "Lane One",
            "status": "Pending",
            "bookingNumber": "B000004",
            "email": "arunjentrick@gmail.com",
            "telephoneNumber": "+905587211058"
        },
        {
            "id": "8a5ff6299504c0a8019504fcecc70010",
            "customerName": "vnbnbn ghgjhgjg",
            "date": "2025-02-13",
            "fromTime": "09:00:00",
            "toTime": "12:00:00",
            "laneName": "Lane One",
            "status": "Failure",
            "bookingNumber": "B000005",
            "email": "vbfbvb@gmailo.com",
            "telephoneNumber": "+94769059433"
        }
    ],
    "totalPages": 6,
    "currentPage": 1
}

export interface Lane {
    id: string;
    name: string;
    isActive?: boolean;
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
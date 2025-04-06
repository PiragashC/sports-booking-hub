export interface EventsList {
    id?: string;
    title?: string;
    image?: string | null;
    description?: string;
    date?: string;
    time?: string;
    location?: string;
    status?: boolean;
}

export const eventsList: EventsList[] = [
    {
        id: "1",
        title: "Summer Music Festival",
        image: "/event/sample_event/event_1.jpeg",
        description: "Join us for a night of live music, food, and fun under the stars.",
        date: "2025-06-15",
        time: "18:00",
        location: "Main St, Kovai, Kerala",
        status: true
    },
    {
        id: "2",
        title: "Art & Craft Expo",
        image: "/event/sample_event/event_2.jpeg",
        description: "Explore handmade goods and creative art pieces from local artists.",
        date: "2025-05-10",
        time: "10:00",
        location: "Kovai, Kerala",
        status: true
    },
    {
        id: "3",
        title: "Tech Innovators Meetup",
        image: "/event/sample_event/event_3.jpeg",
        description: "A networking event for tech enthusiasts, developers, and startups.",
        date: "2025-05-22",
        time: "17:30",
        location: "Kovai, Kerala",
        status: true
    },
    {
        id: "5",
        title: "Food Truck Fiesta",
        image: "/event/sample_event/event_4.jpeg",
        description: "Taste the best street food in town from over 20 vendors.",
        date: "2025-04-20",
        time: "12:00",
        location: "Kovai, Kerala",
        status: true
    },
    {
        id: "7",
        title: "Business Leadership Summit",
        image: "/event/sample_event/event_5.jpeg",
        description: "Learn from top industry leaders and gain valuable insights.",
        date: "2025-09-12",
        time: "09:00",
        location: "Kovai, Kerala",
        status: true
    },
    {
        id: "9",
        title: "Photography Workshop",
        image: null,
        description: "Improve your photography skills with hands-on training.",
        date: "2025-06-10",
        time: "11:00",
        location: "Kovai, Kerala",
        status: true
    },
    {
        id: "10",
        title: "Book Club Gathering",
        image: "/event/sample_event/event_7.jpeg",
        description: "Discuss your favorite reads with fellow book lovers.",
        date: "2025-04-25",
        time: "16:00",
        location: "Kovai, Kerala",
        status: true
    }
];

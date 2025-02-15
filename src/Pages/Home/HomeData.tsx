export interface Features {
    id: number;
    icon: string;
    name: string;
    description: string;
}

export const features: Features[] = [
    // {
    //     id: 1,
    //     name: "All Your Favorite Sports, One Destination",
    //     description: "Experience the best in indoor cricket, with baseball and table tennis coming soon! Kover Drive Sports is a premium training facility designed for players of all levels, offering top-quality cricket lanes and state-of-the-art training equipment."
    // },
    {
        id: 2,
        icon: '/web_assets/feature/feature1.svg',
        name: "Cricket Lanes Available Now!",
        description: "Our cricket lanes are open and ready for practice, training, and matches. Whether you're working on your batting, bowling, or overall skills, we provide the perfect setup for players to refine their game."
    },
    {
        id: 3,
        icon: '/web_assets/feature/feature2.svg',
        name: "Play Anytime, Day or Night",
        description: "We are open daily from 8 AM to 10 PM, giving you the flexibility to train when it’s most convenient for you—whether it’s an early morning session or a late-night game."
    },
    {
        id: 4,
        icon: '/web_assets/feature/feature3.svg',
        name: "Flexible Memberships for Every Player",
        description: "We offer a variety of membership options to fit your needs, whether you're a casual player, part of a league, or training professionally. Stay in the game with a plan that works for you!"
    },
    {
        id: 5,
        icon: '/web_assets/feature/feature4.svg',
        name: "Safety You Can Trust",
        description: "Your safety is our priority. With advanced security monitoring, we ensure a safe and secure environment so you can focus on playing your best game."
    },
    {
        id: 6,
        icon: '/web_assets/feature/feature5.svg',
        name: "Seamless Booking, Anytime",
        description: "Easily book your training session through our hassle-free online system—reserve your spot in just a few clicks, anytime, anywhere."
    },
    {
        id: 7,
        icon: '/web_assets/feature/feature6.svg',
        name: "Hassle-Free Parking, Every Time",
        description: "Located in Oxbury Mall, our facility offers ample free parking, so you never have to worry about finding a spot."
    }
]
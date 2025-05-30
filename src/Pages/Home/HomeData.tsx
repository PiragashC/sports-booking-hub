export interface Features {
    id?: string | number;
    icon: string;
    name: string;
    description: string;
    iconViewUrl?: string;
    iconDeleteUrl?: string;
}

export const features: Features[] = [
    {
        icon: 'v1746377869/custom_1746377868004.png',
        name: "Cricket Lanes Available Now!",
        description: "Our cricket lanes are open and ready for practice, training, and matches. Whether you're working on your batting, bowling, or overall skills, we provide the perfect setup for players to refine their game."
    },
    {
        icon: 'v1746378122/custom_1746378121060.png',
        name: "Play Anytime, Day or Night",
        description: "We are open daily from 8 AM to 10 PM, giving you the flexibility to train when it’s most convenient for you—whether it’s an early morning session or a late-night game."
    },
    {
        icon: 'v1746378143/custom_1746378142789.png',
        name: "Flexible Memberships for Every Player",
        description: "We offer a variety of membership options to fit your needs, whether you're a casual player, part of a league, or training professionally. Stay in the game with a plan that works for you!"
    },
    {
        icon: 'v1746378165/custom_1746378164223.png',
        name: "Safety You Can Trust",
        description: "Your safety is our priority. With advanced security monitoring, we ensure a safe and secure environment so you can focus on playing your best game."
    },
    {
        icon: 'v1746378186/custom_1746378185271.png',
        name: "Seamless Booking, Anytime",
        description: "Easily book your training session through our hassle-free online system—reserve your spot in just a few clicks, anytime, anywhere."
    },
    {
        icon: 'v1746378212/custom_1746378211670.png',
        name: "Hassle-Free Parking, Every Time",
        description: "Located in Oxbury Mall, our facility offers ample free parking, so you never have to worry about finding a spot."
    }
];

export interface WebContent {
    id?:string;
    contentOne: string;
    contentTwo: string;
    contentThree: {
        id?: number;
        laneCardTitle: string;
        frequency: string;
        timeInterval: string;
        ratePerHour: string;
    }[];
    contentFour: string;
    contentFourViewUrl: string;
    contentFourDeleteUrl: string;
    contentFive: string;
    contentSix: string;
    contentSeven: string;
    contentEight: string;
    contentNine: string;
    contentTen: string;
    contentTenViewUrl: string;
    contentTenDeleteUrl: string;
    contentEleven: string;
    contentTwelve: {
        id?: string | number;
        icon: string;
        iconViewUrl?: string;
        iconDeleteUrl?: string;
        name: string;
        description: string;
    }[];
    contentThirteen: {
        id?: string;
        title: string;
        image: string;
        imageViewUrl?:string;
        imageDeleteUrl?:string;
        uploadedDate: string;
        status: boolean;
    }[];
    contentFourteen: {
        id?: string;
        eventTitle: string;
        eventDate: string;
        eventTime: string;
        location: string;
        description: string;
        status: boolean;
        image: string;
        imageViewUrl?:string;
        imageDeleteUrl?:string;
    }[];
};

export const initialWebContents = {
    contentOne: 'London’s Premier Indoor Cricket and Multi-Sport Facility!',
    contentTwo: 'Experience London’s ultimate indoor cricket and multi-sport destination! Train with top-quality lanes, pro-grade nets, and advanced pitching machines. With baseball and table tennis coming soon, the game never stops. Book your session today!',
    contentThree: [{
        laneCardTitle: 'Book Cricket Lane',
        frequency: 'Daily',
        timeInterval: '8 am – 10 pm',
        ratePerHour: '$45/hr',
    }],
    contentFour: 'v1746456406/custom_1746456405353.png',
    contentFourViewUrl: 'v1746456406/custom_1746456405353.png',
    contentFourDeleteUrl: 'v1746456406/custom_1746456405353.png',
    contentFive: 'Elevating Indoor Sports in London, Ontario',
    contentSix: 'Welcome to Kover Drive, the premier indoor cricket and baseball facility dedicated to fostering a love for the game while promoting fitness and skill development. Our mission is to create a vibrant community where players of all ages and skill levels can come together to enhance their abilities, build confidence, and enjoy the thrill of sports. At Kover Drive, we understand that every player has unique goals, whether you’re a beginner looking to learn the basics or an experienced athlete aiming to refine your technique. Our state of the-art facility is equipped with top-notch training equipment, batting cages, and practice areas designed to help you elevate your game.',
    contentSeven: 'Our facility provides a welcoming environment where you can work on your strength, agility, and endurance, ensuring you are at your best both on and off the field.',
    contentEight: 'Join us at Kover Drive and become part of a community that celebrates the spirit of cricket and baseball. Whether you’re here to improve your game, meet new friends, or simply enjoy the sport, we are excited to support you on your journey. Together, let’s hit new heights in your athletic pursuits!',
    contentNine: 'Contact Us today to learn more about our programs, schedule a visit, or book a session. We can’t wait to see you on the field!',
    contentTen: 'v1746378594/custom_1746378591380.png',
    contentTenDeleteUrl: 'v1746378594/custom_1746378591380.png',
    contentTenViewUrl: 'v1746378594/custom_1746378591380.png',
    contentEleven: 'Discover What Makes Us the Ultimate Indoor Sports Destination',
    contentTwelve: features,
    contentThirteen: [],
    contentFourteen: []
}
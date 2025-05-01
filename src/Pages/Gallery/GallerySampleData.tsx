
export interface GalleryList {
    id?: string;
    title: string;
    image?: string;
    imageViewUrl?:string;
    imageDeleteUrl?:string;
    uploadedDate?: string;
    status?: boolean;
}

export const galleryList: GalleryList[] = [
    {
        id: "1",
        title: "Sunset Over Mountains",
        image: "/gallery/sample_gallery/img_1.jpeg",
        imageViewUrl:"/gallery/sample_gallery/img_1.jpeg",
        imageDeleteUrl:"/gallery/sample_gallery/img_1.jpeg",
        uploadedDate: "2025-04-01",
        status: true,
    },
    {
        id: "2",
        title: "City Skyline at Night",
        image: "/gallery/sample_gallery/img_2.jpeg",
        imageViewUrl:"/gallery/sample_gallery/img_2.jpeg",
        imageDeleteUrl:"/gallery/sample_gallery/img_2.jpeg",
        uploadedDate: "2025-03-29",
        status: true,
    },
    {
        id: "3",
        title: "Forest Trail",
        image: "/gallery/sample_gallery/img_3.jpeg",
        imageViewUrl:"/gallery/sample_gallery/img_3.jpeg",
        imageDeleteUrl:"/gallery/sample_gallery/img_3.jpeg",
        uploadedDate: "2025-03-28",
        status: true,
    },
    {
        id: "4",
        title: "Desert Dunes",
        image: "/gallery/sample_gallery/img_4.jpeg",
        imageViewUrl:"/gallery/sample_gallery/img_4.jpeg",
        imageDeleteUrl:"/gallery/sample_gallery/img_4.jpeg",
        uploadedDate: "2025-03-26",
        status: true,
    },
    {
        id: "5",
        title: "Snowy Mountain Peak",
        image: "/gallery/sample_gallery/img_5.jpeg",
        imageViewUrl:"/gallery/sample_gallery/img_5.jpeg",
        imageDeleteUrl:"/gallery/sample_gallery/img_5.jpeg",
        uploadedDate: "2025-03-24",
        status: true,
    },
    {
        id: "6",
        title: "Ocean Waves",
        image: "/gallery/sample_gallery/img_6.jpeg",
        uploadedDate: "2025-03-22",
        status: true,
    },
    {
        id: "7",
        title: "Night Sky with Stars",
        image: "/gallery/sample_gallery/img_7.jpeg",
        uploadedDate: "2025-03-20",
        status: true,
    },
    {
        id: "8",
        title: "Autumn Leaves",
        image: "/gallery/sample_gallery/img_8.jpeg",
        uploadedDate: "2025-03-18",
        status: true,
    },
    {
        id: "9",
        title: "Canyon View",
        image: "/gallery/sample_gallery/img_9.jpeg",
        uploadedDate: "2025-03-16",
        status: true,
    },
    {
        id: "10",
        title: "Green Hills",
        image: "/gallery/sample_gallery/img_8.jpeg",
        uploadedDate: "2025-03-14",
        status: true,
    },
    {
        id: "11",
        title: "Bridge over River",
        image: "/gallery/sample_gallery/img_1.jpeg",
        uploadedDate: "2025-03-12",
        status: false,
    },
    {
        id: "12",
        title: "Countryside Field",
        image: "/gallery/sample_gallery/img_3.jpeg",
        uploadedDate: "2025-03-10",
        status: false,
    }
];

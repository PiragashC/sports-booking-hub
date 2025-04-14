import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Gallery.css';
import './Gallery-responsive.css';
import { Toast } from "primereact/toast";

import BreadCrumbSection from "../../Components/BreadCrumbSection";
import NoData from "../../Components/NoData";

import LightGallery from "lightgallery/react";
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import Masonry from "react-masonry-css";

import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';

import { GalleryList, galleryList } from "./GallerySampleData";

const Gallery: React.FC = () => {
    const toastRef = useRef<Toast>(null);

    const [galleryData, setGalleryDate] = useState<GalleryList[]>([]);

    /* Form fields */
    const [title, setTitle] = useState<string>('');
    const [image, setImage] = useState<string>('');

    useEffect(() => {
        if (galleryList && galleryList?.length > 0) {
            const activeData = galleryList?.filter((item) => item?.status === true);
            setGalleryDate(activeData);
        } else {
            setGalleryDate([]);
        }
    }, [])

    const breakpointColumnsObj = {
        default: 4,
        1100: 3,
        700: 2,
        500: 1,
    };

    const [galleryInstance, setGalleryInstance] = useState<any>(null);

    const handleImageClick = (index: number) => {
        if (galleryInstance) {
            galleryInstance.openGallery(index);
        }
    };

    return (
        <React.Fragment>
            <Toast ref={toastRef} />

            <BreadCrumbSection
                title={'Gallery'}
                parentTitle={'Home'}
                parentIcon={'bi-house-fill'}
                parentLink={`/`}
                activeIcon={'bi-image-fill'}
            />

            <section className="page_section gallery_section">
                <div className="container-md">
                    {galleryData && galleryData?.length > 0 ? (
                        <div className="gallery_content">
                        </div>
                    ) : (
                        <NoData
                            showImage={true}
                            message="Oops! No images found!"
                        />
                    )}
                </div>
            </section>
        </React.Fragment>
    )
}

export default Gallery;
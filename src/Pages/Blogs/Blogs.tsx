import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './Blogs.css';
import './Blogs-responsive.css';

import { Toast } from "primereact/toast";
import { Ripple } from "primereact/ripple";

import BreadCrumbSection from "../../Components/BreadCrumbSection";
import NoData from "../../Components/NoData";

import { BlogsList, blogsList } from "./BlogsSampleData";

const Blogs: React.FC = () => {
    const toastRef = useRef<Toast>(null);

    const [blogsData, setBlogsData] = useState<BlogsList[]>([]);

    useEffect(() => {
        if (blogsList && blogsList?.length > 0) {
            const activeData = blogsList?.filter((item) => item?.status === true);
            setBlogsData(activeData);
        } else {
            setBlogsData([]);
        }
    }, [])

    return (
        <React.Fragment>
            <Toast ref={toastRef} />

            <BreadCrumbSection
                title={'Blogs'}
                parentTitle={'Home'}
                parentIcon={'bi-house-fill'}
                parentLink={`/`}
                activeIcon={'bi-chat-square-quote-fill'}
            />

            <section className="page_section blogs_section">
                <div className="container-md">
                    {blogsData && blogsData?.length > 0 ? (
                        <div className="blog_content">
                        </div>
                    ) : (
                        <NoData
                            showImage={true}
                            message="Oops! No blogs found!"
                        />
                    )}
                </div>
            </section>
        </React.Fragment>
    )
}

export default Blogs;
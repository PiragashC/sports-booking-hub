import React from "react";
import { Link } from "react-router-dom";

interface BreadCrumbSectionProps {
    title: string;
    parentTitle: string;
    parentIcon: string;
    parentLink: string;
    activeIcon: string;
}

const BreadCrumbSection: React.FC<BreadCrumbSectionProps> = (
    { title, parentTitle, parentIcon, parentLink, activeIcon }
) => {
    return (
        <section className="breadcrumb_section">
            <div className="container-md">
                <div className="breadcrumb_content">
                    <h1 className="breadcrumb_title">{title}</h1>
                    <ul className="breadcrumb_list">
                        <li className="has_child">
                            <Link className="breadcrumb_link" to={parentLink}>
                                <i className={`bi ${parentIcon} me-1`}></i>
                                {parentTitle}
                            </Link>
                        </li>
                        <li className="active">
                            <i className={`bi ${activeIcon} me-1`}></i>
                            {title}
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export default BreadCrumbSection;
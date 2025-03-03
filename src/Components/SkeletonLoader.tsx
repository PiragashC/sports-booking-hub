import React from "react";
import { Skeleton } from "primereact/skeleton";

interface SkeletonItem {
    width?: string;
    height?: string;
    className?: string;
}

export interface SkeletonLayout {
    type: "row" | "column";
    items: (SkeletonItem | SkeletonLayout)[];
}

interface SkeletonLoaderProps {
    layout: SkeletonLayout;
}

const isSkeletonLayout = (item: SkeletonItem | SkeletonLayout): item is SkeletonLayout => {
    return (item as SkeletonLayout).items !== undefined;
};

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ layout }) => {
    return (
        <div className={layout.type === "row" ? "d-flex flex-row" : "d-flex flex-column"}>
            {layout.items.map((item, index) => {
                if (isSkeletonLayout(item)) {
                    return <SkeletonLoader key={index} layout={item} />;
                }
                return (
                    <div key={index} className={item.className || "col-12 col-lg-6"}>
                        <Skeleton width={item.width || "100%"} height={item.height || "20px"} />
                    </div>
                );
            })}
        </div>
    );
};

export default SkeletonLoader;

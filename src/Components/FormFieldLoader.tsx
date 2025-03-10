import React from "react";
import { Skeleton } from "primereact/skeleton";

interface FormFieldLoaderProps {
    formGroupClassName?: string;
}
const FormFieldLoader: React.FC<FormFieldLoaderProps> = ({ formGroupClassName }) => {
    return (
        <div className={`page_form_group ${formGroupClassName}`}>
            <Skeleton className="form_label_loader" />
            <Skeleton className="form_input_loader" />
        </div>
    )
}

export default FormFieldLoader;
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useEffect, useState } from 'react';
import TextInput from "../../Components/TextInput";
import { Check, SquarePen, X } from "lucide-react";
import { Ripple } from "primereact/ripple";
import TextArea from "../../Components/TextArea";

interface FeatureFormModalProps {
    visible: boolean;
    onHide: () => void;
    onSubmit: (data: any) => void;
    editData?: any;
    isEdit?: boolean;
}

export const FeatureFormModal = ({
    visible,
    onHide,
    onSubmit,
    editData,
    isEdit = false
}: FeatureFormModalProps) => {
    const initialFormData = {
        id: Date.now(),
        name: '',
        description: '',
        icon: ''
    };
    const [formData, setFormData] = useState(initialFormData);
    const [isRequired, setIsRequired] = useState(false);

    useEffect(() => {
        if (isEdit && editData) {
            setFormData(editData);
        } else {
            setFormData(initialFormData);
        }
    }, [isEdit, editData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        setIsRequired(false);
        if (!formData.name || !formData.description || !formData.icon) {
            setIsRequired(true);
            return
        };
        onSubmit(formData);
        handleClose();
    };

    const handleClose = () => {
        setFormData(initialFormData);
        setIsRequired(false);
        onHide();
    }

    const footerContent = (
        <div className="custom_modal_footer">
            <Button
                label="Cancel"
                icon={<X size={16} className="me-1" />}
                onClick={handleClose}
                className="custom_btn secondary"
            />
            <Button
                label={isEdit ? "Update" : "Save"}
                icon={isEdit ? <SquarePen size={16} className="me-2" /> : <Check size={16} className="me-2" />}
                onClick={handleSubmit}
                className="custom_btn primary"
                autoFocus
            />
        </div>
    );

    const headerContent = (
        <div className="custom_modal_header_inner">
            <h5 className="modal-title fs-5">
                <i className={`bi ${!isEdit ? ' bi-plus-square' : ' bi-pencil-square'} me-2 modal_head_icon`}></i>
                {isEdit ? "Edit feature" : "Add new feature"}
            </h5>
            <button
                type="button"
                aria-label="Close"
                className="close_modal_btn p-ripple"
                onClick={handleClose}
            >
                <i className="bi bi-x-circle"></i>
                <Ripple />
            </button>
        </div>
    );

    return (
        <Dialog
            visible={visible}
            header={headerContent}
            footer={footerContent}
            headerClassName="custom_modal_header"
            className={`custom_modal_dialog modal_dialog_sm`}
            onHide={handleClose}
            dismissableMask
        >
            <div className="custom_modal_body">
                <div className="row">
                    <div className="col-12">
                        <TextInput
                            id="featureName"
                            name="name"
                            labelHtmlFor="featureName"
                            value={formData.name}
                            onChange={handleChange}
                            label="Feature Name"
                            required={true}
                            placeholder="Enter feature name"
                            error={(isRequired && !formData.name) ? "Feature Name is required!" : ""}
                        />
                    </div>

                    <div className="col-12">
                        <TextArea
                            id="description"
                            name="description"
                            labelHtmlFor="description"
                            label="Description"
                            value={formData.description}
                            onChange={handleDescriptionChange}
                            required={true}
                            placeholder="Enter description"
                            error={(isRequired && !formData.description) ? "Description is required!" : ""}
                        />
                    </div>

                    <div className="col-12">
                        <TextInput
                            id="icon"
                            name="icon"
                            labelHtmlFor="icon"
                            value={formData.icon}
                            onChange={handleChange}
                            label="Icon URL"
                            required={true}
                            placeholder="Enter icon URL"
                            formGroupClassName="mb-2"
                            error={(isRequired && !formData.icon) ? "Icon URL is required!" : ""}
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
};
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useEffect, useState } from 'react';
import TextInput from "../../Components/TextInput";
import { Check, X } from "lucide-react";

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
        <div>
            <Button
                label="Cancel"
                icon={<X size={16} className="mr-1" />}
                onClick={handleClose}
                className="p-button-text me-2"
            />
            <Button
                label={isEdit ? "Update" : "Save"}
                icon={<Check size={16} className="mr-1" />}
                onClick={handleSubmit}
                autoFocus
            />
        </div>
    );

    return (
        <Dialog
            header={isEdit ? "Edit Feature" : "Add New Feature"}
            visible={visible}
            style={{ width: '50vw' }}
            onHide={handleClose}
            footer={footerContent}
        >
            <div className="p-fluid">
                <div className="p-field">
                    <TextInput
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        label="Feature Name"
                        required={true}
                        placeholder="Enter feature name"
                        error={(isRequired && !formData.name) ? "Feature Name is required!" : ""}
                    />
                </div>
                <div className="p-field">
                    <TextInput
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        label="Description"
                        required={true}
                        placeholder="Enter description"
                        error={(isRequired && !formData.description) ? "Description is required!" : ""}
                    />
                </div>
                <div className="p-field">
                    <TextInput
                        id="icon"
                        name="icon"
                        value={formData.icon}
                        onChange={handleChange}
                        label="Icon URL"
                        required={true}
                        placeholder="Enter icon URL"
                        error={(isRequired && !formData.icon) ? "Icon URL is required!" : ""}
                    />
                </div>
            </div>
        </Dialog>
    );
};
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useEffect, useState } from 'react';
import TextInput from "../../Components/TextInput";
import { Check, X } from "lucide-react";

interface CardFormModalProps {
    visible: boolean;
    onHide: () => void;
    onSubmit: (data: any) => void;
    editData?: any;
    isEdit?: boolean;
}

export const CardFormModal = ({
    visible,
    onHide,
    onSubmit,
    editData,
    isEdit = false
}: CardFormModalProps) => {
    const initialFormData = {
        id: Date.now(),
        laneCardTitle: '',
        frequency: '',
        timeInterval: '',
        ratePerHour: ''
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
        if (!formData.frequency || !formData.laneCardTitle || !formData.ratePerHour || !formData.timeInterval) {
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
        <div >
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
            header={isEdit ? "Edit Card" : "Add New Card"}
            visible={visible}
            style={{ width: '50vw' }}
            onHide={handleClose}
            footer={footerContent}
        >
            <div className="p-fluid">
                <div className="p-field">
                    <TextInput
                        id="laneCardTitle"
                        name="laneCardTitle"
                        value={formData.laneCardTitle}
                        onChange={handleChange}
                        label="Card Title"
                        required={true}
                        placeholder="Enter card title"
                        error={(isRequired && !formData.laneCardTitle) ? "Card Title is required!" : ""}
                    />
                </div>
                <div className="p-field">
                    <TextInput
                        id="frequency"
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                        label="Frequency"
                        required={true}
                        placeholder="Enter frequency"
                        error={(isRequired && !formData.frequency) ? "Frequency is required!" : ""}
                    />
                </div>
                <div className="p-field">
                    <TextInput
                        id="timeInterval"
                        name="timeInterval"
                        value={formData.timeInterval}
                        onChange={handleChange}
                        label="Time Interval"
                        required={true}
                        placeholder="Enter Time Interval"
                        error={(isRequired && !formData.timeInterval) ? "Time Interval is required!" : ""}
                    />
                </div>
                <div className="p-field">
                    <TextInput
                        id="ratePerHour"
                        name="ratePerHour"
                        value={formData.ratePerHour}
                        onChange={handleChange}
                        label="Rate Per Hour"
                        required={true}
                        placeholder="Enter Rate Per Hour"
                        error={(isRequired && !formData.ratePerHour) ? "Rate Per Hour is required!" : ""}
                    />
                </div>
            </div>
        </Dialog>
    );
};
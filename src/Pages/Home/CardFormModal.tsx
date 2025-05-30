import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useEffect, useState } from 'react';
import TextInput from "../../Components/TextInput";
import { Check, X, SquarePen } from "lucide-react";
import { Ripple } from "primereact/ripple";

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
        laneCardTitle: '',
        frequency: '',
        timeInterval: '',
        ratePerHour: '$ '
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
                {isEdit ? "Edit" : "Add new"}
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
    )

    return (
        <Dialog
            visible={visible}
            header={headerContent}
            footer={footerContent}
            headerClassName="custom_modal_header"
            className={`custom_modal_dialog modal_dialog_md`}
            onHide={handleClose}
            dismissableMask
        >
            <div className="custom_modal_body">
                <div className="row">
                    <div className="col-12">
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

                    <div className="col-12 col-sm-6">
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

                    <div className="col-12 col-sm-6">
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

                    <div className="col-12 col-sm-6">
                        <TextInput
                            id="ratePerHour"
                            name="ratePerHour"
                            value={formData.ratePerHour}
                            onChange={handleChange}
                            label="Rate Per Hour"
                            required={true}
                            placeholder="Enter Rate Per Hour"
                            formGroupClassName="mb-2"
                            error={(isRequired && !formData.ratePerHour) ? "Rate Per Hour is required!" : ""}
                        />
                    </div>
                </div>
            </div>
        </Dialog>
    );
};
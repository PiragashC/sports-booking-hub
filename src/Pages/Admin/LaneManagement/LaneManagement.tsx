import React, { useState, useEffect, useRef } from "react";
import './Css/LaneManagement.css';
import './Css/LaneManagement-responsive.css';

import { Ripple } from "primereact/ripple";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { Nullable } from "primereact/ts-helpers";
import { Dropdown, DropdownChangeEvent, DropdownProps } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from "primereact/tooltip";

import { goToTop } from "../../../Components/GoToTop";
import { formatTime } from "../../../Utils/Common";

import { Lane, lanes } from "../SampleData";
import { confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import TextInput from "../../../Components/TextInput";

interface LaneFormData {
    laneName: string;
}

interface Status {
    label: string;
    value: boolean;
}

const LaneManagement: React.FC = () => {
    const today = new Date();
    const [loading, setLoading] = useState<boolean>(false);
    const [dataState, setDataState] = useState<'Add' | 'Edit'>('Add');
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const [showLaneModal, setShowLaneModal] = useState<boolean>(false);
    const [lanesData, setLanesData] = useState<Lane[]>([]);
    const [selectedLane, setSelectedLane] = useState<Lane | null>(null);

    const initialLaneFormData = {
        laneName: 'Lane '
    }

    const [laneFormData, setLaneFormData] = useState<LaneFormData>(initialLaneFormData);
    const [laneNameError, setLaneNameError] = useState<string>('');

    const statuses: Status[] = [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false },
    ];


    useEffect(() => {
        setLanesData(lanes);
    }, []);

    const handleCloseLaneModal = () => {
        setShowLaneModal(false);
        handleClearLaneFields();
        handleClearLaneErrors();
    }

    const handleClearLaneFields = () => {
        setLaneFormData(initialLaneFormData);
    }

    const handleClearLaneErrors = () => {
        setLaneNameError('');
    }

    const handleAddLane = () => {
        setShowLaneModal(true);
        setDataState('Add');
    }

    const handleCreateLane = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            setTimeout(() => {
                setLoading(false);
                handleCloseLaneModal();

                if (toast.current) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Lane created successfully.',
                        life: 3000
                    });
                }
            }, 500);
        } catch (error) {
            setLoading(false);
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Failed',
                    detail: 'There was an error creating the lane.',
                    life: 3000
                });
            }
        }
    }

    const handleEditLane = (data: Lane) => {
        setShowLaneModal(true);
        setDataState('Edit');
        setSelectedLane(data);
        setLaneFormData({ ...laneFormData, laneName: data?.name });
    }

    const handleUpdateLane = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            setTimeout(() => {
                setLoading(false);
                handleCloseLaneModal();

                if (toast.current) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Lane updated successfully.',
                        life: 3000
                    });
                }
            }, 500);
        } catch (error) {
            setLoading(false);
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Failed',
                    detail: 'There was an error updating the lane.',
                    life: 3000
                });
            }
        }
    }

    const handleDeleteLane = (data: Lane) => {
        const laneId: string = data?.id!;

        confirmDialog({
            message: 'Are you sure you want to delete this lane?',
            header: 'Confirm the deletion',
            headerClassName: 'confirmation_danger',
            icon: 'bi bi-info-circle',
            defaultFocus: 'accept',
            acceptClassName: 'p-button-danger',
            dismissableMask: true,
            accept: () => deleteLane(laneId),
        });
    }

    const deleteLane = async (laneId: string) => {
        try {
            setTimeout(() => {
                setLoading(false);

                if (toast.current) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Lane deleted successfully.',
                        life: 3000
                    });
                }
            }, 500);
        } catch (error) {
            setLoading(false);
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Failed',
                    detail: 'There was an error deleting the lane.',
                    life: 3000
                });
            }
        }
    }

    const tableActionBody = (rowData: Lane) => {
        const data = rowData;
        return (
            <>
                <Tooltip target=".data_action_btn" />
                <div className="tabel_btn_area custom">
                    <button
                        type="button"
                        title="Edit"
                        data-pr-tooltip={`Edit Lane`}
                        data-pr-position="top"
                        data-pr-classname="custom_tooltip"
                        className="data_action_btn primary p-ripple"
                        onClick={() => handleEditLane(data)}>
                        <i className="bi bi-pencil-square"></i>
                        <Ripple />
                    </button>

                    <button
                        type="button"
                        title="Delete"
                        data-pr-tooltip={`Delete Lane`}
                        data-pr-position="top"
                        data-pr-classname="custom_tooltip"
                        className="data_action_btn danger p-ripple"
                        onClick={() => handleDeleteLane(data)}
                    >
                        <i className="bi bi-trash3"></i>
                        <Ripple />
                    </button>
                </div>
            </>
        )
    };

    const laneModalHeader = (
        <div className="custom_modal_header_inner">
            <h5 className="modal-title fs-5">
                <i className={`bi ${dataState === 'Add' ? ' bi-plus-square' : ' bi-pencil-square'} me-2 modal_head_icon`}></i>
                {dataState} Lane
            </h5>
            <button
                type="button"
                aria-label="Close"
                className="close_modal_btn p-ripple"
                onClick={handleCloseLaneModal}
            >
                <i className="bi bi-x-circle"></i>
                <Ripple />
            </button>
        </div>
    )

    const laneModalFooter = (
        <div className="custom_modal_footer">
            <Button
                label="Cancel"
                className="custom_btn secondary"
                onClick={handleCloseLaneModal}
            />

            <Button
                label={`${loading ? 'Processing' : dataState === 'Add' ? 'Save' : 'Update'}`}
                onClick={dataState === 'Add' ? handleCreateLane : handleUpdateLane}
                loading={loading}
                className="custom_btn primary"
                disabled={laneFormData?.laneName === ''}
            />
        </div>
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLaneFormData({
            ...laneFormData,
            [name]: value
        });
    }

    const statusOptionTemplate = (option: Status) => {
        return (
            <div className="status_disply">
                {option.value === true ? (
                    <i className="bi bi-check-circle-fill text_success"></i>
                ) : (
                    <i className="bi bi-exclamation-circle-fill text_warning"></i>
                )}
                <div>{option.label}</div>
            </div>
        );
    };

    const statusValueTemplate = (option: Status, props: DropdownProps) => {
        if (option) {
            return (
                <div className="status_disply">
                    {option.value === true ? (
                        <i className="bi bi-check-circle-fill text_success"></i>
                    ) : (
                        <i className="bi bi-exclamation-circle-fill text_warning"></i>
                    )}

                    <div className={option.value === true ? 'text_success' : 'text_warning'}>{option.label}</div>
                </div>
            );
        }

        return <span>{props.placeholder}</span>;
    };

    const handleStatusChange = (newStatus: number, rowData: Lane) => {
        confirmDialog({
            message: "Are you sure you want to change the lane's status?",
            header: 'Confirm Status Change',
            icon: 'bi bi-info-circle',
            defaultFocus: 'accept',
            dismissableMask: true,
            accept: () => {


                try {
                    setTimeout(() => {
                        setLoading(false);
                        handleCloseLaneModal();

                        if (toast.current) {
                            toast.current.show({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Lane status changed successfully.',
                                life: 3000
                            });
                        }
                    }, 500);
                } catch (error) {
                    setLoading(false);
                    if (toast.current) {
                        toast.current.show({
                            severity: 'error',
                            summary: 'Failed',
                            detail: 'There was an error changing the lane status.',
                            life: 3000
                        });
                    }
                }
            },
            reject: () => { },
        });
    };

    const statusBodyTemplate = (rowData: Lane) => {
        return (
            <div className="flex_center">
                <Dropdown
                    value={rowData.isActive}
                    options={statuses}
                    itemTemplate={statusOptionTemplate}
                    valueTemplate={statusValueTemplate}
                    onChange={(e) => handleStatusChange(e.value, rowData)}
                    panelClassName="table_status_dropdown"
                    placeholder="Status"
                    className="form_dropdown data_status_dropdown"
                />
            </div>
        );
    };


    const getRowClassName = (options: { [key: string]: any }) => {
        return 'table_data_row secondary';
    };

    return (
        <>
            <Toast ref={toast} />
            <div>
                <div className="page_header_section">
                    <h4 className="page_heading">Lanes</h4>

                    <button
                        className="new_data_button m-0 is_btn p-ripple"
                        aria-label="New booking"
                        onClick={handleAddLane}>
                        <i className="bi bi-plus-circle"></i>
                        <span>Add lane</span>
                        <Ripple />
                    </button>
                </div>

                <div className="page_content_section mt-3 pb-0">
                    {lanesData && lanesData?.length > 0 ? (
                        <>
                            <DataTable
                                value={lanesData}
                                paginator
                                size="small"
                                rows={10}
                                rowsPerPageOptions={[5, 10, 25, 50]}
                                tableStyle={{ minWidth: '50rem' }}
                                paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                                currentPageReportTemplate="{first} to {last} of {totalRecords}"
                                className="page_table p-0 p-sm-1 pb-sm-0"
                                rowHover
                                rowClassName={getRowClassName}
                            >
                                <Column
                                    header="No."
                                    body={(rowData: Lane, { rowIndex }) => (
                                        <span className="text_bold text_no_wrap">
                                            {String(rowIndex + 1).padStart(2, '0')}.
                                        </span>
                                    )}
                                    style={{ width: '15%' }}
                                ></Column>

                                <Column
                                    header="Lane name"
                                    field="name"
                                    body={(rowData: Lane) => (
                                        <span className="text_no_wrap">
                                            {rowData?.name ? rowData?.name : '---'}
                                        </span>
                                    )}
                                    style={{ width: '50%' }}
                                ></Column>

                                <Column
                                    header="Status"
                                    field="status"
                                    alignHeader={'center'}
                                    body={statusBodyTemplate}
                                    style={{ width: '15%' }}
                                ></Column>

                                <Column
                                    alignHeader="center"
                                    body={tableActionBody}
                                    style={{ width: '20%' }}
                                ></Column>
                            </DataTable>
                        </>
                    ) : (
                        <>
                        </>
                    )}
                </div>
            </div>

            <Dialog
                visible={showLaneModal}
                header={laneModalHeader}
                footer={laneModalFooter}
                headerClassName="custom_modal_header"
                className={`custom_modal_dialog modal_dialog_sm`}
                onHide={handleCloseLaneModal}
                dismissableMask
            >
                <div className="custom_modal_body">
                    <div className="row">
                        <div className="col-12">
                            <TextInput
                                id="laneName"
                                key={`laneName`}
                                label="Lane name"
                                labelHtmlFor="laneName"
                                required={true}
                                inputType="text"
                                value={laneFormData?.laneName}
                                name="laneName"
                                placeholder="Enter lane name"
                                onChange={handleChange}
                                formGroupClassName="mb-2"
                                inputAutoFocus={true}
                                error={(isRequired && !laneFormData?.laneName) ? "Lane name is required!" : ""}
                            />
                        </div>
                    </div>
                </div>
            </Dialog>
        </>
    )
}

export default LaneManagement;
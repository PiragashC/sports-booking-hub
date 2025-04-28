import React, { useState, useEffect, useRef } from "react";
import './Css/LaneManagement.css';
import './Css/LaneManagement-responsive.css';
import LaneFormLoader from "./LaneFormLoader";

import { Ripple } from "primereact/ripple";
import { Toast } from "primereact/toast";
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from "primereact/tooltip";
import { confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { removeEmptyValues, showErrorToast, showSuccessToast } from "../../../Utils/commonLogic";

import { Lane } from "../SampleData";
import TextInput from "../../../Components/TextInput";
import apiRequest from "../../../Utils/Axios/apiRequest";
import { useSelector } from "react-redux";
import NumberInput from "../../../Components/NumberInput";
import { SkeletonLayout } from "../../../Components/SkeletonLoader";

interface LaneFormData {
    laneName: string;
    lanePrice: number;
}

interface Status {
    label: string;
    value: boolean;
}

interface LaneApiResult {
    laneId: string;
    laneName: string;
    isActive: boolean;
    laneNumber: string;
    lanePrice: number;
}

const LaneManagement: React.FC = () => {
    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
    const toastRef = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataState, setDataState] = useState<'Add' | 'Edit'>('Add');
    const [isRequired, setIsRequired] = useState<boolean>(false);
    const toast = useRef<Toast>(null);

    const [showLaneModal, setShowLaneModal] = useState<boolean>(false);
    const [lanesData, setLanesData] = useState<LaneApiResult[]>([]);

    const initialLaneFormData = {
        laneName: 'Lane ',
        lanePrice: 0,
    }

    const [laneFormData, setLaneFormData] = useState<LaneFormData>(initialLaneFormData);
    const [laneNameError, setLaneNameError] = useState<string>('');

    const statuses: Status[] = [
        { label: 'Active', value: true },
        { label: 'Inactive', value: false },
    ];

    const [paginationParams, setPaginationParams] = useState<{ first: number, page: number; size: number }>({
        first: 0,
        page: 1,
        size: 10,
    });
    const [laneLoading, setLaneLoading] = useState<boolean>(false);
    const [totalRecords, setTotalRecords] = useState<number>(0);
    const [rowPerPage, setRowsPerPage] = useState<number[]>([5]);
    const [editId, setEditId] = useState<string>('');

    const laneSkeletonLayout: SkeletonLayout = {
        type: "column",
        items: [
            { width: "150px", height: "20px", className: "mb-3" },
            {
                type: "row",
                items: [
                    { width: "85%", height: "40px", className: "mb-3 col-12 col-lg-6" },

                ],
            },
            { width: "150px", height: "20px", className: "mb-3" },
            {
                type: "row",
                items: [
                    { width: "55%", height: "40px", className: "mb-3 col-12 col-lg-6" },

                ],
            },
        ]
    };


    const handleCloseLaneModal = () => {
        setShowLaneModal(false);
        handleClearLaneFields();
        handleClearLaneErrors();
        setEditId("");
        setDataState("Add");
        setIsRequired(false);
        setLoading(false);
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

    const createlane = async () => {
        setLoading(true);
        const response = await apiRequest({
            method: "post",
            url: "/booking/create-lane",
            data: removeEmptyValues(laneFormData),
            token
        });
        console.log(response);
        if (response && !response?.error) {
            showSuccessToast(toastRef, "Success", "New Lane created successfully!");
            fetchLanes();
            handleCloseLaneModal();
        } else {
            showErrorToast(toastRef, "Failed to create a lane. Please try again.", response?.error);
        }
        setLoading(false);
    }

    const validateRequiredFields = (): boolean => {
        if (!laneFormData.laneName || !laneFormData.lanePrice || laneFormData.lanePrice === 0) {
            setIsRequired(true);
            showErrorToast(toastRef, "Error in Submission", "Please fill all required fields!");
            return false;
        }
        setIsRequired(false);
        return true;
    };

    const handleCreateLane = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateRequiredFields()) return;
        await createlane();
    };

    const getLaneById = async (laneId: string) => {
        setLoading(true);
        const response = await apiRequest({
            method: "get",
            url: `/booking/get-lane-by-id/${laneId}`,
            token
        });

        if (response && !response?.error) {
            setLaneFormData({
                laneName: response?.laneName,
                lanePrice: response?.lanePrice || 0,
            })
        } else {
            setLaneFormData(initialLaneFormData);
        }
        setLoading(false);
    }

    const handleEditLane = (data: LaneApiResult) => {
        if (data && data.laneId) {
            setLaneFormData(initialLaneFormData);
            setShowLaneModal(true);
            setDataState('Edit');
            getLaneById(data.laneId);
            setEditId(data.laneId);
        }
    }

    const updateLane = async () => {
        setLoading(true);
        const payload = {
            laneId: editId,
            laneName: laneFormData.laneName || "",
            lanePrice: laneFormData?.lanePrice,
        }
        const response: any = await apiRequest({
            method: "put",
            url: "/booking/update-lane",
            data: payload,
            token
        });

        console.log(response);
        if (response && !response?.error) {
            showSuccessToast(toastRef, "Lane data updated successfully!", "");
            handleCloseLaneModal();
            fetchLanes();
        } else {
            showErrorToast(toastRef, " Lane data Update Failed", response?.error);
        }
        setLoading(false);
    }

    const handleUpdateLane = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateRequiredFields()) return;
        await updateLane();
    }

    const handleDeleteLane = (data: LaneApiResult) => {
        const laneId: string = data?.laneId!;

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

    const deleteLane = async (id: string) => {
        const response = await apiRequest({
            method: "delete",
            url: "/lane/delete",
            params: {
                bookingId: id
            },
            token
        });
        console.log(response);
        if (response && !response?.error) {
            showSuccessToast(toastRef, "Success", "Lane data deleted successfully.");
            fetchLanes();
        } else {
            showErrorToast(toastRef, "Failed to delete lane. Please try again.", response?.error);
        }
    }

    const tableActionBody = (rowData: LaneApiResult) => {
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

                    {/* <button
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
                    </button> */}
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
                disabled={laneFormData?.laneName === '' || !laneFormData.lanePrice || laneFormData.lanePrice === 0}
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

    const changeLaneStatus = async (id: string, status: number) => {
        const response = await apiRequest({
            method: "put",
            url: "/booking/update-lane-status",
            params: {
                id,
                status
            },
            token
        });
        console.log(response);
        if (response && !response?.error) {
            showSuccessToast(toastRef, "Success", "Lane Status updated successfully!");
            fetchLanes();
        } else {
            showErrorToast(toastRef, "Failed to update lane status. Please try again.", response?.error);
        }
    }

    const handleStatusChange = (newStatus: boolean, rowData: LaneApiResult) => {
        console.log(newStatus, rowData, "ghvfcdefgrhn");
        confirmDialog({
            message: "Are you sure you want to change the lane's status?",
            header: 'Confirm Status Change',
            icon: 'bi bi-info-circle',
            defaultFocus: 'accept',
            dismissableMask: true,
            accept: () => { changeLaneStatus(rowData?.laneId, newStatus ? 1 : 0) },
            reject: () => { },
        });
    };

    const statusBodyTemplate = (rowData: LaneApiResult) => {
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

    const onPage = (event: DataTableStateEvent) => {
        setPaginationParams((prev) => ({
            ...prev,
            first: event.first,
            page: event && event?.page ? event.page + 1 : 1,
            size: event.rows,
        }));
    };

    const fetchLanes = async () => {
        setLaneLoading(true);
        const response = await apiRequest({
            method: "get",
            url: "/booking/get-all-lanes",
            token,
            params: {
                page: paginationParams.page,
                size: paginationParams.size,
            }
        });
        console.log(response);
        if (response && !response?.error) {
            setLanesData(response?.data);
            setTotalRecords(response?.totalItems);
            const newRowPerPage = ([5, 10, 25, 50].filter(x => x < Number(response?.totalItems)));
            setRowsPerPage([...newRowPerPage, Number(response?.totalItems)])
        } else {
            setLanesData([]);
        }
        setLaneLoading(false);
    };

    useEffect(() => { if (paginationParams.page && paginationParams.size) fetchLanes(); }, [paginationParams]);

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
                    <DataTable
                        value={lanesData}
                        lazy
                        paginator
                        rows={paginationParams.size}
                        first={paginationParams.first}
                        totalRecords={totalRecords}
                        onPage={onPage}
                        loading={laneLoading}
                        size="small"
                        rowsPerPageOptions={rowPerPage}
                        tableStyle={{ minWidth: "50rem" }}
                        paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
                        currentPageReportTemplate="{first} to {last} of {totalRecords}"
                        className="page_table p-0 p-sm-1 pb-sm-0"
                        rowClassName={getRowClassName}
                        rowHover
                        emptyMessage="No Lanes found!"
                    >
                        <Column
                            header="No."
                            body={(rowData: LaneApiResult) => (
                                <span className="text_bold text_no_wrap">
                                    {rowData?.laneNumber ? rowData?.laneNumber : '---'}
                                </span>
                            )}
                            style={{ width: '15%' }}
                        ></Column>

                        <Column
                            header="Lane name"
                            field="name"
                            body={(rowData: LaneApiResult) => (
                                <span className="text_no_wrap text-capitalize">
                                    {rowData?.laneName ? rowData?.laneName : '---'}
                                </span>
                            )}
                            style={{ width: '50%' }}
                        ></Column>

                        <Column
                            header="Lane price"
                            field="price"
                            body={(rowData: LaneApiResult) => (
                                <span className="text_no_wrap">
                                    {rowData?.lanePrice ? '$ ' + (rowData?.lanePrice.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })) : '---'}
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
                    {!loading ? (
                        <div className="row">
                            <div className="col-12 col-sm-6">
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
                                    inputAutoFocus={true}
                                    formGroupClassName="mb-sm-2"
                                    error={(isRequired && !laneFormData?.laneName) ? "Lane name is required!" : ""}
                                />
                            </div>

                            <div className="col-12 col-sm-6">
                                <NumberInput
                                    id="lanePrice"
                                    key="lanePrice"
                                    label="Lane Price"
                                    labelHtmlFor="lanePrice"
                                    required={true}
                                    value={laneFormData?.lanePrice}
                                    name="lanePrice"
                                    placeholder="Enter lane price"
                                    onChange={(value) => setLaneFormData({ ...laneFormData, lanePrice: value || 0 })}
                                    formGroupClassName="mb-2"
                                    inputAutoFocus={true}
                                    min={0}
                                    prefix="$ "
                                    error={(isRequired && !laneFormData?.lanePrice) ? "Lane price is required!" : ""}
                                />

                            </div>
                        </div>
                    ) : (
                        <LaneFormLoader />
                    )}
                </div>
            </Dialog>
        </>
    )
}

export default LaneManagement;
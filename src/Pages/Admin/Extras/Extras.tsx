import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import './Css/Extras.css';
import './Css/Extras-responsive.css';

import { Ripple } from "primereact/ripple";
import { Toast } from "primereact/toast";
import { Dropdown, DropdownChangeEvent, DropdownProps } from 'primereact/dropdown';
import { DataTable, DataTableStateEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { confirmDialog } from "primereact/confirmdialog";
import { InputNumberChangeEvent } from "primereact/inputnumber";

import { goToTop } from "../../../Components/GoToTop";

import TextInput from "../../../Components/TextInput";
import NumberInput from "../../../Components/NumberInput";

interface CouponCode {
    code: string;
    discountPercentage: number;
    status: boolean;
}

const coponCode: CouponCode = {
    code: "KD2025",
    discountPercentage: 25,
    status: true,
}

interface CouponCodeFormData {
    promoCode: string;
    promoPercentage: number;
}

const Extras: React.FC = () => {
    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
    const navigate = useNavigate();
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [dataState, setDataState] = useState<'Add' | 'Edit'>('Add');
    const [isRequired, setIsRequired] = useState<boolean>(false);

    const initialCouponCodeFormData = {
        promoCode: '',
        promoPercentage: 0,
    }

    const [couponCodeFormData, setCouponCodeFormData] = useState<CouponCodeFormData>(initialCouponCodeFormData);
    const [hasPromoCode, setHasPromoCode] = useState<boolean>(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCouponCodeFormData({
            ...couponCodeFormData,
            [name]: value
        });
    }

    const handleDeletePromocode = () => {
        confirmDialog({
            message: 'Are you sure you want to delete the promo code?',
            header: 'Delete Confirmation',
            headerClassName: 'confirmation_danger',
            icon: 'bi bi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            dismissableMask: true,
            resizable: false,
            draggable: false,
            accept: deletePromocode,
        });
    }

    const deletePromocode = () => {
        setHasPromoCode(false);
        setDataState('Add');
    }

    const handleCreatePromoCode = () => {
        setHasPromoCode(true);

        try {
            setTimeout(() => {
                if (toast.current) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Coupon code detail added successfully.',
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
                    detail: `There was an error adding the coupon code details.`,
                    life: 3000
                });
            }
        }
    }

    const handleUpdatePromoCode = () => {
        setHasPromoCode(true);

        try {
            setTimeout(() => {
                if (toast.current) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Coupon code detail updated successfully.',
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
                    detail: `There was an error updating the coupon code details.`,
                    life: 3000
                });
            }
        }
    }

    const handleEditPromoCode = () => {
        setDataState('Edit');
    }

    const handleToggleCouponCodeStatus = (newStatus: boolean) => {
        confirmDialog({
            message: "Are you sure you want to change the coupon code status?",
            header: 'Confirm Status Change',
            icon: 'bi bi-info-circle',
            defaultFocus: 'accept',
            dismissableMask: true,
            resizable: false,
            draggable: false,
            accept: updateCouponCodeStatus,
            reject: () => { },
        });
    }

    const updateCouponCodeStatus = () => {
        try {
            setTimeout(() => {
                if (toast.current) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Status updated successfully.',
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
                    detail: `There was an error updating the status.`,
                    life: 3000
                });
            }
        }
    };

    return (
        <>
            <Toast ref={toast} />

            <div>
                <div className="page_header_section">
                    <h4 className="page_heading">Extras</h4>
                </div>

                <div className="filter_area">
                    <h6 className="section_part_heading">Promo code</h6>

                    {(hasPromoCode === false && dataState === 'Add') || dataState === 'Edit' ? (
                        <div className="row">
                            <div className="col-12">
                                <h6 className="data_head">{dataState} Promo code</h6>
                            </div>
                            <div className="col-12 col-xl-4 col-sm-6">
                                <TextInput
                                    id="promoCode"
                                    key={`promoCode`}
                                    label="Promo code"
                                    labelHtmlFor="promoCode"
                                    required={true}
                                    inputType="text"
                                    value={couponCodeFormData?.promoCode}
                                    name="promoCode"
                                    placeholder="Enter promo code"
                                    onChange={handleChange}
                                    inputAutoFocus={true}
                                    error={(isRequired && !couponCodeFormData?.promoCode) ? "Promo code is required!" : ""}
                                />
                            </div>

                            <div className="col-12 col-xl-4 col-sm-6">
                                <NumberInput
                                    id="promoPercentage"
                                    key="promoPercentage"
                                    label="Promo percentage (%)"
                                    labelHtmlFor="promoPercentage"
                                    required={true}
                                    value={couponCodeFormData?.promoPercentage}
                                    name="promoPercentage"
                                    placeholder="Enter promo percentage"
                                    onChange={(value) => setCouponCodeFormData({ ...couponCodeFormData, promoPercentage: value || 0 })}
                                    inputAutoFocus={true}
                                    min={0}
                                    suffix=" %"
                                    error={(isRequired && !couponCodeFormData?.promoPercentage) ? "Promo percentage is required!" : ""}
                                />
                            </div>

                            <div className="col-12">
                                <div className="text-start">
                                    <Button
                                        label={`${dataState === 'Add' ? "Create" : "Update"}`}
                                        className="custom_btn"
                                        loading={loading}
                                        onClick={dataState === 'Add' ? handleCreatePromoCode : handleUpdatePromoCode}
                                    />
                                    {dataState === 'Edit' && (
                                        <Button
                                            label="Cancel"
                                            className="ms-2 custom_btn"
                                            severity="danger"
                                            onClick={() => setDataState('Add')}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="show_promo_area">
                            <div className="row">
                                <div className="col-6 col-xl-4 col-xxl-3">
                                    <h6 className="extras_title">Promo code :</h6>
                                </div>
                                <div className="col-6 col-xl-8 col-xxl-9">
                                    <h6 className="extras_value">{coponCode ? coponCode?.code : ""}</h6>
                                </div>
                            </div>

                            <Divider />

                            <div className="row">
                                <div className="col-6 col-xl-4 col-xxl-3">
                                    <h6 className="extras_title">Offer percentege :</h6>
                                </div>
                                <div className="col-6 col-xl-8 col-xxl-9">
                                    <h6 className="extras_value">{coponCode ? coponCode.discountPercentage : 0}%</h6>
                                </div>
                            </div>

                            <Divider />

                            <div className="row">
                                <div className="col-6 col-xl-4 col-xxl-3">
                                    <h6 className="extras_title">Status</h6>
                                </div>
                                <div className="col-6 col-xl-8 col-xxl-9">
                                    <div className="d-flex  align-items-center">
                                        <InputSwitch
                                            checked={coponCode ? coponCode.status : false}
                                            className="custom_switch"
                                            onChange={(e: InputSwitchChangeEvent) => handleToggleCouponCodeStatus(e.value)}
                                        />

                                        {coponCode.status === true ? (
                                            <span className="coupon_status active">Active</span>
                                        ) : (
                                            <span className="coupon_status inactive">Inactive</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Divider />

                            <div className="row">
                                <div className="col-6 col-xl-4 col-xxl-3">
                                    <h6 className="extras_title">Action</h6>
                                </div>
                                <div className="col-6 col-xl-8 col-xxl-9">
                                    <div className="action_btn_area justify-content-start">
                                        <button
                                            type="button"
                                            title="Edit coupon code"
                                            className="data_action_btn primary p-ripple"
                                            onClick={handleEditPromoCode}>
                                            <i className="bi bi-pencil-square"></i>
                                            <Ripple />
                                        </button>

                                        <button
                                            type="button"
                                            title="Delete coupon code"
                                            className="data_action_btn danger p-ripple"
                                            onClick={handleDeletePromocode}
                                        >
                                            <i className="bi bi-trash3"></i>
                                            <Ripple />
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default Extras;
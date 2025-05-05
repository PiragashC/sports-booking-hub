import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import './Css/Extras.css';
import './Css/Extras-responsive.css';

import { Ripple } from "primereact/ripple";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputSwitch, InputSwitchChangeEvent } from "primereact/inputswitch";
import { confirmDialog } from "primereact/confirmdialog";
import TextInput from "../../../Components/TextInput";
import NumberInput from "../../../Components/NumberInput";
import apiRequest from "../../../Utils/Axios/apiRequest";
import SkeletonLoader, { SkeletonLayout } from "../../../Components/SkeletonLoader";
import { showErrorToast, showSuccessToast } from "../../../Utils/commonLogic";

interface CouponCodeFormData {
    promoCode: string;
    promoPercentage: number;
    status: boolean;
}

const Extras: React.FC = () => {
    const token = useSelector((state: { auth: { token: string } }) => state.auth.token);
    const toast = useRef<Toast>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [dataState, setDataState] = useState<'Add' | 'Edit'>('Add');
    const [isRequired, setIsRequired] = useState<boolean>(false);

    const initialCouponCodeFormData = {
        promoCode: '',
        promoPercentage: 0,
        status: false
    }

    const [couponCodeFormData, setCouponCodeFormData] = useState<CouponCodeFormData>(initialCouponCodeFormData);
    const [hasPromoCode, setHasPromoCode] = useState<boolean>(true);

    const promoSkeletonLayout: SkeletonLayout = {
        type: "column",
        items: [
            {
                type: "row",
                items: [
                    { width: "40%", height: "20px", className: "col-6 col-xl-4 col-xxl-3 mt-2" },
                    { width: "60%", height: "40px", className: "col-6 col-xl-8 col-xxl-9 mt-2" }
                ]
            },
            {
                type: "row",
                items: [
                    { width: "40%", height: "20px", className: "col-6 col-xl-4 col-xxl-3 mt-2" },
                    { width: "60%", height: "40px", className: "col-6 col-xl-8 col-xxl-9 mt-2" }
                ]
            },
            {
                type: "row",
                items: [
                    { width: "40%", height: "20px", className: "col-6 col-xl-4 col-xxl-3 mt-2" },
                    { width: "60%", height: "40px", className: "col-6 col-xl-8 col-xxl-9 mt-2" }
                ]
            },
            {
                type: "row",
                items: [
                    { width: "40%", height: "20px", className: "col-6 col-xl-4 col-xxl-3 mt-2" },
                    { width: "60%", height: "40px", className: "col-6 col-xl-8 col-xxl-9 mt-2" }
                ]
            }
        ]
    };

    const promoFormSkeletonLayout: SkeletonLayout = {
        type: "column",
        items: [
            {
                type: "row",
                items: [
                    { width: "40%", height: "25px", className: "col-12" }
                ]
            },
            {
                type: "row",
                items: [
                    { width: "50%", height: "50px", className: "col-12 col-xl-4 col-sm-6 mt-2" },
                    { width: "50%", height: "50px", className: "col-12 col-xl-4 col-sm-6 mt-2" }
                ]
            },
            {
                type: "row",
                items: [
                    { width: "50%", height: "50px", className: "col-12 col-xl-4 col-sm-6 mt-2" },
                    { width: "50%", height: "50px", className: "col-12 col-xl-4 col-sm-6 mt-2" }
                ]
            }
        ]
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCouponCodeFormData({
            ...couponCodeFormData,
            [name]: value
        });
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

    const updatePromoCode = async () => {
        if (!couponCodeFormData.promoCode || !couponCodeFormData.promoPercentage) {
            setIsRequired(true);
            showErrorToast(toast, "Error in Submission", "Please fill all required fields!");
            return;
        }
        setIsRequired(false);
        setLoading(true);
        const response = await apiRequest({
            method: "put",
            url: "/booking/update-promo-code",
            token,
            data: {
                id: 1,
                promoCode: couponCodeFormData?.promoCode,
                discount: couponCodeFormData?.promoPercentage
            }
        });

        console.log(response);
        if (response && !response?.error) {
            showSuccessToast(toast, "Promo code data updated!", "");
            setHasPromoCode(true);
            setDataState('Add');
            fetchPromoCodeData();
        } else {
            showErrorToast(toast, "Failed to update promo code data", response?.error);
        }
        setLoading(false);
    }

    const handleEditPromoCode = async () => {
        setDataState('Edit');
        fetchPromoCodeData();
    }

    const handleToggleCouponCodeStatus = (newStatus: boolean) => {
        confirmDialog({
            message: "Are you sure you want to change the promo code status?",
            header: 'Confirm Status Change',
            icon: 'bi bi-info-circle',
            defaultFocus: 'accept',
            dismissableMask: true,
            resizable: false,
            draggable: false,
            accept: () => changePromoCodeStatus(newStatus),
            reject: () => { },
        });
    }

    const fetchPromoCodeData = async () => {
        setLoading(true);
        const response = await apiRequest({
            method: "get",
            url: "/booking/get-promo-code",
            token
        });

        console.log(response);
        if (response && !response?.error) {
            setCouponCodeFormData({
                promoCode: response?.promoCode,
                promoPercentage: response?.discount,
                status: response?.isActive
            });
        } else {
            setCouponCodeFormData(initialCouponCodeFormData);
        }
        setLoading(false);
    }

    const changePromoCodeStatus = async (newStatus: boolean) => {
        setLoading(true);
        const response = await apiRequest({
            method: "put",
            url: "/booking/update-promo-code-status",
            params: {
                id: 1,
                status: newStatus ? 1 : 0
            },
            token
        });

        console.log(response);
        if (response && !response?.error) {
            showSuccessToast(toast, "Promo code status updated!", "");
            fetchPromoCodeData();
        } else {
            showErrorToast(toast, "Failed to update promo code status", response?.error);
        }
        setLoading(false);
    }

    useEffect(() => { fetchPromoCodeData() }, []);

    return (
        <React.Fragment>
            <Toast ref={toast} />

            <div>
                <div className="page_header_section">
                    <h4 className="page_heading">Extras</h4>
                </div>

                <div className="filter_area">
                    <h6 className="section_part_heading">Promo code</h6>

                    {(hasPromoCode === false && dataState === 'Add') || dataState === 'Edit' ? (
                        loading ? <SkeletonLoader layout={promoFormSkeletonLayout} /> :
                            (<div className="row">
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
                                            onClick={dataState === 'Add' ? handleCreatePromoCode : updatePromoCode}
                                        />
                                        {dataState === 'Edit' && (
                                            <Button
                                                label="Cancel"
                                                className="ms-2 custom_btn"
                                                severity="danger"
                                                onClick={() => {
                                                    setHasPromoCode(true);
                                                    setDataState('Add');
                                                    fetchPromoCodeData();
                                                }}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>)
                    ) : (
                        loading ? <SkeletonLoader layout={promoSkeletonLayout} /> :
                            (<div className="show_promo_area">
                                <div className="row">
                                    <div className="col-6 col-xl-4 col-xxl-3">
                                        <h6 className="extras_title">Promo code :</h6>
                                    </div>
                                    <div className="col-6 col-xl-8 col-xxl-9">
                                        <h6 className="extras_value">{couponCodeFormData?.promoCode || "-----"}</h6>
                                    </div>
                                </div>

                                <Divider />

                                <div className="row">
                                    <div className="col-6 col-xl-4 col-xxl-3">
                                        <h6 className="extras_title">Offer percentege :</h6>
                                    </div>
                                    <div className="col-6 col-xl-8 col-xxl-9">
                                        <h6 className="extras_value">{couponCodeFormData?.promoPercentage + "%" || "0%"}</h6>
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
                                                checked={couponCodeFormData?.status}
                                                className="custom_switch"
                                                onChange={(e: InputSwitchChangeEvent) => handleToggleCouponCodeStatus(e.value)}
                                            />

                                            {couponCodeFormData.status === true ? (
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

                                            {/* <button
                                                type="button"
                                                title="Delete coupon code"
                                                className="data_action_btn danger p-ripple"
                                                onClick={handleDeletePromocode}
                                            >
                                                <i className="bi bi-trash3"></i>
                                                <Ripple />
                                            </button> */}

                                        </div>
                                    </div>
                                </div>
                            </div>)
                    )}
                </div>
            </div>
        </React.Fragment>
    )
}

export default Extras;
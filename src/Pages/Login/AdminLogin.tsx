import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import './Login-responsive.css';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { Button } from "primereact/button";
import { Fade, Slide } from "react-awesome-reveal";
import { useAuthRedirect } from "../../middleware/middleware";
import { useDispatch } from "react-redux";
import apiRequest from "../../Utils/apiRequest";
import { showErrorToast, showSuccessToast } from "../../Utils/commonLogic";
import { setLogin } from "../../state";

interface SignInInfo {
    email: string;
    password: string;
}


const AdminLogin: React.FC = () => {
    useAuthRedirect();
    const toast = useRef<Toast | null>(null);
    const dispatch = useDispatch();
    const [require, setRequire] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const initialSignInInfo: SignInInfo = {
        email: "",
        password: "",
    };

    const [signInInfo, setSignInInfo] = useState<SignInInfo>(initialSignInInfo);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignInInfo((prev) => ({ ...prev, [name]: value }));
    };

    const login = async (loginInfo: SignInInfo) => {
        setLoading(true);
        try {
            const response = await apiRequest<any>({
                method: "post",
                url: "/auth/login",
                data: loginInfo,
            });

            if (response?.accessToken) {
                showSuccessToast(
                    toast,
                    "Login Successful",
                    "You have been logged in successfully"
                );

                setTimeout(() => {
                    dispatch(
                        setLogin({
                            user: response.userDto || null,
                            token: response.accessToken,
                        })
                    );
                }, 1000);
            } else {
                showErrorToast(
                    toast,
                    "Failed to Log In",
                    "Retry with correct login credentials"
                );
                setLoading(false);
            }
        } catch (error) {
            console.error("Login error:", error);
            showErrorToast(toast, "Login Error", "An unexpected error occurred.");
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!signInInfo.email || !signInInfo.password) {
            setRequire(true);
            showErrorToast(toast, "Error in Submission", "Please fill all required fields!");
            return;
        }

        login(signInInfo);
        setSignInInfo(initialSignInInfo);
        setRequire(false);
    };

    return (
        <>
            <Toast ref={toast} />

            <div className="auth_layout">
                <div className="container-md">
                    <div className="row">
                        <div className="col-12 col-xxl-5 col-xl-6 col-lg-6 col-md-8 col-sm-9 mx-auto">
                            <Fade triggerOnce>
                                <article className="auth_card">
                                    <div className="auth_card_header">
                                        <h3>
                                            <i className="bi bi-box-arrow-in-right me-3"></i>
                                            Sign in
                                        </h3>
                                    </div>
                                    <div className="auth_card_body">
                                        <div className="auth_card_img_area">
                                            <img src="/Login/sign_in_img1_green.svg" alt="Sign in" />
                                        </div>

                                        <div className="auth_form_area">
                                            <div className="auth_form_group">
                                                <div className="input_icon_group">
                                                    <i className="bi bi-envelope-fill"></i>
                                                    <InputText
                                                        value={signInInfo.email}
                                                        className="auth_form_input"
                                                        onChange={handleInputChange}
                                                        placeholder="Email"
                                                        type="email"
                                                        required
                                                        name="email"
                                                        keyfilter={'email'}
                                                    />
                                                </div>
                                                {require && !signInInfo.email && (<small className="auth_form_error">This field is required</small>)}
                                                <small className="auth_form_error">{!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInInfo.email) &&
                                                    signInInfo.email
                                                    ? "Enter a valid email"
                                                    : ""}</small>
                                            </div>

                                            <div className="auth_form_group">
                                                <div className="input_icon_group">
                                                    <i className="bi bi-lock-fill"></i>
                                                    <Password
                                                        value={signInInfo.password}
                                                        className="auth_form_input is_password"
                                                        onChange={handleInputChange}
                                                        placeholder="Password"
                                                        feedback={false}
                                                        tabIndex={1}
                                                        toggleMask
                                                        name="password"
                                                    />
                                                </div>
                                                {require && !signInInfo.password &&  (<small className="auth_form_error">This field is required</small>)}
                                            </div>

                                            {/* <div className="auth_form_group">
                                                {loginError && (<span className="error_message_label">{loginError}</span>)}
                                            </div> */}

                                            <div className="auth_btn_group">
                                                <Button
                                                    label="LOGIN"
                                                    loading={loading}
                                                    className="auth_form_button"
                                                    onClick={handleSubmit}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            </Fade>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminLogin;
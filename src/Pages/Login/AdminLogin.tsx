import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';
import './Login-responsive.css';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { Password } from 'primereact/password';
import { Button } from "primereact/button";
import { Fade, Slide } from "react-awesome-reveal";

const AdminLogin: React.FC = () => {
    const toast = useRef<Toast>(null);
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');

    const [loginError, setLoginError] = useState<string>('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            setTimeout(() => {
                setLoading(false);
                if (toast.current) {
                    toast.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'You have successfully logged in.',
                        life: 3000,
                    });
                }
                setTimeout(() => {
                    navigate(`/booking`);
                }, 2000);
            }, 500);
        } catch (error) {
            setLoading(false);
            if (toast.current) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Failed',
                    detail: 'An error occurred while logging in.',
                    life: 3000
                });
            }
        }
    }

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
                                                        value={email}
                                                        className="auth_form_input"
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                                                        placeholder="Email"
                                                        type="email"
                                                        required
                                                        keyfilter={'email'}
                                                    />
                                                </div>
                                                {emailError && (<small className="auth_form_error">{emailError}</small>)}
                                            </div>

                                            <div className="auth_form_group">
                                                <div className="input_icon_group">
                                                    <i className="bi bi-lock-fill"></i>
                                                    <Password
                                                        value={password}
                                                        className="auth_form_input is_password"
                                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                                                        placeholder="Password"
                                                        feedback={false}
                                                        tabIndex={1}
                                                        toggleMask
                                                    />
                                                </div>
                                                {passwordError && (<small className="auth_form_error">{passwordError}</small>)}
                                            </div>

                                            <div className="auth_form_group">
                                                {loginError && (<span className="error_message_label">{loginError}</span>)}
                                            </div>

                                            <div className="auth_btn_group">
                                                <Button
                                                    label="LOGIN"
                                                    loading={loading}
                                                    className="auth_form_button"
                                                    onClick={handleLogin}
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
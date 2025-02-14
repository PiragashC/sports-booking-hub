import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useDispatch } from "react-redux";
import { setLogin } from "../../state";
import apiRequest from "../../Utils/apiRequest";
import { showErrorToast, showSuccessToast } from "../../Utils/commonLogic";
import { useAuthRedirect } from "../../middleware/middleware";

interface SignInInfo {
    email: string;
    password: string;
}

interface LoginResponse {
    userDto: { id: string, userName: string, email: string };
    accessToken: string;
}

const AdminLogin: React.FC = () => {
    useAuthRedirect();
    const toast = useRef<Toast | null>(null);
    const dispatch = useDispatch();
    const [checked, setChecked] = useState<boolean>(false);
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

            <div className="login_bg">
                <div className="col-12 col-xl-4 col-lg-6 col-sm-8 col-md-88 mx-auto">
                    <article className="custom-card" data-aos="fade-up">
                        <div className="custom-card-logo-area">
                            <img
                                src="assets/images/logo.png"
                                className="custom-card-logo"
                                alt="The Parking Deals"
                            />
                        </div>
                        <h3 className="custom-card-title">Admin Login</h3>
                        <h6 className="custom-card-sub-title">
                            Welcome Back! Please enter your credentials to access the admin dashboard
                        </h6>
                        <form className="custom-card-form" onSubmit={handleSubmit}>
                            <div className="custom-form-group contains-float-input">
                                <FloatLabel>
                                    <InputText
                                        id="email"
                                        keyfilter="email"
                                        className="custom-form-input"
                                        name="email"
                                        value={signInInfo.email}
                                        onChange={handleInputChange}
                                    />
                                    <label htmlFor="email" className="custom-float-label">
                                        Email
                                    </label>
                                </FloatLabel>
                                {require && !signInInfo.email && (
                                    <small className="text-danger form-error-msg">
                                        This field is required
                                    </small>
                                )}
                                <small className="text-danger form-error-msg">
                                    {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInInfo.email) &&
                                        signInInfo.email
                                        ? "Enter a valid email"
                                        : ""}
                                </small>
                            </div>

                            <div className="custom-form-group contains-float-input">
                                <FloatLabel>
                                    <Password
                                        className="custom-form-input"
                                        name="password"
                                        value={signInInfo.password}
                                        onChange={handleInputChange}
                                        feedback={false}
                                        toggleMask
                                    />
                                    <label htmlFor="password" className="custom-float-label">
                                        Password
                                    </label>
                                </FloatLabel>
                                {require && !signInInfo.password && (
                                    <small className="text-danger form-error-msg">
                                        This field is required
                                    </small>
                                )}
                            </div>

                            <div className="custom-form-group contains-float-input">
                                <div className="custom-check-group">
                                    <div className="custom-check-area">
                                        <Checkbox
                                            inputId="rememberMe"
                                            onChange={(e) => setChecked(e.checked ?? false)}
                                            checked={checked}
                                        />
                                        <label htmlFor="rememberMe" className="custom-check-label">
                                            Remember me
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="custom-form-group contains-float-input mb-0">
                                <Button
                                    label="LOGIN"
                                    className="w-100 submit-button justify-content-center"
                                    loading={loading}
                                />
                            </div>
                        </form>
                    </article>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;

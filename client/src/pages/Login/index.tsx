import React, { useState } from "react";
import "./index.css";
import { Link, TextField, FormHelperText } from "@mui/material";
import { useCookies } from "react-cookie";
import { login, register } from "./service";
import { LoadingButton } from "@mui/lab";

const Login = () => {
    const [toggleLogin, setToggleLogin] = useState<Boolean>(true);

    const handleToggleLogin = () => {
        setToggleLogin((prevValue) => !prevValue);
    };

    const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

    const [loginEmail, setLoginEmail] = useState<string>("");
    const [loginPassword, setLoginPassword] = useState<string>("");
    const [loginError, setLoginError] = useState<string>("");

    const [registerEmail, setRegisterEmail] = useState<string>("");
    const [registerPassword, setRegisterPassword] = useState<string>("");
    const [registerError, setRegisterError] = useState<string>("");

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [cookies, setCookie, removeCookie] = useCookies<any>(["user"]);

    const handleRegister = async () => {
        setIsButtonLoading(true);
        try {
            // Register User
            const response = await register({
                email: registerEmail,
                password: registerPassword,
            });

            setCookie("Email", response.email, {
                path: "/Bug-Tracking-System",
            });
            setCookie("AuthToken", response.token, {
                path: "/Bug-Tracking-System",
            });

            window.location.reload();
        } catch (err: any) {
            if (err?.response?.data) {
                setRegisterError(err.response.data);
            } else {
                setRegisterEmail(err.message);
            }
        }
        setIsButtonLoading(false);
    };

    const handleLogin = async () => {
        setIsButtonLoading(true);
        try {
            const response = await login({
                email: loginEmail,
                password: loginPassword,
            });

            setCookie("Email", response.email, {
                path: "/Bug-Tracking-System",
            });
            setCookie("AuthToken", response.token, {
                path: "/Bug-Tracking-System",
            });

            window.location.reload();
        } catch (err: any) {
            if (err?.response?.data) {
                setLoginError(err.response.data);
            } else {
                setLoginError(err.message);
            }
        }
        setIsButtonLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-background-overlay"></div>
            
            {toggleLogin && (
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Welcome Back</h2>
                        <p>Sign in to continue to your account</p>
                    </div>

                    <div className="auth-form">
                        <TextField
                            label="Email / Username"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => {
                                setLoginEmail(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleLogin();
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#667eea',
                                }
                            }}
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            type={"password"}
                            fullWidth
                            onChange={(e) => {
                                setLoginPassword(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleLogin();
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': {
                                        borderColor: '#667eea',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#667eea',
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#667eea',
                                }
                            }}
                        />
                        <LoadingButton
                            variant="contained"
                            loading={isButtonLoading}
                            className="auth-button login-button"
                            onClick={handleLogin}
                        >
                            Sign In
                        </LoadingButton>
                        <Link
                            className="auth-link"
                            onClick={handleToggleLogin}
                        >
                            Don't have an account? <span className="link-highlight">Sign Up</span>
                        </Link>
                        {loginError && (
                            <FormHelperText error className="error-message">{loginError}</FormHelperText>
                        )}
                    </div>
                </div>
            )}

            {!toggleLogin && (
                <div className="auth-card">
                    <div className="auth-header">
                        <h2>Create Account</h2>
                        <p>Sign up to get started</p>
                    </div>

                    <div className="auth-form">
                        <TextField
                            label="Email / Username"
                            variant="outlined"
                            fullWidth
                            onChange={(e) => {
                                setRegisterEmail(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleRegister();
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': {
                                        borderColor: '#f093fb',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#f093fb',
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#f093fb',
                                }
                            }}
                        />
                        <TextField
                            label="Password"
                            type={"password"}
                            variant="outlined"
                            fullWidth
                            onChange={(e) => {
                                setRegisterPassword(e.target.value);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleRegister();
                                }
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': {
                                        borderColor: '#f093fb',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#f093fb',
                                    }
                                },
                                '& .MuiInputLabel-root.Mui-focused': {
                                    color: '#f093fb',
                                }
                            }}
                        />
                        <LoadingButton
                            variant="contained"
                            loading={isButtonLoading}
                            className="auth-button register-button"
                            onClick={handleRegister}
                        >
                            Create Account
                        </LoadingButton>
                        <Link
                            className="auth-link"
                            onClick={handleToggleLogin}
                        >
                            Already have an account? <span className="link-highlight">Sign In</span>
                        </Link>
                        {registerError && (
                            <FormHelperText error className="error-message">{registerError}</FormHelperText>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;
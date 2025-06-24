import React, { useState } from "react";
import "./register.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Register() {
    const [email, setEmail] = useState("");
    const [passwd, setPasswd] = useState("");
    const [confirmPasswd, setConfirmPasswd] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Register Here!</h2>
                <form className="register-form" onSubmit={e => {
                    e.preventDefault();
                    setError("");
                    setSuccess("");
                    if (!email || !passwd || !confirmPasswd) {
                        setError("All fields are required.");
                        return;
                    }
                    if (!email.includes("@gmail.com")) {
                        setError("Email must contain @gmail.com");
                        return;
                    }
                    if (passwd !== confirmPasswd) {
                        setError("Passwords do not match.");
                        return;
                    }
                    // Proceed with registration logic here
                    setSuccess("Registration successful!");
                }}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Enter your Email"
                            className="form-input"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group" style={{ position: "relative" }}>
                        <input
                            type={showPass ? "text" : "password"}
                            placeholder="Enter your Password"
                            className="form-input"
                            onChange={(e) => setPasswd(e.target.value)}
                            required
                        />
                        <span
                            onClick={() => setShowPass(!showPass)}
                            style={{
                                position: "absolute",
                                right: "15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                fontSize: "20px",
                                color: "#667eea"
                            }}
                        >
                            {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </span>
                    </div>
                    <div className="form-group" style={{ position: "relative" }}>
                        <input
                            type={showConfirmPass ? "text" : "password"}
                            placeholder="Confirm your Password"
                            className="form-input"
                            onChange={(e) => setConfirmPasswd(e.target.value)}
                            required
                        />
                        <span
                            onClick={() => setShowConfirmPass(!showConfirmPass)}
                            style={{
                                position: "absolute",
                                right: "15px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                fontSize: "20px",
                                color: "#667eea"
                            }}
                        >
                            {showConfirmPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                        </span>
                    </div>
                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
                {error && <div className="register-error" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
                {success && <div className="register-success" style={{ color: 'green', marginBottom: '10px' }}>{success}</div>}
            </div>
        </div>
    );
}

export default Register;

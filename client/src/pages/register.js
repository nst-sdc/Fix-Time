import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Register() {
    const [email, setEmail] = useState("");
    const [passwd, setPasswd] = useState("");
    const [confirmPasswd, setConfirmPasswd] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);

    const inputStyle = {
        width: "300px",
        padding: "10px",
        paddingRight: "40px", // space for the icon
        boxSizing: "border-box"
    };

    return (
        <div style={{ display: "grid", placeItems: "center" }}>
            <h2>Register Here!</h2>
            <form style={{ position: "relative" }}>
                <div style={{ marginBottom: "10px" }}>
                    <input
                        type="email"
                        placeholder="Enter your Email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={inputStyle}
                    />
                </div>

                <div style={{ marginBottom: "10px", position: "relative" }}>
                    <input
                        type={showPass ? "text" : "password"}
                        placeholder="Enter your Password"
                        onChange={(e) => setPasswd(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <span
                        onClick={() => setShowPass(!showPass)}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer"
                        }}
                    >
                        {showPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </span>
                </div>

                <div style={{ marginBottom: "10px", position: "relative" }}>
                    <input
                        type={showConfirmPass ? "text" : "password"}
                        placeholder="Confirm your Password"
                        onChange={(e) => setConfirmPasswd(e.target.value)}
                        required
                        style={inputStyle}
                    />
                    <span
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            cursor: "pointer"
                        }}
                    >
                        {showConfirmPass ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                    </span>
                </div>

                <button type="submit" style={{ padding: "8px 16px" }}>
                    Register
                </button>
            </form>
        </div>
    );
}

export default Register;

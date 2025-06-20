import React, { useState } from "react";
import "./register.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

function Register() {
    const [email, setEmail] = useState("");
    const [passwd, setPasswd] = useState("");
    const [confirmPasswd, setConfirmPasswd] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [message,setMessage]=useState("");
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwd !== confirmPasswd) {
            setMessage("❌ Passwords do not match");
            return;}
        try {
            const response = await axios.post("http://localhost:5001/auth/register", {email,password: passwd,});
            setMessage("✅ Registered successfully!");
            console.log("Server Response:", response.data);}
            catch (error) {
                setMessage("❌ Registration failed.");
                console.error("Error:", error.response?.data || error.message);}
            };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Register Here!</h2>
                <form className="register-form" onSubmit={handleSubmit}>
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
                    {message && (<p style={{ color: message.includes("❌") ? "red" : "green", marginBottom: "10px" }}>{message}</p>)}

                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Register;

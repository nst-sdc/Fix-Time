import React,{useState} from "react"
import "./register.css"

function Register(){
    const [email,setEmail]=useState("")
    const [passwd,setPasswd]=useState("")
    const [confirmPasswd,setConfirmPasswd]=useState("")
    
    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Register Here!</h2>
                <form className="register-form">
                    <div className="form-group">
                        <input 
                            type="email" 
                            placeholder="Enter your Email" 
                            className="form-input"
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            placeholder="Enter your Password" 
                            className="form-input"
                            onChange={(e)=> setPasswd(e.target.value)} 
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input 
                            type="password" 
                            placeholder="Confirm your Password" 
                            className="form-input"
                            onChange={(e)=> setConfirmPasswd(e.target.value)} 
                            required
                        />
                    </div>
                    <button type="submit" className="register-button">
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register

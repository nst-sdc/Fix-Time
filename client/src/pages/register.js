import React,{useState} from "react"
function Register(){
    const [email,setEmail]=useState("")
    const [passwd,setPasswd]=useState("")
    const [confirmPasswd,setConfirmPasswd]=useState("")
    return (<div style={{ display:"grid", placeItems: "center"}}>
        <h2>Register Here!</h2>
        <form>
            <div style={{ marginBottom: "10px" }}>
                <input type="email" placeholder="Enter your Email" onChange={(e) => setEmail(e.target.value)} required/>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <input type="password" placeholder="Enter your Password" onChange={(e)=> setPasswd(e.target.value)} required/>
            </div>
            <div style={{ marginBottom: "10px" }}>
                <input type="password" placeholder="Confirm your Password" onChange={(e)=> setConfirmPasswd(e.target.value)} required/>
            </div>
            <button type="submit" style={{ padding: "8px 16px" }}> Register </button>
        </form>
    </div>)
}
export default Register

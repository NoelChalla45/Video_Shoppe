// Source - https://stackoverflow.com/q/71249688
// Posted by aneuroo
// Retrieved 2026-02-15, License - CC BY-SA 4.0

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
    // State hooks to replace this.state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    // Hook for navigation
    const navigate = useNavigate();

    const onLoginClick = () => {
        // Here you can add authentication logic
        console.log("Login attempted with:", email);
        
        // Redirect to the home page
        navigate("/home");
    };

    return (
        <div className="col-lg-9" style={{ marginTop: "50px", marginLeft: "auto", marginRight: "auto" }}>
            <h4 className="m-1 p-2 border-bottom">Login</h4>
            
            <div className="form-group form-row">
                <label className="col-lg-4">Email:</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={email}
                    onChange={(event) => {
                        setEmail(event.target.value);
                        console.log(event.target.value);
                    }}
                />
            </div>

            <div className="form-group form-row">
                <label className="col-lg-4">Password:</label>
                <input 
                    type="password" 
                    className="form-control" 
                    value={password}
                    onChange={(event) => {
                        setPassword(event.target.value);
                        console.log(event.target.value);
                    }}
                /> 
            </div>

            <div>
                <button className="btn btn-primary" onClick={onLoginClick}>
                    Login
                </button>
            </div>
        </div>
    );
};

export default Login;
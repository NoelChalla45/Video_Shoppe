import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Login = () => {
    const [mode, setMode] = useState("login"); // "login" | "register"
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
        const body = mode === "login" ? { email, password } : { email, password, name };

        try {
            const res = await fetch(`${API}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong.");
                setIsLoading(false);
                return;
            }

            // Save token
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/home");
        } catch (err) {
            setError("Could not reach the server. Is the backend running?");
            setIsLoading(false);
        }
    };

    const switchMode = () => {
        setMode(mode === "login" ? "register" : "login");
        setError("");
        setName("");
        setEmail("");
        setPassword("");
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-brand">
                    <span className="login-brand-icon">🎬</span>
                    <h1 className="login-brand-name">Video Shoppe</h1>
                    <p className="login-brand-tagline">Your world of cinema awaits</p>
                </div>

                <div className="mode-toggle">
                    <button
                        className={`mode-btn ${mode === "login" ? "active" : ""}`}
                        onClick={() => { setMode("login"); setError(""); }}
                        type="button"
                    >
                        Sign In
                    </button>
                    <button
                        className={`mode-btn ${mode === "register" ? "active" : ""}`}
                        onClick={() => { setMode("register"); setError(""); }}
                        type="button"
                    >
                        Create Account
                    </button>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    {mode === "register" && (
                        <div className="input-group">
                            <label>Name <span className="optional">(optional)</span></label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label>Password {mode === "register" && <span className="optional">(min 6 chars)</span>}</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {mode === "login" && (
                        <div className="login-options">
                            <label className="remember-me">
                                <input type="checkbox" /> Remember me
                            </label>
                            <a href="#" className="forgot-link">Forgot password?</a>
                        </div>
                    )}

                    {error && <div className="auth-error">{error}</div>}

                    <button
                        type="submit"
                        className={`login-btn ${isLoading ? "loading" : ""}`}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? <span className="spinner"></span>
                            : mode === "login" ? "Sign In" : "Create Account"
                        }
                    </button>
                </form>

                <p className="signup-prompt">
                    {mode === "login"
                        ? <>Don't have an account? <a onClick={switchMode} href="#">Sign up free</a></>
                        : <>Already have an account? <a onClick={switchMode} href="#">Sign in</a></>
                    }
                </p>
            </div>
        </div>
    );
};

export default Login;
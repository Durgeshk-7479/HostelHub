import { useState } from "react";
import "./Login.css";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            const response = await fetch(
                "https://hostelhub-backend-82k9.onrender.com/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.role);

                window.location.href = "/";

            } else {

                alert(data.message);
                setLoading(false);

            }

        } catch (error) {

            console.log("Login error:", error);

            alert("Unable to connect to server");

            setLoading(false);

        }
    };

    return (
        <div className="login-page">

            <div className="login-glow glow-one"></div>
            <div className="login-glow glow-two"></div>

            <div className="login-container">

                <div className="login-brand">

                    <div className="brand-icon">
                        🏠
                    </div>

                    <h1>HostelHub</h1>

                    <p>
                        Smart Hostel Management
                    </p>

                </div>

                <div className="login-card">

                    <div className="login-header">

                        <h2>Welcome Back</h2>

                        <p>
                            Login to access your dashboard
                        </p>

                    </div>

                    <form onSubmit={handleLogin}>

                        <div className="input-group">

                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                                disabled={loading}
                            />

                        </div>

                        <div className="input-group">

                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                                disabled={loading}
                            />

                        </div>

                        <button
                            className="login-btn"
                            type="submit"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="login-spinner"></span>
                                    Logging in...
                                </>
                            ) : (
                                <>
                                    Login
                                    <span>→</span>
                                </>
                            )}

                        </button>

                    </form>

                    <div className="login-divider">
                        <span>OR</span>
                    </div>

                    <button
                        className="register-btn"
                        type="button"
                        disabled={loading}
                        onClick={() => {
                            window.location.href = "/register";
                        }}
                    >
                        Create Student Account
                    </button>

                </div>

                <p className="login-footer">
                    © 2026 HostelHub • Hostel Management System
                </p>

            </div>

        </div>
    );
}

export default Login;
import { useState } from "react";
import "./Register.css";

function Register() {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [roomNumber, setRoomNumber] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        phone,
                        roomNumber
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Registration successful!");

                window.location.href = "/";

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(
                "Registration error:",
                error
            );

            alert(
                "Unable to connect to server"
            );

        }

    };


    return (

        <div className="register-page">

            {/* Background Glow */}

            <div className="register-glow glow-one"></div>

            <div className="register-glow glow-two"></div>


            <div className="register-container">


                {/* Brand */}

                <div className="register-brand">

                    <div className="brand-icon">
                        🏠
                    </div>

                    <h1>
                        HostelHub
                    </h1>

                    <p>
                        Smart Hostel Management
                    </p>

                </div>


                {/* Registration Card */}

                <div className="register-card">


                    <div className="register-header">

                        <h2>
                            Create Account
                        </h2>

                        <p>
                            Register as a hostel student
                        </p>

                    </div>


                    <form
                        onSubmit={handleRegister}
                    >


                        {/* Name */}

                        <div className="register-input-group">

                            <label>
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* Email */}

                        <div className="register-input-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* Password */}

                        <div className="register-input-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* Phone */}

                        <div className="register-input-group">

                            <label>
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                value={phone}
                                onChange={(e) =>
                                    setPhone(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* Room */}

                        <div className="register-input-group">

                            <label>
                                Room Number
                            </label>

                            <input
                                type="text"
                                placeholder="Example: B-210"
                                value={roomNumber}
                                onChange={(e) =>
                                    setRoomNumber(e.target.value)
                                }
                                required
                            />

                        </div>


                        {/* Register Button */}

                        <button
                            className="register-submit-btn"
                            type="submit"
                        >
                            Create Account
                            <span>→</span>
                        </button>

                    </form>


                    {/* Divider */}

                    <div className="register-divider">
                        <span>OR</span>
                    </div>


                    {/* Login */}

                    <button
                        className="back-login-btn"
                        type="button"
                        onClick={() => {
                            window.location.href = "/";
                        }}
                    >
                        Already have an account? Login
                    </button>

                </div>


                {/* Footer */}

                <p className="register-footer">
                    © 2026 HostelHub • Hostel Management System
                </p>

            </div>

        </div>

    );
}

export default Register;
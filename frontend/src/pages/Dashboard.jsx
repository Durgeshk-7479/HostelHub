import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {

    const [student, setStudent] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [problem, setProblem] = useState("");
    const [room, setRoom] = useState(null);

    const [editPhone, setEditPhone] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {

        const fetchData = async () => {

            const token = localStorage.getItem("token");

            try {

                // Fetch student
                const studentResponse = await fetch(
                    "https://hostelhub-backend-82k9.onrender.com/api/students/me",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const studentData = await studentResponse.json();

                if (studentResponse.ok) {

                    setStudent(studentData);

                    // Fetch room
                    const roomResponse = await fetch(
                        `https://hostelhub-backend-82k9.onrender.com/api/rooms/${studentData.roomNumber}`
                    );

                    const roomData = await roomResponse.json();

                    if (roomResponse.ok) {
                        setRoom(roomData);
                    }
                }

                // Fetch complaints
                const complaintResponse = await fetch(
                    "https://hostelhub-backend-82k9.onrender.com/api/complaints/my",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const complaintData = await complaintResponse.json();

                if (complaintResponse.ok) {
                    setComplaints(complaintData);
                }

            } catch (error) {

                console.log("Dashboard error:", error);

            }
        };

        fetchData();

    }, []);

    // Update profile
    const handleProfileUpdate = async () => {

        console.log("UPDATE FUNCTION CALLED");

        try {

            const token = localStorage.getItem("token");

            console.log("Token exists:", !!token);
            console.log("Updating phone:", editPhone);

            const response = await fetch(
                "https://hostelhub-backend-82k9.onrender.com/api/students/me",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        phone: editPhone
                    })
                }
            );

            console.log("Update response status:", response.status);

            const data = await response.json();

            console.log("Update response:", data);

            if (response.ok) {

                alert("Profile updated successfully");

                setStudent(data.student);
                setIsEditing(false);

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log("Profile update error:", error);
            alert("Something went wrong");

        }
    };

    // Submit complaint
    const handleComplaint = async (e) => {

        e.preventDefault();

        if (!problem.trim()) {
            alert("Please enter your problem");
            return;
        }

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                "https://hostelhub-backend-82k9.onrender.com/api/complaints",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        problem: problem
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Complaint submitted successfully");

                setComplaints((prevComplaints) => [
                    ...prevComplaints,
                    data.complaint
                ]);

                setProblem("");

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log("Complaint error:", error);
            alert("Something went wrong");

        }
    };

    // Logout
    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        window.location.href = "/";

    };

    const getStatusClass = (status) => {

        if (status === "Resolved") {
            return "status resolved";
        }

        if (status === "In Progress") {
            return "status progress";
        }

        return "status pending";
    };

    return (
        <div className="student-page">

            {/* Navbar */}

            <header className="student-navbar">

                <div className="student-logo">
                    <span>🏠</span>
                    HostelHub
                </div>

                <div className="student-nav-right">

                    <span className="student-role">
                        Student
                    </span>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </header>

            {/* Main Content */}

            <main className="student-container">

                {/* Welcome */}

                <section className="welcome-section">

                    <div>

                        <h1>
                            Welcome back, {student?.name || "Student"} 👋
                        </h1>

                        <p>
                            Here's your hostel overview
                        </p>

                    </div>

                </section>

                {/* Quick Stats */}

                <section className="student-stats">

                    <div className="student-stat-card">

                        <div className="stat-icon">
                            🛏️
                        </div>

                        <div>
                            <p>My Room</p>
                            <h2>
                                {room?.roomNumber || "--"}
                            </h2>
                        </div>

                    </div>

                    <div className="student-stat-card">

                        <div className="stat-icon">
                            📝
                        </div>

                        <div>
                            <p>Complaints</p>
                            <h2>
                                {complaints.length}
                            </h2>
                        </div>

                    </div>

                    <div className="student-stat-card">

                        <div className="stat-icon">
                            🟢
                        </div>

                        <div>
                            <p>Room Status</p>

                            <h2>
                                {room?.availableBeds > 0
                                    ? "Available"
                                    : "Full"}
                            </h2>

                        </div>

                    </div>

                </section>

                {/* Profile + Room */}

                <section className="info-grid">

                    {/* Profile Card */}

                    <div className="student-card">

                        <div className="card-header">

                            <h2>👤 My Profile</h2>

                            {!isEditing && (
                                <button
                                    className="edit-btn"
                                    onClick={() => {
                                        setEditPhone(student.phone);
                                        setIsEditing(true);
                                    }}
                                >
                                    Edit
                                </button>
                            )}

                        </div>

                        {student && (

                            <div className="profile-content">

                                <div className="avatar">
                                    {student.name.charAt(0).toUpperCase()}
                                </div>

                                <div className="profile-details">

                                    <div>
                                        <span>Name</span>
                                        <strong>
                                            {student.name}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Email</span>
                                        <strong>
                                            {student.email}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Phone</span>

                                        {isEditing ? (

                                            <input
                                                className="profile-input"
                                                type="text"
                                                value={editPhone}
                                                onChange={(e) =>
                                                    setEditPhone(e.target.value)
                                                }
                                            />

                                        ) : (

                                            <strong>
                                                {student.phone}
                                            </strong>

                                        )}

                                    </div>

                                </div>

                                {isEditing && (

                                    <div className="edit-actions">

                                        <button
                                            className="save-btn"
                                            onClick={handleProfileUpdate}
                                        >
                                            Save Changes
                                        </button>

                                        <button
                                            className="cancel-btn"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditPhone("");
                                            }}
                                        >
                                            Cancel
                                        </button>

                                    </div>

                                )}

                            </div>

                        )}

                    </div>

                    {/* Room Card */}

                    <div className="student-card">

                        <div className="card-header">

                            <h2>🛏️ My Room</h2>

                            {room && (
                                <span
                                    className={
                                        room.availableBeds > 0
                                            ? "room-badge available"
                                            : "room-badge full"
                                    }
                                >
                                    {room.availableBeds > 0
                                        ? "Available"
                                        : "Full"}
                                </span>
                            )}

                        </div>

                        {room && (

                            <div className="room-content">

                                <div className="room-number">
                                    {room.roomNumber}
                                </div>

                                <div className="room-info-grid">

                                    <div>
                                        <span>Capacity</span>
                                        <strong>
                                            {room.capacity}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Occupied</span>
                                        <strong>
                                            {room.occupiedBeds}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Available</span>
                                        <strong>
                                            {room.availableBeds}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                        )}

                    </div>

                </section>

                {/* Complaint Form */}

                <section className="student-card complaint-card">

                    <div className="card-header">

                        <div>

                            <h2>📝 Raise a Complaint</h2>

                            <p>
                                Having an issue? Let the hostel administration know.
                            </p>

                        </div>

                    </div>

                    <form
                        className="complaint-form"
                        onSubmit={handleComplaint}
                    >

                        <input
                            type="text"
                            placeholder="Describe your problem..."
                            value={problem}
                            onChange={(e) =>
                                setProblem(e.target.value)
                            }
                        />

                        <button type="submit">
                            Submit Complaint
                        </button>

                    </form>

                </section>

                {/* Complaints */}

                <section className="student-card">

                    <div className="card-header">

                        <div>

                            <h2>📋 My Complaints</h2>

                            <p>
                                Track the status of your complaints.
                            </p>

                        </div>

                    </div>

                    {complaints.length === 0 ? (

                        <div className="empty-state">

                            <div>📭</div>

                            <h3>No complaints yet</h3>

                            <p>
                                You haven't submitted any complaints.
                            </p>

                        </div>

                    ) : (

                        <div className="complaints-list">

                            {complaints.map((complaint) => (

                                <div
                                    className="complaint-item"
                                    key={complaint._id}
                                >

                                    <div className="complaint-icon">
                                        🛠️
                                    </div>

                                    <div className="complaint-info">

                                        <h3>
                                            {complaint.problem}
                                        </h3>

                                        <p>
                                            Room: {complaint.roomNumber}
                                        </p>

                                    </div>

                                    <span
                                        className={getStatusClass(
                                            complaint.status
                                        )}
                                    >
                                        {complaint.status}
                                    </span>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default Dashboard;
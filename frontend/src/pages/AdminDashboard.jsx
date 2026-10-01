import { useEffect, useState } from "react";

function AdminDashboard() {

    const [stats, setStats] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [students, setStudents] = useState([]);

    const [roomNumber, setRoomNumber] = useState("");
    const [capacity, setCapacity] = useState("");

    const [editingRoomId, setEditingRoomId] = useState(null);
    const [editCapacity, setEditCapacity] = useState("");

    const [editingStudentId, setEditingStudentId] = useState(null);
    const [editPhone, setEditPhone] = useState("");
    const [editRoomNumber, setEditRoomNumber] = useState("");


    // ======================================================
    // FETCH ALL ADMIN DATA
    // ======================================================

    const fetchData = async () => {

        const token = localStorage.getItem("token");

        try {

            // Fetch Stats
            const statsResponse = await fetch(
                "http://localhost:5000/api/admin/stats",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const statsData = await statsResponse.json();

            if (statsResponse.ok) {
                setStats(statsData);
            }


            // Fetch Complaints
            const complaintResponse = await fetch(
                "http://localhost:5000/api/complaints/admin",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const complaintData =
                await complaintResponse.json();

            if (complaintResponse.ok) {
                setComplaints(complaintData);
            }


            // Fetch Rooms
            const roomResponse = await fetch(
                "http://localhost:5000/api/rooms"
            );

            const roomData =
                await roomResponse.json();

            if (roomResponse.ok) {
                setRooms(roomData);
            }


            // Fetch Students
            const studentResponse = await fetch(
                "http://localhost:5000/api/students",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const studentData =
                await studentResponse.json();

            if (studentResponse.ok) {
                setStudents(studentData);
            }

        } catch (error) {

            console.log(
                "Fetch data error:",
                error
            );

        }

    };


    // ======================================================
    // LOAD DATA WHEN PAGE OPENS
    // ======================================================

    useEffect(() => {

        fetchData();

    }, []);


    // ======================================================
    // ADD ROOM
    // ======================================================

    const addRoom = async (e) => {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/rooms",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        roomNumber,
                        capacity: Number(capacity),
                        occupiedBeds: 0,
                        availableBeds: Number(capacity)
                    })
                }
            );

            const data =
                await response.json();

            if (response.ok) {

                alert(
                    "Room added successfully"
                );

                setRoomNumber("");
                setCapacity("");

                fetchData();

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(
                "Add room error:",
                error
            );

            alert(
                "Something went wrong"
            );

        }

    };


    // ======================================================
    // UPDATE ROOM
    // ======================================================

    const updateRoom = async (room) => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/rooms/${room._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        capacity: Number(editCapacity)
                    })
                }
            );

            const data =
                await response.json();

            if (response.ok) {

                alert(
                    "Room updated successfully"
                );

                setRooms((prevRooms) =>
                    prevRooms.map((r) =>
                        r._id === room._id
                            ? data.room
                            : r
                    )
                );

                setEditingRoomId(null);
                setEditCapacity("");

                fetchData();

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(
                "Update room error:",
                error
            );

            alert(
                "Something went wrong"
            );

        }

    };


    // ======================================================
    // DELETE ROOM
    // ======================================================

    const deleteRoom = async (room) => {

        const confirmDelete =
            window.confirm(
                `Are you sure you want to delete room ${room.roomNumber}?`
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/rooms/${room._id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (response.ok) {

                alert(
                    "Room deleted successfully"
                );

                setRooms((prevRooms) =>
                    prevRooms.filter(
                        (r) =>
                            r._id !== room._id
                    )
                );

                fetchData();

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(
                "Delete room error:",
                error
            );

            alert(
                "Something went wrong"
            );

        }

    };


    // ======================================================
    // UPDATE STUDENT
    // ======================================================

    const updateStudent = async (studentId) => {

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/students/${studentId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        phone: editPhone,
                        roomNumber: editRoomNumber
                    })
                }
            );

            const data =
                await response.json();

            if (response.ok) {

                alert(
                    "Student updated successfully"
                );

                setStudents((prevStudents) =>
                    prevStudents.map(
                        (student) =>
                            student._id === studentId
                                ? data.student
                                : student
                    )
                );

                setEditingStudentId(null);
                setEditPhone("");
                setEditRoomNumber("");

                fetchData();

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(
                "Update student error:",
                error
            );

            alert(
                "Something went wrong"
            );

        }

    };


    // ======================================================
    // DELETE STUDENT
    // ======================================================

    const deleteStudent = async (studentId) => {

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this student?"
            );

        if (!confirmDelete) {
            return;
        }

        try {

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:5000/api/students/${studentId}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data =
                await response.json();

            if (response.ok) {

                alert(
                    "Student deleted successfully"
                );

                setStudents((prevStudents) =>
                    prevStudents.filter(
                        (student) =>
                            student._id !== studentId
                    )
                );

                fetchData();

            } else {

                alert(data.message);

            }

        } catch (error) {

            console.log(
                "Delete student error:",
                error
            );

            alert(
                "Something went wrong"
            );

        }

    };


    // ======================================================
    // UPDATE COMPLAINT STATUS
    // ======================================================

    const updateComplaintStatus =
        async (id, status) => {

            try {

                const token =
                    localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:5000/api/complaints/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            status: status
                        })
                    }
                );

                const data =
                    await response.json();

                if (response.ok) {

                    setComplaints(
                        (prevComplaints) =>
                            prevComplaints.map(
                                (complaint) =>
                                    complaint._id === id
                                        ? {
                                            ...complaint,
                                            status: status
                                        }
                                        : complaint
                            )
                    );

                    fetchData();

                    alert(
                        "Complaint status updated"
                    );

                } else {

                    alert(data.message);

                }

            } catch (error) {

                console.log(
                    "Update complaint error:",
                    error
                );

                alert(
                    "Something went wrong"
                );

            }

        };


    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("role");

        window.location.href = "/";

    };


    // ======================================================
    // UI
    // ======================================================

    return (

        <div className="admin-page">


            {/* HEADER */}

            <header className="admin-header">

                <div className="brand">

                    <h1>
                        HostelHub
                    </h1>

                    <p>
                        Admin Dashboard
                    </p>

                </div>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </header>


            <main className="admin-content">


                {/* ======================================================
                    STATS
                ====================================================== */}

                <section className="dashboard-section">

                    <div className="section-heading">

                        <h2>
                            Dashboard Overview
                        </h2>

                        <p>
                            Manage your hostel from one place
                        </p>

                    </div>


                    {stats && (

                        <div className="stats-grid">


                            <div className="stat-card">

                                <div className="stat-icon">
                                    👨‍🎓
                                </div>

                                <div>

                                    <p>
                                        Total Students
                                    </p>

                                    <h3>
                                        {stats.totalStudents}
                                    </h3>

                                </div>

                            </div>


                            <div className="stat-card">

                                <div className="stat-icon">
                                    🏠
                                </div>

                                <div>

                                    <p>
                                        Total Rooms
                                    </p>

                                    <h3>
                                        {stats.totalRooms}
                                    </h3>

                                </div>

                            </div>


                            <div className="stat-card">

                                <div className="stat-icon">
                                    🛏️
                                </div>

                                <div>

                                    <p>
                                        Available Beds
                                    </p>

                                    <h3>
                                        {stats.availableBeds}
                                    </h3>

                                </div>

                            </div>


                            <div className="stat-card">

                                <div className="stat-icon">
                                    📋
                                </div>

                                <div>

                                    <p>
                                        Total Complaints
                                    </p>

                                    <h3>
                                        {stats.totalComplaints}
                                    </h3>

                                </div>

                            </div>


                            <div className="stat-card">

                                <div className="stat-icon">
                                    ⏳
                                </div>

                                <div>

                                    <p>
                                        Pending
                                    </p>

                                    <h3>
                                        {stats.pendingComplaints}
                                    </h3>

                                </div>

                            </div>


                            <div className="stat-card">

                                <div className="stat-icon">
                                    ✅
                                </div>

                                <div>

                                    <p>
                                        Resolved
                                    </p>

                                    <h3>
                                        {stats.resolvedComplaints}
                                    </h3>

                                </div>

                            </div>

                        </div>

                    )}

                </section>


                {/* ======================================================
                    ADD ROOM
                ====================================================== */}

                <section className="dashboard-section">

                    <div className="section-heading">

                        <h2>
                            Add New Room
                        </h2>

                        <p>
                            Create a new room for students
                        </p>

                    </div>


                    <form
                        className="add-room-form"
                        onSubmit={addRoom}
                    >

                        <input
                            type="text"
                            placeholder="Room Number"
                            value={roomNumber}
                            onChange={(e) =>
                                setRoomNumber(
                                    e.target.value
                                )
                            }
                        />

                        <input
                            type="number"
                            placeholder="Capacity"
                            value={capacity}
                            onChange={(e) =>
                                setCapacity(
                                    e.target.value
                                )
                            }
                        />

                        <button
                            className="primary-btn"
                            type="submit"
                        >
                            + Add Room
                        </button>

                    </form>

                </section>


                {/* ======================================================
                    ROOMS
                ====================================================== */}

                <section className="dashboard-section">

                    <div className="section-heading">

                        <h2>
                            All Rooms
                        </h2>

                        <p>
                            Manage rooms and bed availability
                        </p>

                    </div>


                    {rooms.length === 0 ? (

                        <div className="empty-state">
                            No rooms found.
                        </div>

                    ) : (

                        <div className="cards-grid">

                            {rooms.map((room) => (

                                <div
                                    className="room-card"
                                    key={room._id}
                                >

                                    <div className="card-header">

                                        <div>

                                            <span className="small-label">
                                                ROOM
                                            </span>

                                            <h3>
                                                {room.roomNumber}
                                            </h3>

                                        </div>


                                        <span
                                            className={
                                                room.availableBeds > 0
                                                    ? "badge available"
                                                    : "badge full"
                                            }
                                        >
                                            {room.availableBeds > 0
                                                ? "Available"
                                                : "Full"}
                                        </span>

                                    </div>


                                    <div className="room-details">

                                        <div>

                                            <span>
                                                Capacity
                                            </span>

                                            <strong>
                                                {room.capacity}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Occupied
                                            </span>

                                            <strong>
                                                {room.occupiedBeds}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Available
                                            </span>

                                            <strong>
                                                {room.availableBeds}
                                            </strong>

                                        </div>

                                    </div>


                                    {editingRoomId === room._id ? (

                                        <div className="edit-box">

                                            <input
                                                type="number"
                                                value={editCapacity}
                                                onChange={(e) =>
                                                    setEditCapacity(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="New Capacity"
                                            />


                                            <div className="button-row">

                                                <button
                                                    className="save-btn"
                                                    onClick={() =>
                                                        updateRoom(
                                                            room
                                                        )
                                                    }
                                                >
                                                    Save
                                                </button>


                                                <button
                                                    className="cancel-btn"
                                                    onClick={() => {

                                                        setEditingRoomId(
                                                            null
                                                        );

                                                        setEditCapacity(
                                                            ""
                                                        );

                                                    }}
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>

                                    ) : (

                                        <div className="button-row">

                                            <button
                                                className="edit-btn"
                                                onClick={() => {

                                                    setEditingRoomId(
                                                        room._id
                                                    );

                                                    setEditCapacity(
                                                        room.capacity
                                                    );

                                                }}
                                            >
                                                Edit Room
                                            </button>


                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteRoom(
                                                        room
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* ======================================================
                    STUDENTS
                ====================================================== */}

                <section className="dashboard-section">

                    <div className="section-heading">

                        <h2>
                            All Students
                        </h2>

                        <p>
                            Manage registered hostel students
                        </p>

                    </div>


                    {students.length === 0 ? (

                        <div className="empty-state">
                            No students found.
                        </div>

                    ) : (

                        <div className="cards-grid">

                            {students.map((student) => (

                                <div
                                    className="student-card"
                                    key={student._id}
                                >

                                    <div className="student-header">

                                        <div className="student-avatar">

                                            {student.name
                                                .charAt(0)
                                                .toUpperCase()}

                                        </div>


                                        <div>

                                            <h3>
                                                {student.name}
                                            </h3>

                                            <p>
                                                {student.email}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="student-details">

                                        <div>

                                            <span>
                                                Phone
                                            </span>

                                            <strong>
                                                {student.phone}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Room
                                            </span>

                                            <strong>
                                                {student.roomNumber}
                                            </strong>

                                        </div>

                                    </div>


                                    {editingStudentId === student._id ? (

                                        <div className="edit-box">

                                            <input
                                                type="text"
                                                value={editPhone}
                                                onChange={(e) =>
                                                    setEditPhone(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="New Phone"
                                            />


                                            <input
                                                type="text"
                                                value={editRoomNumber}
                                                onChange={(e) =>
                                                    setEditRoomNumber(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="New Room Number"
                                            />


                                            <div className="button-row">

                                                <button
                                                    className="save-btn"
                                                    onClick={() =>
                                                        updateStudent(
                                                            student._id
                                                        )
                                                    }
                                                >
                                                    Save
                                                </button>


                                                <button
                                                    className="cancel-btn"
                                                    onClick={() => {

                                                        setEditingStudentId(
                                                            null
                                                        );

                                                        setEditPhone(
                                                            ""
                                                        );

                                                        setEditRoomNumber(
                                                            ""
                                                        );

                                                    }}
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>

                                    ) : (

                                        <div className="button-row">

                                            <button
                                                className="edit-btn"
                                                onClick={() => {

                                                    setEditingStudentId(
                                                        student._id
                                                    );

                                                    setEditPhone(
                                                        student.phone
                                                    );

                                                    setEditRoomNumber(
                                                        student.roomNumber
                                                    );

                                                }}
                                            >
                                                Edit Student
                                            </button>


                                            <button
                                                className="delete-btn"
                                                onClick={() =>
                                                    deleteStudent(
                                                        student._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    )}

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* ======================================================
                    COMPLAINTS
                ====================================================== */}

                <section className="dashboard-section">

                    <div className="section-heading">

                        <h2>
                            All Complaints
                        </h2>

                        <p>
                            Track and manage student complaints
                        </p>

                    </div>


                    {complaints.length === 0 ? (

                        <div className="empty-state">
                            No complaints found.
                        </div>

                    ) : (

                        <div className="cards-grid">

                            {complaints.map((complaint) => (

                                <div
                                    className="complaint-card"
                                    key={complaint._id}
                                >

                                    <div className="complaint-header">

                                        <div>

                                            <span className="small-label">
                                                COMPLAINT
                                            </span>

                                            <h3>
                                                {complaint.problem}
                                            </h3>

                                        </div>


                                        <span
                                            className={
                                                complaint.status ===
                                                    "Resolved"
                                                    ? "badge resolved"
                                                    : complaint.status ===
                                                        "In Progress"
                                                        ? "badge progress"
                                                        : "badge pending"
                                            }
                                        >
                                            {complaint.status}
                                        </span>

                                    </div>


                                    <div className="complaint-details">

                                        <div>

                                            <span>
                                                Student
                                            </span>

                                            <strong>
                                                {complaint.studentName}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Room
                                            </span>

                                            <strong>
                                                {complaint.roomNumber}
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="button-row">

                                        <button
                                            className="progress-btn"
                                            onClick={() =>
                                                updateComplaintStatus(
                                                    complaint._id,
                                                    "In Progress"
                                                )
                                            }
                                        >
                                            In Progress
                                        </button>


                                        <button
                                            className="resolve-btn"
                                            onClick={() =>
                                                updateComplaintStatus(
                                                    complaint._id,
                                                    "Resolved"
                                                )
                                            }
                                        >
                                            Resolved
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>

    );

}

export default AdminDashboard;
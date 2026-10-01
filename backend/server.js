const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const authMiddleware = require("./middleware/authMiddleware");
const roleMiddleware = require("./middleware/roleMiddleware");

const cors = require("cors");

const Complaint = require("./models/Complaint");
const Student = require("./models/Student");
const Room = require("./models/Room");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const roomRoutes = require("./routes/roomRoutes");
const complaintRoutes = require("./routes/complaintRoutes");


const app = express();

app.use(cors());
app.use(express.json());


// ======================================================
// ROUTES
// ======================================================

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/complaints", complaintRoutes);


// ======================================================
// MONGODB CONNECTION
// ======================================================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log(
            "MongoDB connection failed:",
            error
        );
    });


// ======================================================
// BASIC ROUTES
// ======================================================

app.get("/", (req, res) => {
    res.send("Welcome to HostelHub");
});


app.get("/about", (req, res) => {
    res.send(
        "HostelHub - Hostel Management System"
    );
});


// ======================================================
// DASHBOARD TEST APIs
// ======================================================

app.get(
    "/api/student-dashboard",
    authMiddleware,
    roleMiddleware(["Student"]),
    (req, res) => {

        res.json({
            message: "Welcome to Student Dashboard",
            user: req.user
        });

    }
);


app.get(
    "/api/admin-dashboard",
    authMiddleware,
    roleMiddleware(["Admin"]),
    (req, res) => {

        res.json({
            message: "Welcome to Admin Dashboard",
            user: req.user
        });

    }
);


// ======================================================
// ADMIN STATS
// ======================================================

app.get(
    "/api/admin/stats",
    authMiddleware,
    roleMiddleware(["Admin"]),
    async (req, res) => {

        try {

            const totalStudents =
                await Student.countDocuments();

            const totalRooms =
                await Room.countDocuments();

            const rooms =
                await Room.find();

            let availableBeds = 0;

            rooms.forEach((room) => {
                availableBeds += room.availableBeds;
            });

            const totalComplaints =
                await Complaint.countDocuments();

            const pendingComplaints =
                await Complaint.countDocuments({
                    status: "Pending"
                });

            const resolvedComplaints =
                await Complaint.countDocuments({
                    status: "Resolved"
                });

            res.json({
                totalStudents,
                totalRooms,
                availableBeds,
                totalComplaints,
                pendingComplaints,
                resolvedComplaints
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch admin stats",
                error: error.message
            });

        }

    }
);


// ======================================================
// SERVER
// ======================================================

// app.listen(5000, () => {
//     console.log(
//         "Server is running on port 5000"
//     );
// });
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(
        `Server is running on port ${PORT}`
    );
});
const express = require("express");

const Complaint = require("../models/Complaint");
const Student = require("../models/Student");
const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ========================================
// STUDENT - CREATE COMPLAINT
// ========================================

router.post(
    "/",
    authMiddleware,
    roleMiddleware(["Student"]),
    async (req, res) => {

        try {

            // Find logged-in user
            const user = await User.findById(
                req.user.userId
            );

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            // Find student profile using user's email
            const student = await Student.findOne({
                email: user.email
            });

            if (!student) {
                return res.status(404).json({
                    message: "Student profile not found"
                });
            }

            const complaint = await Complaint.create({
                student: student._id,
                studentName: student.name,
                roomNumber: student.roomNumber,
                problem: req.body.problem
            });

            res.status(201).json({
                message: "Complaint saved successfully",
                complaint: complaint
            });

        } catch (error) {

            res.status(400).json({
                message: "Failed to save complaint",
                error: error.message
            });

        }

    }
);


// ========================================
// ADMIN - GET ALL COMPLAINTS
// ========================================

router.get(
    "/admin",
    authMiddleware,
    roleMiddleware(["Admin"]),
    async (req, res) => {

        try {

            const complaints = await Complaint.find()
                .populate("student");

            res.json(complaints);

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch complaints",
                error: error.message
            });

        }

    }
);


// ========================================
// STUDENT - GET MY COMPLAINTS
// ========================================

router.get(
    "/my",
    authMiddleware,
    roleMiddleware(["Student"]),
    async (req, res) => {

        try {

            // Find logged-in user
            const user = await User.findById(
                req.user.userId
            );

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            // Find student profile
            const student = await Student.findOne({
                email: user.email
            });

            if (!student) {
                return res.status(404).json({
                    message: "Student profile not found"
                });
            }

            const complaints = await Complaint.find({
                student: student._id
            });

            res.json(complaints);

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch complaints",
                error: error.message
            });

        }

    }
);


// ========================================
// ADMIN - UPDATE COMPLAINT STATUS
// ========================================

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["Admin"]),
    async (req, res) => {

        try {

            const complaint = await Complaint.findById(
                req.params.id
            );

            if (!complaint) {
                return res.status(404).json({
                    message: "Complaint not found"
                });
            }

            complaint.status = req.body.status;

            await complaint.save();

            res.json({
                message: "Complaint status updated successfully",
                complaint: complaint
            });

        } catch (error) {

            res.status(400).json({
                message: "Failed to update complaint",
                error: error.message
            });

        }

    }
);


// ========================================
// ADMIN - DELETE COMPLAINT
// ========================================

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["Admin"]),
    async (req, res) => {

        try {

            const complaint =
                await Complaint.findByIdAndDelete(
                    req.params.id
                );

            if (!complaint) {
                return res.status(404).json({
                    message: "Complaint not found"
                });
            }

            res.json({
                message: "Complaint deleted successfully"
            });

        } catch (error) {

            res.status(500).json({
                message: "Failed to delete complaint",
                error: error.message
            });

        }

    }
);


module.exports = router;
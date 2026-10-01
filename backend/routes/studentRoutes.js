const express = require("express");

const Student = require("../models/Student");
const User = require("../models/User");
const Room = require("../models/Room");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ========================================
// CREATE STUDENT
// ========================================

router.post(
    "/",
    authMiddleware,
    roleMiddleware(["Admin"]),
    async (req, res) => {

        try {

            const student = await Student.create(req.body);

            res.status(201).json({
                message: "Student created successfully",
                student: student
            });

        } catch (error) {

            res.status(400).json({
                message: "Failed to create student",
                error: error.message
            });

        }

    }
);


// ========================================
// GET ALL STUDENTS
// ========================================

router.get(
    "/",
    authMiddleware,
    roleMiddleware(["Admin"]),
    async (req, res) => {

        try {

            const students = await Student.find();

            res.json(students);

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch students",
                error: error.message
            });

        }

    }
);


// ========================================
// GET OWN PROFILE
// ========================================

router.get(
    "/me",
    authMiddleware,
    roleMiddleware(["Student"]),
    async (req, res) => {

        try {

            const user = await User.findById(
                req.user.userId
            );

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const student = await Student.findOne({
                email: user.email
            });

            if (!student) {
                return res.status(404).json({
                    message: "Student profile not found"
                });
            }

            res.json(student);

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch student profile",
                error: error.message
            });

        }

    }
);


// ========================================
// ADMIN - UPDATE STUDENT
// ========================================

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["Admin"]),
    async (req, res) => {

        try {

            const student = await Student.findById(
                req.params.id
            );

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            const oldRoomNumber = student.roomNumber;
            const newRoomNumber = req.body.roomNumber;


            // ========================================
            // ROOM IS NOT CHANGING
            // ========================================

            if (
                !newRoomNumber ||
                newRoomNumber === oldRoomNumber
            ) {

                const updatedStudent =
                    await Student.findByIdAndUpdate(
                        req.params.id,
                        req.body,
                        {
                            new: true,
                            runValidators: true
                        }
                    );

                return res.json({
                    message: "Student updated successfully",
                    student: updatedStudent
                });

            }


            // ========================================
            // FIND NEW ROOM
            // ========================================

            const newRoom = await Room.findOne({
                roomNumber: newRoomNumber
            });

            if (!newRoom) {
                return res.status(404).json({
                    message: "New room not found"
                });
            }


            // ========================================
            // CHECK AVAILABLE BED
            // ========================================

            if (newRoom.availableBeds <= 0) {
                return res.status(400).json({
                    message: "No available bed in new room"
                });
            }


            // ========================================
            // FIND OLD ROOM
            // ========================================

            const oldRoom = await Room.findOne({
                roomNumber: oldRoomNumber
            });


            // ========================================
            // UPDATE STUDENT ROOM
            // ========================================

            student.roomNumber = newRoomNumber;

            await student.save();


            // ========================================
            // FREE BED IN OLD ROOM
            // ========================================

            if (oldRoom) {

                oldRoom.occupiedBeds -= 1;
                oldRoom.availableBeds += 1;

                await oldRoom.save();

            }


            // ========================================
            // OCCUPY BED IN NEW ROOM
            // ========================================

            newRoom.occupiedBeds += 1;
            newRoom.availableBeds -= 1;

            await newRoom.save();


            res.json({
                message: "Student room changed successfully",
                student: student
            });

        } catch (error) {

            res.status(400).json({
                message: "Failed to update student",
                error: error.message
            });

        }

    }
);


// ========================================
// STUDENT - UPDATE OWN PROFILE
// ========================================

router.put(
    "/me",
    authMiddleware,
    roleMiddleware(["Student"]),
    async (req, res) => {

        try {

            const user = await User.findById(
                req.user.userId
            );

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const student = await Student.findOne({
                email: user.email
            });

            if (!student) {
                return res.status(404).json({
                    message: "Student profile not found"
                });
            }

            const { phone } = req.body;

            student.phone = phone;

            await student.save();

            res.json({
                message: "Profile updated successfully",
                student: student
            });

        } catch (error) {

            res.status(400).json({
                message: "Failed to update profile",
                error: error.message
            });

        }

    }
);


// ========================================
// ADMIN - DELETE STUDENT
// ========================================

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["Admin"]),
    async (req, res) => {

        try {

            const student = await Student.findById(
                req.params.id
            );

            if (!student) {
                return res.status(404).json({
                    message: "Student not found"
                });
            }

            const room = await Room.findOne({
                roomNumber: student.roomNumber
            });


            // ========================================
            // DELETE STUDENT
            // ========================================

            await Student.findByIdAndDelete(
                req.params.id
            );


            // ========================================
            // FREE ROOM BED
            // ========================================

            if (room) {

                room.occupiedBeds -= 1;
                room.availableBeds += 1;

                await room.save();

            }


            res.json({
                message: "Student deleted successfully",
                student: student
            });

        } catch (error) {

            res.status(400).json({
                message: "Failed to delete student",
                error: error.message
            });

        }

    }
);


module.exports = router;
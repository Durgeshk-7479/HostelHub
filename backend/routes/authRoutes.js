const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Student = require("../models/Student");
const Room = require("../models/Room");

const router = express.Router();


// ========================================
// Student Registration
// ========================================

router.post("/register", async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone,
            roomNumber
        } = req.body;


        // Check existing user
        const existingUser = await User.findOne({
            email
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }


        // Check room
        const room = await Room.findOne({
            roomNumber
        });

        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }


        // Check available bed
        if (room.availableBeds <= 0) {
            return res.status(400).json({
                message: "No available bed in this room"
            });
        }


        // Hash password
        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Create user
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: "Student"
        });


        // Create student profile
        const student = await Student.create({
            name,
            email,
            phone,
            roomNumber
        });


        // Update room
        room.occupiedBeds += 1;
        room.availableBeds -= 1;

        await room.save();


        res.status(201).json({
            message: "Student registered successfully",
            student: student
        });

    } catch (error) {

        res.status(400).json({
            message: "Registration failed",
            error: error.message
        });

    }

});


// ========================================
// Login
// ========================================

router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        // Find user
        const user = await User.findOne({
            email
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }


        // Check password
        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }


        // Generate JWT
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );


        res.json({
            message: "Login successful",
            token: token,
            role: user.role
        });

    } catch (error) {

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });

    }

});


module.exports = router;
const express = require("express");

const Room = require("../models/Room");
const Student = require("../models/Student");

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ========================================
// CREATE ROOM
// ========================================

router.post(
    "/",
    authMiddleware,
    roleMiddleware(["Admin"]),
    async (req, res) => {

        try {

            const {
                roomNumber,
                capacity,
                occupiedBeds = 0
            } = req.body;

            const existingRoom = await Room.findOne({
                roomNumber
            });

            if (existingRoom) {
                return res.status(400).json({
                    message: "Room already exists"
                });
            }

            const availableBeds =
                capacity - occupiedBeds;

            if (availableBeds < 0) {
                return res.status(400).json({
                    message: "Occupied beds cannot exceed capacity"
                });
            }

            const room = await Room.create({
                roomNumber,
                capacity,
                occupiedBeds,
                availableBeds
            });

            res.status(201).json({
                message: "Room created successfully",
                room: room
            });

        } catch (error) {

            res.status(400).json({
                message: "Failed to create room",
                error: error.message
            });

        }

    }
);


// ========================================
// GET ALL ROOMS
// ========================================

router.get(
    "/",
    async (req, res) => {

        try {

            const rooms = await Room.find();

            res.json(rooms);

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch rooms",
                error: error.message
            });

        }

    }
);


// ========================================
// GET ROOM BY ROOM NUMBER
// ========================================

router.get(
    "/:roomNumber",
    async (req, res) => {

        try {

            const room = await Room.findOne({
                roomNumber: req.params.roomNumber
            });

            if (!room) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }

            res.json(room);

        } catch (error) {

            res.status(500).json({
                message: "Failed to fetch room",
                error: error.message
            });

        }

    }
);


// ========================================
// UPDATE ROOM
// ========================================

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(["Admin"]),
    async (req, res) => {

        try {

            const room = await Room.findById(
                req.params.id
            );

            if (!room) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }

            const newCapacity = Number(
                req.body.capacity
            );

            if (newCapacity < room.occupiedBeds) {
                return res.status(400).json({
                    message:
                        "Capacity cannot be less than occupied beds"
                });
            }

            room.capacity = newCapacity;

            room.availableBeds =
                newCapacity - room.occupiedBeds;

            await room.save();

            res.json({
                message: "Room updated successfully",
                room: room
            });

        } catch (error) {

            res.status(400).json({
                message: "Failed to update room",
                error: error.message
            });

        }

    }
);


// ========================================
// DELETE ROOM
// ========================================

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware(["Admin"]),
    async (req, res) => {

        try {

            const room = await Room.findById(
                req.params.id
            );

            if (!room) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }

            if (room.occupiedBeds > 0) {
                return res.status(400).json({
                    message:
                        "Cannot delete room with occupied beds"
                });
            }

            const students = await Student.countDocuments({
                roomNumber: room.roomNumber
            });

            if (students > 0) {
                return res.status(400).json({
                    message:
                        "Cannot delete room assigned to students"
                });
            }

            await Room.findByIdAndDelete(
                req.params.id
            );

            res.json({
                message: "Room deleted successfully"
            });

        } catch (error) {

            res.status(400).json({
                message: "Failed to delete room",
                error: error.message
            });

        }

    }
);


module.exports = router;
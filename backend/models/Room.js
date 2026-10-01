const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true
    },

    capacity: {
        type: Number,
        required: true
    },

    occupiedBeds: {
        type: Number,
        default: 0
    },

    availableBeds: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("Room", roomSchema);
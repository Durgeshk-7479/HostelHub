const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    studentName: {
        type: String,
        required: true
    },

    roomNumber: {
        type: String,
        required: true
    },

    problem: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Pending", "In Progress", "Resolved"],
        default: "Pending"
    }
});

module.exports = mongoose.model("Complaint", complaintSchema);
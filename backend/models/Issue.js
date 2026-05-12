const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  category: {
    type: String
  },

  location: {
    type: String
  },

  photo: {
    type: String
  },

  assignedTo: {
    type: String
  },

  status: {
    type: String,
    enum: ["Pending", "In Progress", "Resolved"],
    default: "Pending"
  },

  closedAt: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model("Issue", issueSchema);

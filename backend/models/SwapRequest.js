const mongoose = require("mongoose");

const swapRequestSchema = new mongoose.Schema(
  {
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    itemTitle: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    requesterId: {
      type: String,
      required: true,
    },

    requesterName: {
      type: String,
      required: true,
    },

    ownerId: {
      type: String,
      required: true,
    },

    ownerName: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("SwapRequest", swapRequestSchema);
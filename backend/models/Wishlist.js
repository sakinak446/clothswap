const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index(
  { userId: 1, itemId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
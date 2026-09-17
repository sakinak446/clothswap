const dns = require("dns");

dns.setServers([
  "8.8.8.8",
  "1.1.1.1"
]);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const { v2: cloudinary } = require("cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const upload = multer({
  storage: multer.memoryStorage(),
});

const Item = require("./models/items");
const SwapRequest = require("./models/SwapRequest");
const Wishlist = require("./models/Wishlist");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// JWT authentication middleware
function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Access denied. Please login first."
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Access denied. Token missing."
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token."
    });
  }
}

// Register a new user
app.post("/api/register", async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long"
      });
    }
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });

  } catch (error) {
    console.error("Registration error:", error);

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });
  }
});

// Login user
app.post("/api/login", async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Login failed",
      error: error.message
    });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });
  
app.post("/api/upload-image", verifyToken, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image file provided",
      });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "clothswap",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      stream.end(req.file.buffer);
    });

    res.status(200).json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    res.status(500).json({
      message: "Image upload failed",
      error: error.message,
    });
  }
});
app.get("/api/items", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).json({ message: "Failed to fetch items" });
    }
});
app.post("/api/items", verifyToken, async (req, res) => {
    try {
        const newItem = new Item({
            ...req.body,
            ownerId: req.user.id,
            ownerName: req.user.name,
        });
        const savedItem = await newItem.save();

        res.status(201).json(savedItem);
    } catch (error) {
        console.error("Error adding item:", error);
        res.status(500).json({
            message: "Failed to add item",
            error: error.message
        });
    }
});
// Update an item
app.put("/api/items/:id", verifyToken, async (req, res) => {
    try {
        // Check if the item ID is valid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          return res.status(400).json({
            message: "Invalid item ID"
          });
        }

        // First find the item
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        // Check if the logged-in user owns this item
        if (String(item.ownerId) !== String(req.user.id)) {
            return res.status(403).json({
                message: "You are not allowed to edit this item"
            });
        }

        // Update only editable item fields
        const { title, category, size, condition, brand, description, image } = req.body;

        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id,
            {
                title,
                category,
                size,
                condition,
                brand,
                description,
                image,
            },
            { new: true, runValidators: true }
        );

        res.json(updatedItem);

    } catch (error) {
        console.error("Error updating item:", error);

        res.status(500).json({
            message: "Failed to update item",
            error: error.message
        });
    }
});
// Delete an item
app.delete("/api/items/:id", verifyToken, async (req, res) => {
    try {
        // Check if the item ID is valid
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                message: "Invalid item ID"
            });
        }

        // Find the item first
        const item = await Item.findById(req.params.id);

        if (!item) {
            return res.status(404).json({
                message: "Item not found"
            });
        }

        // Check if the logged-in user owns this item
        if (String(item.ownerId) !== String(req.user.id)) {
            return res.status(403).json({
                message: "You are not allowed to delete this item"
            });
        }

        // Delete the item
        await Item.findByIdAndDelete(req.params.id);

        res.json({
            message: "Item deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting item:", error);

        res.status(500).json({
            message: "Failed to delete item",
            error: error.message
        });
    }
});
// Create a swap request
app.post("/api/swap-requests", verifyToken, async (req, res) => {
  try {
    const { itemId, message } = req.body;

    // Check required fields
    if (!itemId || !message) {
      return res.status(400).json({
        message: "Item ID and message are required",
      });
    }

    // Check if the item ID is valid
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        message: "Invalid item ID",
      });
    }

    // Find the item in MongoDB
    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }
    if (String(item.ownerId) === String(req.user.id)) {
      return res.status(403).json({
        message: "You cannot request a swap for your own item",
      });
    }
    const existingRequest = await SwapRequest.findOne({
      itemId: itemId,
      requesterId: req.user.id,
      status: "Pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already have a pending swap request for this item",
      });
    }

    // Create the swap request
    const newRequest = new SwapRequest({
      itemId,
      itemTitle: item.title,
      message,

      // Requester comes from the JWT
      requesterId: req.user.id,
      requesterName: req.user.name,

      // Owner comes from the actual item in MongoDB
      ownerId: item.ownerId,
      ownerName: item.ownerName,
    });

    const savedRequest = await newRequest.save();

    res.status(201).json(savedRequest);

  } catch (error) {
    console.error("Error creating swap request:", error);

    res.status(500).json({
      message: "Failed to create swap request",
      error: error.message,
    });
  }
});
app.get("/api/swap-requests", verifyToken, async (req, res) => {
  try {
    const requests = await SwapRequest.find({
      $or: [
        { requesterId: req.user.id },
        { ownerId: req.user.id }
      ]
    }).sort({ createdAt: -1 });

    res.json(requests);

  } catch (error) {
    console.error("Error fetching swap requests:", error);

    res.status(500).json({
      message: "Failed to fetch swap requests",
      error: error.message,
    });
  }
});
// Update swap request status
app.put("/api/swap-requests/:id", verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    // Check if status is valid
    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    // Check if the swap request ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid swap request ID",
      });
    }

    // Find the swap request
    const request = await SwapRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        message: "Swap request not found",
      });
    }

    // Only the item owner can accept or reject
    if (String(request.ownerId) !== String(req.user.id)) {
      return res.status(403).json({
        message: "You are not allowed to update this swap request",
      });
    }
    if (request.status !== "Pending") {
      return res.status(400).json({
        message: "This swap request has already been decided",
      });
    }

    // Update the status
    request.status = status;

    const updatedRequest = await request.save();

    res.json(updatedRequest);

  } catch (error) {
    console.error("Error updating swap request:", error);

    res.status(500).json({
      message: "Failed to update swap request",
      error: error.message,
    });
  }
});

// Wishlist routes
app.get("/api/wishlist", verifyToken, async (req, res) => {
  try {
    const wishlist = await Wishlist.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(wishlist);
  } catch (error) {
    console.error("Error fetching wishlist:", error);

    res.status(500).json({
      message: "Failed to fetch wishlist",
      error: error.message,
    });
  }
});
app.post("/api/wishlist", verifyToken, async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res.status(400).json({
        message: "Item ID is required",
      });
    }

    // Check if the item ID is valid
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({
        message: "Invalid item ID",
      });
    }

    const item = await Item.findById(itemId);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const existingWishlistItem = await Wishlist.findOne({
      userId: req.user.id,
      itemId: itemId,
    });

    if (existingWishlistItem) {
      return res.status(400).json({
        message: "Item is already in your wishlist",
      });
    }

    const wishlistItem = new Wishlist({
      userId: req.user.id,
      itemId: itemId,
    });

    const savedWishlistItem = await wishlistItem.save();

    res.status(201).json(savedWishlistItem);
  } catch (error) {
    console.error("Error adding item to wishlist:", error);

    res.status(500).json({
      message: "Failed to add item to wishlist",
      error: error.message,
    });
  }
});
app.delete("/api/wishlist/:itemId", verifyToken, async (req, res) => {
  try {
    // Check if the item ID is valid
    if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
      return res.status(400).json({
        message: "Invalid item ID",
      });
    }

    const deletedWishlistItem = await Wishlist.findOneAndDelete({
      userId: req.user.id,
      itemId: req.params.itemId,
    });

    if (!deletedWishlistItem) {
      return res.status(404).json({
        message: "Wishlist item not found",
      });
    }

    res.json({
      message: "Item removed from wishlist",
    });
  } catch (error) {
    console.error("Error removing item from wishlist:", error);

    res.status(500).json({
      message: "Failed to remove item from wishlist",
      error: error.message,
    });
  }
});
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
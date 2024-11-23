const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();
require("dotenv").config();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);  // Ensure this route exists

// Test endpoint
app.get("/", (req, res) => {
    res.send("Chat App Backend is running!");
});

// Start server with MongoDB connection
const port = process.env.PORT || 5000;
const URL = process.env.MONGO_URL;

async function startServer() {
    try {
        await mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully");

        app.listen(port, () => {
            console.log(`Server running on port: ${port}`);
        });
    } catch (err) {
        console.error("MongoDB connection error", err);
    }
}

startServer();

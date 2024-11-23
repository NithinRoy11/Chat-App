const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const createToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtKey, { expiresIn: "3d" });
};

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("Data received in backend:", req.body); // Log incoming data

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: "Password must be strong" });
        }

        // Check if user already exists
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User with this email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save the new user
        user = new userModel({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        // Create token
        const token = createToken(user._id);
        res.status(200).json({ 
            _id: user._id, 
            name: user.name, 
            email: user.email, 
            token 
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await userModel.findOne({ email });

        if (!user) return res.status(400).json({ error: "Invalid email or password" });

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) return res.status(400).json({ error: "Invalid email or password" });

        const token = createToken(user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email,
            token,
        });
    } catch (error) {
        console.error("Error during user login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await userModel.findById(userId);

        res.status(200).json(user);
    } catch (error) {
        console.error("Error finding user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await userModel.find();

        res.status(200).json(users);
    } catch (error) {
        console.error("Error getting users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { registerUser, loginUser, findUser, getUsers };

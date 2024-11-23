const chatModel = require("../Models/chatModel");

const createChat = async (req, res) => {
    const { firstId, secondId } = req.body;

    try {
        // Check if the chat already exists between the two users
        const chat = await chatModel.findOne({
            members: { $all: [firstId, secondId] },
        });

        if (chat) {
            return res.status(200).json(chat); // If chat exists, return it
        }

        // Create a new chat if it doesn't exist
        const newChat = new chatModel({
            members: [firstId, secondId],
        });

        const response = await newChat.save();
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating chat", error });
    }
};

const findUserChat = async (req, res) => {
    const userId = req.params.userId; // Fixed to req.params

    try {
        // Find chats that include the userId
        const chats = await chatModel.find({
            members: { $in: [userId] },
        });

        res.status(200).json(chats); // Return the found chats
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching chats", error });
    }
};

const findChat = async (req, res) => {
    const { firstId, secondId } = req.params; // Fixed to req.params

    try {
        // Find a chat between firstId and secondId
        const chat = await chatModel.find({
            members: { $all: [firstId, secondId] },
        });

        res.status(200).json(chat); // Return the found chat
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching chat", error });
    }
};

module.exports = { createChat, findChat, findUserChat };

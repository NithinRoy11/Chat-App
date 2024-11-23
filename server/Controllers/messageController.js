const messageModel = require("../Models/messageModel");

const createMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;

    const message = new messageModel({
        chatId,
        senderId,
        text,
    });

    try {
        const response = await message.save();
        res.status(200).json(response); // Successfully saved the message
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating message", error });
    }
};

const getMessages = async (req, res) => {
    const { chatId } = req.params; // Corrected the destructuring to use req.params

    try {
        // Query for messages in a specific chat by chatId
        const messages = await messageModel.find({ chatId });
        res.status(200).json(messages); // Return the found messages
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching messages", error });
    }
};

module.exports = { createMessage, getMessages };

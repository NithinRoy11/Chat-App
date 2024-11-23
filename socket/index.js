const { Server } = require("socket.io");

const io = new Server({ cors: { origin: "http://localhost:3001" } });

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    // Add new user
    socket.on("addNewUser", (userId) => {
        // Check if the user is already online
        const userExists = onlineUsers.some(user => user.userId === userId);
        
        // If the user doesn't exist, add them to the onlineUsers array
        if (!userExists) {
            onlineUsers.push({
                userId,
                socketId: socket.id
            });
            io.emit("getOnlineUsers", onlineUsers); // Emit the updated list of online users
        }
    });

    // Send a message to the recipient if they're online
    socket.on("sendMessage", (message) => {
        const user = onlineUsers.find(user => user.userId === message.recipientId);

        if (user) {
            io.to(user.socketId).emit("getMessage", message);
            io.to(user.socketId).emit("getNotification", {
                senderId: message.senderId,
                isRead: false,
                date: new Date(),
            });
        }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers); // Emit the updated list of online users after someone disconnects
    });
});

// Listen on port 3000
io.listen(3000);

const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const PORT = process.env.SOCKET_PORT || 4000;
const ORIGINS = (process.env.WEB_ORIGIN || "http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((s) => s.trim());

const app = express();
app.use(cors({ origin: ORIGINS }));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
	path: "/socket.io",
	cors: {
		origin: ORIGINS,
		methods: ["GET", "POST"],
	},
});

// Store connected users: socketId -> userName
const connectedUsers = new Map();
const DELIVERED_DELAY_MS = Number(1200);

io.on("connection", (socket) => {
	console.log("🟢 Client connected", socket.id);

	// Handle user setting their name
socket.on("setName", (name) => {
    const existing = connectedUsers.get(socket.id);
    if (existing && existing !== name) {
        // Treat as change if a name already exists
        connectedUsers.set(socket.id, name);
        io.emit("nameChanged", { oldName: existing, newName: name, timestamp: Date.now() });
        console.log(`✏️  ${existing} is now ${name}`);
        return;
    }
    connectedUsers.set(socket.id, name);
    console.log(`👤 User ${name} joined the chat`);
    io.emit("userJoined", {
        name: name,
        timestamp: Date.now()
    });
});

	// Handle messages
	socket.on("message", (data, ack) => {
		const userName = connectedUsers.get(socket.id);
		if (!userName) {
			console.log("❌ Message from user without name");
			if (ack) ack({ status: 'error', receivedAt: Date.now() });
			return;
		}

		const messageData = {
			id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
			name: userName,
			message: data.message,
			timestamp: data.timestamp,
			type: 'message'
		};

    console.log(`💬 ${userName}: ${data.message}`);
    io.emit("message", messageData);
    if (ack) ack({ status: 'received', receivedAt: Date.now(), messageId: messageData.id });

    setTimeout(() => {
      socket.emit("delivered", { messageId: messageData.id });
    }, DELIVERED_DELAY_MS);
	});

	// Handle name change
	socket.on("changeName", (newName) => {
		const oldName = connectedUsers.get(socket.id);
		if (!oldName) {
			// If no previous name, treat as initial set
			connectedUsers.set(socket.id, newName);
			socket.broadcast.emit("userJoined", {
				name: newName,
				timestamp: Date.now()
			});
			return;
		}

		connectedUsers.set(socket.id, newName);
		io.emit("nameChanged", {
			oldName,
			newName,
			timestamp: Date.now(),
		});
		console.log(`✏️  ${oldName} is now ${newName}`);
	});

	socket.on("disconnect", () => {
		const userName = connectedUsers.get(socket.id);
		if (userName) {
			console.log(`👋 User ${userName} left the chat`);
			
			// Notify all other users that someone left
			io.emit("userLeft", {
				name: userName,
				timestamp: Date.now()
			});
		}
		
		connectedUsers.delete(socket.id);
		console.log("🔴 Client disconnected", socket.id);
	});
});

app.get("/", (_req, res) => res.send("Socket server is running"));
app.get("/health", (_req, res) => res.send("ok"));

httpServer.listen(PORT, () => {
	console.log(`Socket server listening on ${PORT}, allowing origins: ${ORIGINS.join(", ")}`);
});



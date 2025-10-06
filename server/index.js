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

io.on("connection", (socket) => {
	console.log("🟢 Client connected", socket.id);

	socket.on("message", (msg, ack) => {
		console.log("💬 Message", msg);
		io.emit("message", msg);
		// Notify all except sender that the message was delivered
		socket.broadcast.emit("delivered");
		if (typeof ack === "function") {
			ack({ status: "ok", receivedAt: Date.now() });
		}
	});

	socket.on("disconnect", () => {
		console.log("🔴 Client disconnected", socket.id);
	});
});

app.get("/", (_req, res) => res.send("Socket server is running"));
app.get("/health", (_req, res) => res.send("ok"));

httpServer.listen(PORT, () => {
	console.log(`Socket server listening on ${PORT}, allowing origins: ${ORIGINS.join(", ")}`);
});



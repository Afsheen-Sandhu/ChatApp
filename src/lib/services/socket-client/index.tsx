import { io } from "socket.io-client";

// Connect to standalone Express + Socket.IO server
export const socket = io("http://localhost:4000", {
	path: "/socket.io",
});
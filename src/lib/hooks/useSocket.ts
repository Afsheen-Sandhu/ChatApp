"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type AckResponse = { status: string; receivedAt: number };

export function useSocket(options?: {
	url?: string;
	path?: string;
	connectOnMount?: boolean;
}) {
	const {
		url = "http://localhost:4000",
		path = "/socket.io",
		connectOnMount = true,
	} = options || {};

	const socketRef = useRef<Socket | null>(null);
	const [connected, setConnected] = useState(false);
	const [messages, setMessages] = useState<string[]>([]);
	const [deliveredCount, setDeliveredCount] = useState(0);

	const socket = useMemo(() => {
		if (!socketRef.current) {
			socketRef.current = io(url, { path });
		}
		return socketRef.current;
	}, [url, path]);

	useEffect(() => {
		if (!connectOnMount) return;

		const s = socket;
		s.on("connect", () => setConnected(true));
		s.on("disconnect", () => setConnected(false));
		s.on("message", (msg: string) => setMessages((prev) => [...prev, msg]));
		s.on("delivered", () => setDeliveredCount((c) => c + 1));

		return () => {
			s.off("connect");
			s.off("disconnect");
			s.off("message");
			s.off("delivered");
		};
	}, [socket, connectOnMount]);

	const sendMessage = (text: string, timeoutMs = 5000) => {
		return new Promise<AckResponse>((resolve, reject) => {
			if (!text.trim()) {
				reject(new Error("Empty message"));
				return;
			}
			socket
				.timeout(timeoutMs)
				.emit("message", text, (err: Error | null, res?: AckResponse) => {
					if (err) return reject(err);
					if (!res) return reject(new Error("No ack payload"));
					resolve(res);
				});
		});
	};

	return {
		socket,
		connected,
		messages,
		deliveredCount,
		sendMessage,
	};
}



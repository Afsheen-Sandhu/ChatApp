"use client";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export type AckResponse = { status: string; receivedAt: number; messageId?: string };

export interface ChatMessage {
	id: string;
	name: string;
	message: string;
	timestamp: number;
	type: 'message' | 'join' | 'leave';
}

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

	const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
	const [connected, setConnected] = useState(false);




	useEffect(() => {
		if (!connectOnMount) return;

		const socket = io(url, { path });
		setSocketInstance(socket);

		const onConnect = () => {
			setConnected(true);
		};
		const onDisconnect = () => setConnected(false);

		socket.on("connect", onConnect);
		socket.on("disconnect", onDisconnect);

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
			socket.disconnect();
		};
	}, [connectOnMount, url, path]);

	return {
		socket: socketInstance,
		connected,
		
	};
}



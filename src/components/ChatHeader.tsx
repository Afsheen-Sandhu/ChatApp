"use client";
import React from "react";

type Props = {
	userName: string;
	connected: boolean;
	onChangeName: () => void;
};

export default function ChatHeader({ userName, connected, onChangeName }: Props) {
	return (
		<div className="bg-amber-500 text-white p-4">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">💬 Chat Room</h1>
					<p className="text-amber-100">
						Welcome, <span className="font-semibold">{userName}</span>! 
						Status: {connected ? "🟢 Online" : "🔴 Offline"}
					</p>
				</div>
				<button
					onClick={onChangeName}
					className="bg-amber-700 hover:bg-amber-800 text-white px-3 py-2 rounded-md text-sm font-semibold"
					title="Switch user"
				>
					Change name
				</button>
			</div>
		</div>
	);
}



"use client";
import React from "react";

type Props = {
	input: string;
	onInputChange: (value: string) => void;
	onSend: () => void;
	connected: boolean;
};

export default function MessageInput({ input, onInputChange, onSend, connected }: Props) {
	return (
		<div className="border-t p-4 bg-lime-900 ">
			<div className="flex space-x-2">
				<input
					value={input}
					onChange={(e) => onInputChange(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && input.trim() && connected) onSend();
					}}
					placeholder="Type your message..."
					className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-lime-500"
					disabled={!connected}
				/>
				<button
					onClick={onSend}
					disabled={!input.trim() || !connected}
					className="bg-lime-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-lime-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
				>
					Send
				</button>
			</div>
		</div>
	);
}



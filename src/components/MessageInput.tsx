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
		<div className="border-t p-4 bg-amber-100 ">
			<div className="flex space-x-2">
				<input
					value={input}
					onChange={(e) => onInputChange(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && input.trim() && connected) onSend();
					}}
					placeholder="Type your message..."
					className="flex-1 border border-amber-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-stone-800"
					disabled={!connected}
				/>
				<button
					onClick={onSend}
					disabled={!input.trim() || !connected}
					className="bg-amber-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-amber-600 disabled:bg-amber-200 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors"
				>
					Send
				</button>
			</div>
		</div>
	);
}



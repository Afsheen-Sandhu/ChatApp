"use client";
import React from "react";

type Props = {
	nameInput: string;
	onNameChange: (value: string) => void;
	onSubmit: () => void;
};

function handleKeyDown(e: React.KeyboardEvent, nameInput: string, onSubmit: () => void) {
	if (e.key === 'Enter' && nameInput.trim()) onSubmit();
}

export default function NameModal({ nameInput, onNameChange, onSubmit }: Props) {
	return (
		<div className="fixed inset-0 bg-lime-800 bg-opacity-50 flex items-center justify-center z-50">
			<div className="bg-lime-700 p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
				<h2 className="text-2xl font-bold mb-4 text-center">Join Chat Room</h2>
				<p className="text-lime-100 mb-6 text-center">
					Enter your name to start chatting with others
				</p>
				<div className="space-y-4">
					<input
						value={nameInput}
						onChange={(e) => onNameChange(e.target.value)}
						onKeyDown={(e) => handleKeyDown(e, nameInput, onSubmit)}
						placeholder="Your name..."
						className="w-full border border-lime-800 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
						autoFocus
					/>
					<button
						onClick={onSubmit}
						disabled={!nameInput.trim()}
						className="w-full bg-lime-600 text-lime-100 py-3 rounded-lg font-semibold hover:bg-lime-800 disabled:bg-lime-900 disabled:cursor-not-allowed transition-colors"
					>
						Join Chat
					</button>
				</div>
			</div>
		</div>
	);
}



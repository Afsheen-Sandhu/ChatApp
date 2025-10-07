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
		<div className="fixed inset-0 bg-stone-100/10 flex items-center justify-center z-50">
			<div className="bg-amber-50 p-8 rounded-xl shadow-xl max-w-md w-full mx-4 border border-amber-200">
				<h2 className="text-2xl font-bold mb-4 text-center text-amber-900">Join Chat Room</h2>
				<p className="text-stone-600 mb-6 text-center">
					Enter your name to start chatting with others
				</p>
				<div className="space-y-4">
					<input
						value={nameInput}
						onChange={(e) => onNameChange(e.target.value)}
						onKeyDown={(e) => handleKeyDown(e, nameInput, onSubmit)}
						placeholder="Your name..."
						className="w-full border border-amber-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white text-stone-800"
						autoFocus
					/>
					<button
						onClick={onSubmit}
						disabled={!nameInput.trim()}
						className="w-full bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 disabled:bg-amber-200 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors"
					>
						Join Chat
					</button>
				</div>
			</div>
		</div>
	);
}



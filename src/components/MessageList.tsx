"use client";
import React from "react";
import { ChatMessage } from "@/lib/hooks/useSocket";

type Props = {
	messages: ChatMessage[];
};

export default function MessageList({ messages }: Props) {
	return (
		<div className="h-96 overflow-y-auto p-4 space-y-3">
			{messages.length === 0 ? (
				<div className="text-center text-lime-500 py-8">
					<p>No messages yet. Start the conversation!</p>
				</div>
			) : (
				messages.map((msg) => (
					<div key={msg.id} className={`flex ${msg.type === 'join' || msg.type === 'leave' ? 'justify-center' : ''}`}>
						{msg.type === 'join' || msg.type === 'leave' ? (
							<div className={`text-sm px-3 py-1 rounded-full ${
								msg.type === 'join' ? 'bg-green-900 text-green-700' : 'bg-red-900 text-red-700'
							}`}>
								<span className="font-semibold">{msg.name}</span> {msg.message}
							</div>
						) : (
							<div className="bg-gray-100 rounded-lg p-3 max-w-xs lg:max-w-md">
								<div className="flex items-center mb-1">
									<span className="font-semibold text-lime-600 text-sm">{msg.name}</span>
									<span className="text-xs text-gray-500 ml-2">
										{new Date(msg.timestamp).toLocaleTimeString()}
									</span>
								</div>
								<p className="text-gray-800">{msg.message}</p>
							</div>
						)}
					</div>
				))
			)}
		</div>
	);
}



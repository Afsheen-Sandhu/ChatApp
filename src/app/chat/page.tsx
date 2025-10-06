"use client";
import { useEffect, useState } from "react";
import { useSocket } from "@/lib/hooks/useSocket";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { socket, connected, messages, deliveredCount, sendMessage } = useSocket();

  useEffect(() => {
    if (connected) {
      console.log("✅ Connected:", socket.id);
    }
  }, [connected, socket]);

  const onSend = async () => {
    if (!input.trim()) return;
    try {
      const ack = await sendMessage(input, 5000);
      console.log("✅ Ack:", ack);
    } catch (e) {
      console.error("⏳ Ack timeout or error");
    } finally {
      setInput("");
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold mb-3">💬 Live Chat</h1>
      <p className="mb-2 text-sm">Status: {connected ? "online" : "offline"} · Delivered notices: {deliveredCount}</p>
      <div className="border p-3 h-64 overflow-y-auto mb-3">
        {messages.map((msg, i) => (
          <p key={i}>{msg}</p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type message..."
        className="border px-3 py-2 mr-2"
      />
      <button
        onClick={onSend}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Send
      </button>
    </div>
  );
}
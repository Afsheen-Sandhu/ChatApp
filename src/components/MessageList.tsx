"use client";
import React, { useEffect, useLayoutEffect, useRef } from "react";
import { ChatMessage } from "@/lib/hooks/useSocket";

type Props = {
  messages: ChatMessage[];
  statusById?: Record<string, "sent" | "delivered">;
  currentUser?: string;
};

export default function MessageList({
  messages,
  statusById = {},
  currentUser,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      className="h-96 overflow-y-auto p-4 space-y-3 bg-stone-100/10 "
    >
      {messages.length === 0 ? (
        <div className="text-center text-stone-400 py-8">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.type === "join" || msg.type === "leave"
                ? "justify-center"
                : ""
            }`}
          >
            {msg.type === "join" || msg.type === "leave" ? (
              <div
                className={`text-sm px-3 py-1 rounded-full ${
                  msg.type === "join"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {msg.message.includes("is now") ? (
                  <>
                    <span className="font-semibold">{msg.name}</span> is now{" "}
                    <span className="font-bold">
                      {msg.message.replace("is now ", "")}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-semibold">{msg.name}</span>{" "}
                    {msg.message}
                  </>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-3 max-w-xs lg:max-w-md border border-amber-200">
                <div className="flex items-center mb-1">
                  <span className="font-semibold text-amber-700 text-sm">
                    {msg.name}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-stone-800">{msg.message}</p>
                {currentUser &&
                  msg.name === currentUser &&
                  statusById[msg.id] && (
                    <div className="mt-1 flex justify-end">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          statusById[msg.id] === "delivered"
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-amber-100 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {statusById[msg.id] === "delivered"
                          ? "✓✓ Delivered"
                          : "✓ Sent"}
                      </span>
                    </div>
                  )}
              </div>
            )}
          </div>
        ))
      )}
      {/* bottom sentinel no longer needed; container scrolls by ref */}
    </div>
  );
}

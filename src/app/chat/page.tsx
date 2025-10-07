"use client";
import { useEffect, useState } from "react";
import { ChatMessage, useSocket } from "@/lib/hooks/useSocket";
import NameModal from "@/components/NameModal";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [hasSetName, setHasSetName] = useState(false);  const [userName, setUserName] = useState("");
  
  const { socket, connected, } = useSocket();

  	useEffect(() => {
		const savedName = localStorage.getItem('chatUserName');
		if (savedName) {
			// Prefill only; do not auto-login
			setNameInput(savedName);
		}
	}, []);
  const setName = (name: string) => {
    setUserName(name);
    setHasSetName(true);
    localStorage.setItem('chatUserName', name);
    if (socket && connected) {
      socket.emit('setName', name);
    }
  };
  
  const resetUser = () => {
    localStorage.removeItem('chatUserName');
    setUserName("");
    setHasSetName(false);
  };
  
  // If we reconnect and already have a saved name, inform the server
  useEffect(() => {
    if (socket && connected && hasSetName && userName) {
      socket.emit('setName', userName);
    }
  }, [socket, connected, hasSetName, userName]);
  useEffect(() => {
    const onMessage = (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    };
    
    const onUserJoined = (data: { name: string; timestamp: number }) => {
      const joinMessage: ChatMessage = {
        id: `join-${Date.now()}`,
        name: data.name,
        message: "joined the chat",
        timestamp: data.timestamp,
        type: 'join'
      };
      setMessages((prev) => [...prev, joinMessage]);
    };

    const onUserLeft = (data: { name: string; timestamp: number }) => {
      const leaveMessage: ChatMessage = {
        id: `leave-${Date.now()}`,
        name: data.name,
        message: "left the chat",
        timestamp: data.timestamp,
        type: 'leave'
      };
      setMessages((prev) => [...prev, leaveMessage]);
    };

    if (socket && connected) {
      socket.on("message", onMessage);
      socket.on("userJoined", onUserJoined);
      socket.on("userLeft", onUserLeft);
    }
    
    return () => {
      socket?.off("message", onMessage);
      socket?.off("userJoined", onUserJoined);
      socket?.off("userLeft", onUserLeft);
    };
  }, [connected, socket]);

  const handleSetName = () => {
    if (nameInput.trim()) {
      setName(nameInput.trim());
      setNameInput("");
    }
  };

  	const sendMessage = (message: string) => {
		if (!socket || !hasSetName || !userName.trim()) return;
		
		const messageData = {
			name: userName,
			message: message,
			timestamp: Date.now()
		};
		
		socket.emit('message', messageData);
	};

  const onSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  // No page-level key handler needed; handled inside components

  // Name input modal
  if (!hasSetName) {
    return (
      <NameModal
        nameInput={nameInput}
        onNameChange={setNameInput}
        onSubmit={handleSetName}
      />
    );
  }

  return (
    <div className="min-h-screen bg-lime-800 p-5">
      <div className="max-w-4xl mx-auto">
        <div className="bg-lime-900 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <ChatHeader userName={userName} connected={connected} onChangeName={resetUser} />

          {/* Messages */}
          <MessageList messages={messages} />

          {/* Input */}
          <MessageInput
            input={input}
            onInputChange={setInput}
            onSend={onSend}
            connected={connected}
          />
        </div>
      </div>
    </div>
  );
}

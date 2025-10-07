"use client";
import { useEffect, useState } from "react";
import { ChatMessage, useSocket } from "@/lib/hooks/useSocket";
import NameModal from "@/components/NameModal";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import { AckResponse } from "@/lib/hooks/useSocket";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [nameInput, setNameInput] = useState("");
  const [hasSetName, setHasSetName] = useState(false);  
  const [userName, setUserName] = useState("");
  const [statusById, setStatusById] = useState<Record<string, 'sent' | 'delivered'>>({});
  
  const { socket, connected, } = useSocket();

  	useEffect(() => {
		const savedName = localStorage.getItem('chatUserName');
		if (savedName) {
			// Prefill only; do not auto-login
			setNameInput(savedName);
		}
	}, []);
  const setName = (name: string) => {
    const prev = userName;
    setUserName(name);
    setHasSetName(true);
    localStorage.setItem('chatUserName', name);
    if (socket && connected) {
      if (prev) {
        socket.emit('changeName', name);
      } else {
        socket.emit('setName', name);
      }
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

    const onNameChanged = (data: { oldName: string; newName: string; timestamp: number }) => {
      const systemMsg: ChatMessage = {
        id: `name-${Date.now()}`,
        name: data.oldName,
        message: `is now ${data.newName}`,
        timestamp: data.timestamp,
        type: 'join',
      };
      setMessages((prev) => [...prev, systemMsg]);
    };

    const onDelivered = (data: { messageId: string }) => {
      const id: string = String(data.messageId);
      setStatusById((prev) => ({ ...prev, [id]: 'delivered' }));
    };

    if (socket && connected) {
      socket.on("message", onMessage);
      socket.on("userJoined", onUserJoined);
      socket.on("userLeft", onUserLeft);
      socket.on("nameChanged", onNameChanged);
      socket.on("delivered", onDelivered);
    }
    
    return () => {
      socket?.off("message", onMessage);
      socket?.off("userJoined", onUserJoined);
      socket?.off("userLeft", onUserLeft);
      socket?.off("nameChanged", onNameChanged);
      socket?.off("delivered");
    };
  }, [connected, socket]);

  const handleSetName = () => {
    if (nameInput.trim()) {
      setName(nameInput.trim());
      setNameInput("");
    }
  };

	const sendMessage = (message: string) => {
		return new Promise<AckResponse>((resolve, reject) => {
			if (!socket || !hasSetName || !userName.trim()) return reject(new Error('Not ready'));
			const messageData = {
				name: userName,
				message: message,
				timestamp: Date.now()
			};
			socket
				.timeout(5000)
				.emit('message', messageData, (err: unknown, res?: AckResponse) => {
					if (err) return reject(err as Error);
					if (!res) return reject(new Error('No ack payload'));
					resolve(res);
				});
		});
	};

	const onSend = async () => {
		if (!input.trim()) return;
        try {
            const ack = await sendMessage(input);
            console.log('✅ Ack:', ack);
            const id = typeof ack.messageId === 'string' ? ack.messageId : undefined;
            if (id) {
                setStatusById((prev) => ({ ...prev, [id]: 'sent' }));
            }
		} catch (e) {
			console.warn('⏳ Ack timeout or error');
		} finally {
			setInput("");
		}
	};

  

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
    <div className="min-h-screen bg-stone-100/10  p-5">
      <div className="max-w-4xl mx-auto ">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-amber-200">
          {/* Header */}
          <ChatHeader userName={userName} connected={connected} onChangeName={resetUser} />

          {/* Messages */}
          <MessageList messages={messages} statusById={statusById} currentUser={userName} />

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

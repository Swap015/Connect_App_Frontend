import { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";
import api from "../../api/axios.js";

const ChatWindow = ({ conversation, user, socket }) => {
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/chat/conversation/${conversation._id}/messages`);
                setMessages(res.data.messages);
            } catch (err) {
                console.error("Error fetching messages:", err);
            }
        };
        fetchMessages();
    }, [conversation]);

    useEffect(() => {
        socket.on("getMessage", (msg) => {
            if (msg.conversation === conversation._id) {
                setMessages((prev) => [...prev, msg]);
            }
        });

        socket.on("typing", ({ conversationId, senderId }) => {
            if (conversationId === conversation._id && senderId !== user._id) {
                setTyping(true);
            }
        });

        socket.on("stopTyping", ({ conversationId, senderId }) => {
            if (conversationId === conversation._id && senderId !== user._id) {
                setTyping(false);
            }
        });

        return () => {
            socket.off("getMessage");
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, [conversation, user, socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, typing]);

    const handleSend = async (text) => {
        try {
            const res = await api.post("/chat/sendMessage", {
                conversationId: conversation._id,   // ✅ correct key
                text,                               // ✅ message text
            });

            setMessages((prev) => [...prev, res.data.message]);

            socket.emit("sendMessage", {
                senderId: user._id,
                receiverId: conversation.participants.find((p) => p._id !== user._id)._id,
                message: res.data.message,
            });
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };


    return (
        <div className="flex flex-col h-full text-black">
           
            <div className="flex items-center gap-3 p-3 border-b bg-gray-50 text-black">
                <img
                    src={conversation.participants.find((p) => p._id !== user._id)?.profileImage || "/default-avatar.png"}
                    alt="chat user"
                    className="w-10 h-10 rounded-full"
                />
                <h3 className="font-semibold text-black">
                    {conversation.participants.find((p) => p._id !== user._id)?.name}
                </h3>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                {messages.map((m) => (
                    <MessageBubble key={m._id} message={m} isOwn={m.sender === user._id} />
                ))}
                {typing && (
                    <p className="text-sm text-gray-400 italic">typing...</p>
                )}
                <div ref={messagesEndRef} />
            </div>

        
            <MessageInput onSend={handleSend} socket={socket} conversation={conversation} user={user} />
        </div>
    );
};

export default ChatWindow;

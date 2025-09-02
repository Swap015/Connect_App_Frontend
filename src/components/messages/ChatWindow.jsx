import { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";
import { IoMdArrowRoundBack } from "react-icons/io";
import api from "../../api/axios.js";

const ChatWindow = ({ conversation, user, socket, onBack }) => {
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
        const container = messagesEndRef.current?.parentNode;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth", 
            });
        }
    }, [messages]);


    useEffect(() => {
        const onGetMessage = (msg) => {
            const msgConvId = typeof msg.conversation === "object" ? String(msg.conversation._id) : String(msg.conversation);
            if (msgConvId === String(conversation._id)) {
                setMessages(prev => [...prev, msg]);
            }
        };

        socket.on("getMessage", onGetMessage);
        socket.on("typing", ({ conversationId, senderId }) => {
            if (String(conversationId) === String(conversation._id) && String(senderId) !== String(user._id)) {
                setTyping(true);
            }
        });
        socket.on("stopTyping", ({ conversationId, senderId }) => {
            if (String(conversationId) === String(conversation._id) && String(senderId) !== String(user._id)) {
                setTyping(false);
            }
        });

        return () => {
            socket.off("getMessage", onGetMessage);
            socket.off("typing");
            socket.off("stopTyping");
        };
    }, [conversation, user, socket]);


    const handleSend = async (text) => {
        try {
            const res = await api.post("/chat/sendMessage", {
                conversationId: conversation?._id,
                text,
            });

            setMessages((prev) => [...prev, res.data.message]);

            socket.emit("sendMessage", {
                receiverId: conversation.participants.find(p => String(p._id) !== String(user._id))._id,
                message: res.data.message,
            });

        } catch (err) {
            console.error("Error sending message:", err);
        }
    };


    return (
        <div className="flex flex-col h-full text-black">

            <div className="flex items-center gap-3 p-3 border-b bg-gray-50 text-black">
                <button
                    onClick={onBack}
                    className="sm:hidden p-2 rounded-full hover:bg-gray-200"
                >
                    <IoMdArrowRoundBack className="text-xl" />
                </button>
                <img
                    src={conversation.participants.find((p) => p._id !== user._id)?.profileImage}
                    alt="chat user"
                    className="w-10 h-10 rounded-full"
                />
                <h3 className="font-semibold text-sm text-black">
                    {conversation.participants.find((p) => p._id !== user._id)?.name}
                </h3>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                {messages.map((m) => (
                    <MessageBubble
                        key={m._id}
                        message={m}
                        isOwn={String(m.sender) === String(user._id)}
                    />
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

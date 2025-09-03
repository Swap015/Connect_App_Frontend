import { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";
import { IoMdArrowRoundBack } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";
import api from "../../api/axios.js";

const ChatWindow = ({ conversation, user, socket, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

   
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

    // Socket listeners
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

    
    const handleSend = async (text, attachments = []) => {
        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("conversationId", conversation?._id);
            if (text) formData.append("text", text);

            attachments.forEach((file) => {
                formData.append("attachments", file);
            });

            const res = await api.post("/chat/sendMessage", formData);

            setMessages((prev) => [...prev, res.data.message]);

            socket.emit("sendMessage", {
                receiverId: conversation.participants.find(p => String(p._id) !== String(user._id))._id,
                message: res.data.message,
            });

        } catch (err) {
            console.error("Error sending message:", err);
        }
        finally {
            setUploading(false);
        }
    };


    const handleDeleteConversation = async () => {
        if (!window.confirm("Delete this conversation?")) return;
        try {
            await api.delete(`/chat/conversation/${conversation._id}`);
            onBack();
        } catch (err) {
            console.error("Error deleting conversation:", err);
        }
    };


    const handleDeleteMessage = async (msgId, forEveryone = false) => {
        try {
            await api.delete(`/chat/message/${msgId}?forEveryone=${forEveryone}`);
            setMessages((prev) => prev.filter((m) => m._id !== msgId));
        } catch (err) {
            console.error("Error deleting message:", err);
        }
    };

    return (
        <div className="flex flex-col h-full text-black">

            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50 text-black">
                <div className="flex items-center gap-3">
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
                {/* Menu */}
                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 hover:bg-gray-200 rounded-full"
                    >
                        <HiDotsVertical size={20} />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                            <button
                                onClick={handleDeleteConversation}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                            >
                                Delete Conversation
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
                {messages.map((m) => (
                    <MessageBubble
                        key={m._id}
                        message={m}
                        isOwn={String(m.sender) === String(user._id)}
                        onDelete={(forEveryone) => handleDeleteMessage(m._id, forEveryone)}
                    />
                ))}
                {typing && (
                    <p className="text-sm text-gray-400 italic">typing...</p>
                )}
                <div ref={messagesEndRef} />
            </div>

            
            <MessageInput
                onSend={handleSend}
                socket={socket}
                conversation={conversation}
                user={user}
                uploading={uploading}
            />
        </div>
    );
};

export default ChatWindow;

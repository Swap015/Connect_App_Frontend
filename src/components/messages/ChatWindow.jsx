import { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble.jsx";
import MessageInput from "./MessageInput.jsx";
import { IoMdArrowRoundBack } from "react-icons/io";
import { HiDotsVertical } from "react-icons/hi";
import api from "../../api/axios.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ChatWindow = ({ conversation, user, socket, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [uploading, setUploading] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const chatPartner = conversation.participants.find(
        (p) => p._id !== user._id
    );

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await api.get(`/chat/conversation/${conversation._id}/messages`);
                setMessages(res.data.messages);
            } catch {
                toast.error("Error fetching messages");
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
        if (!socket) return;

        const onGetMessage = (msg) => {
            if (String(msg.conversationId) === String(conversation._id)) {
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

        } catch {
            toast.error("Error sending message");
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
        } catch {
            toast.error("Error deleting conversation");
        }
    };


    const handleDeleteMessage = async (msgId, forEveryone = false) => {
        try {
            if (forEveryone) {
                await api.delete(`/chat/deleteForEveryone/${msgId}`);
                setMessages((prev) =>
                    prev.map((m) =>
                        m._id === msgId
                            ? { ...m, text: "This message is deleted for everyone", attachments: [], deletedForEveryone: true }
                            : m
                    )
                );
            } else {
                await api.delete(`/chat/deleteMsg/${msgId}`);
                setMessages((prev) =>
                    prev.map((m) =>
                        m._id === msgId
                            ? { ...m, deletedForMe: true }
                            : m
                    )
                );
            }
        } catch {
            toast.error("Error deleting message");
        }
    };

    return (
        <div className="flex flex-col h-full w-full text-black overflow-x-hidden overflow-y-auto">

            <div className="flex items-center justify-between p-0 lg:p-1.5 border-b bg-gray-50 text-black">
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
                        className="w-10 h-10 rounded-full cursor-pointer"
                        onClick={() => navigate(`/profile/${chatPartner?._id}`)}
                    />
                    <h3 onClick={() => navigate(`/profile/${chatPartner?._id}`)}
                        className="font-semibold text-sm md:text-base 2xl:text-lg text-black cursor-pointer">
                        {conversation.participants.find((p) => p._id !== user._id)?.name}
                    </h3>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 hover:bg-gray-200 rounded-full"
                    >
                        <HiDotsVertical size={20} />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 mt-2 w-40 lg:w-45 bg-white border rounded shadow-lg z-50">
                            <button
                                onClick={handleDeleteConversation}
                                className="w-full px-4 py-2  text-left text-xs lg:text-sm hover:bg-gray-100"
                            >
                                Delete Conversation
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 sm:p-4 space-y-2 bg-white">
                {messages.map((msg) => (
                    <MessageBubble
                        key={msg._id}
                        message={msg}
                        isOwn={String(msg.sender) === String(user._id)}
                        onDelete={(forEveryone) => handleDeleteMessage(msg._id, forEveryone)}
                    />
                ))}
                {typing && (
                    <p className="text-sm text-gray-400 italic animate-pulse">{chatPartner.name.split(" ")[0]} is typing...</p>
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

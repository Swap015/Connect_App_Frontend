import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";

const MessageInput = ({ onSend, socket, conversation, user }) => {
    const [text, setText] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSend(text);
        setText("");
        socket.emit("stopTyping", { conversationId: conversation._id, senderId: user._id, receiverId: conversation.participants.find((p) => p._id !== user._id)._id });
    };

    const handleTyping = () => {
        socket.emit("typing", {
            conversationId: conversation._id,
            senderId: user._id,
            receiverId: conversation.participants.find((p) => p._id !== user._id)._id,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t bg-gray-50">
            <input
                type="text"
                placeholder="Type a message..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleTyping}
                className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring focus:border-blue-400"
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full">
                <FaPaperPlane />
            </button>
        </form>
    );
};

export default MessageInput;

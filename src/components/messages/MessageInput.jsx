import { useState } from "react";
import { IoSendSharp } from "react-icons/io5";

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
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white p-3 rounded-full flex items-center justify-center shadow-md">
                <IoSendSharp className="text-lg "/>
            </button>
        </form>
    );
};

export default MessageInput;

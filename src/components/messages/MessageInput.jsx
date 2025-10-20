import { useRef, useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import { AiOutlinePaperClip } from "react-icons/ai";

const MessageInput = ({ onSend, socket, conversation, user, uploading }) => {
    const [text, setText] = useState("");
    const [attachments, setAttachments] = useState([]);
    const typingTimeoutRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim() && attachments.length === 0) return;

        onSend(text, attachments);
        setText("");
        setAttachments([]);

        const receiverId = conversation.participants.find(
            (p) => p._id !== user._id
        )._id;

        socket.emit("stopTyping", {
            conversationId: conversation._id,
            senderId: user._id,
            receiverId,
        });
    };

    const handleTyping = () => {
        const receiverId = conversation.participants.find(
            (p) => p._id !== user._id
        )._id;

        socket.emit("typing", {
            conversationId: conversation._id,
            senderId: user._id,
            receiverId,
        });

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }

        typingTimeoutRef.current = setTimeout(() => {
            socket.emit("stopTyping", {
                conversationId: conversation._id,
                senderId: user._id,
                receiverId,
            });
        }, 2000);
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setAttachments((prev) => [...prev, ...files]);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col border-t bg-gray-50 text-black p-1 md:p-2 space-y-2"
        >
            {/* Attachment Preview */}
            {attachments.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-1 px-1">
                    {attachments.map((file, idx) => (
                        <div key={idx} className="relative group flex-shrink-0">
                            {file.type.startsWith("image") ? (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="preview"
                                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border text-xs"
                                />
                            ) : (
                                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center rounded-lg border bg-gray-100 text-[10px] sm:text-xs text-gray-600">
                                    {file.name.slice(0, 10)}...
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() =>
                                    setAttachments((prev) => prev.filter((_, i) => i !== idx))
                                }
                                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

          
            <div className="flex items-center gap-2">
                {/* attachment button */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="hover:text-gray-800 text-black flex-shrink-0"
                    disabled={uploading}
                >
                    <AiOutlinePaperClip size={22} />
                </button>

                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                />

                {/* message input */}
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleTyping}
                    className="flex-1 px-3 py-1 rounded-full border focus:outline-none focus:ring focus:border-orange-400 text-sm sm:text-base"
                    disabled={uploading}
                />

                {/* send button */}
                <button
                    disabled={uploading}
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-full flex items-center justify-center shadow-md flex-shrink-0"
                >
                    {uploading ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        <IoSendSharp className="text-lg" />
                    )}
                </button>
            </div>
        </form>
    );
};

export default MessageInput;

import dayjs from "dayjs";
import { HiOutlineTrash } from "react-icons/hi";
import { useState } from "react";

const MessageBubble = ({ message, isOwn, onDelete }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const isDeletedForEveryone =
        message.text === "This message is deleted for everyone" ||
        message.deletedForEveryone;
    const isDeletedForMe = message.deletedForMe;

   
    if (isDeletedForMe) return null;

    return (
        <div
            className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2 relative`}
        >
            <div
                className={`max-w-xs text-sm px-5 py-2 rounded-lg shadow-md relative ${isOwn
                        ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-br-none"
                        : "bg-gradient-to-b from-[#bcbbbb] to-[#7b7a7a] text-white/90 rounded-bl-none"
                    }`}
            >
                {isDeletedForEveryone ? (
                    <p className="italic text-white">This message is deleted for everyone</p>
                ) : (
                    <>
                    
                        {message.attachments &&
                            message.attachments.map((file, idx) => (
                                <div key={idx} className="mb-2">
                                    {file.type === "image" ? (
                                        <img
                                            src={file.url}
                                            alt="attachment"
                                            className="rounded-md max-h-48"
                                        />
                                    ) : file.type === "video" ? (
                                        <video
                                            controls
                                            src={file.url}
                                            className="rounded-md max-h-48"
                                        />
                                    ) : (
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="underline text-blue-200"
                                        >
                                            {file.originalName || "Download file"}
                                        </a>
                                    )}
                                </div>
                            ))}

                       
                        {message.text && <p>{message.text}</p>}
                    </>
                )}

                {/*seen status */}
                <span className="block text-[10px] mt-1 opacity-80">
                    {dayjs(message.createdAt).format("hh:mm A")}
                    {isOwn && (
                        <span className="ml-2">
                            {message.seen ? "✓✓" : "✓"}
                        </span>
                    )}
                </span>

               
                {isOwn && !isDeletedForEveryone && (
                    <div className="absolute top-1 right-1">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-xs text-white opacity-70 hover:opacity-100"
                        >
                            <HiOutlineTrash />
                        </button>
                    </div>
                )}
            </div>

          
            {isOwn && menuOpen && !isDeletedForEveryone && (
                <div className="absolute right-0 top-6 w-40 bg-white text-black rounded shadow-md text-xs z-50">
                    <button
                        onClick={() => {
                            onDelete(false);
                            setMenuOpen(false);
                        }}
                        className="block w-full px-3 py-2 hover:bg-gray-100"
                    >
                        Delete for me
                    </button>
                    <button
                        onClick={() => {
                            onDelete(true);
                            setMenuOpen(false);
                        }}
                        className="block w-full px-3 py-2 hover:bg-gray-100"
                    >
                        Delete for everyone
                    </button>
                </div>
            )}
        </div>
    );
};

export default MessageBubble;

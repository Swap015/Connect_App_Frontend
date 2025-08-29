import dayjs from "dayjs";

const MessageBubble = ({ message, isOwn }) => {
    return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-xs text-black px-4 py-2 rounded-lg shadow ${isOwn
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
            >
                <p>{message.text}</p>
                <span className="block text-xs mt-1 opacity-70">
                    {dayjs(message.createdAt).format("HH:mm")}
                </span>
            </div>
        </div>
    );
};

export default MessageBubble;

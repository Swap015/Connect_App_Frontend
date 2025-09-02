import dayjs from "dayjs";

const MessageBubble = ({ message, isOwn }) => {
    return (
        <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-xs text-sm font-semibold text-white px-4 py-2 rounded-lg  shadow-lg ${isOwn
                    ? "bg-gradient-to-r from-orange-400  to-orange-500 text-white rounded-br-none"
                    : "bg-gradient-to-b from-[#bcbbbb] to-[#7b7a7a] text-gray-800 rounded-bl-none shadow-lg"
                    }`}
            >
                <p>{message.text}</p>
                <span className="block text-[10px] mt-1 opacity-80">
                    {dayjs(message.createdAt).format("hh:mm A")}
                </span>

            </div>
        </div>
    );
};

export default MessageBubble;

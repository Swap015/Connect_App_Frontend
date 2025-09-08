import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const ConversationList = ({ conversations, selectedConversation, onSelect, userId }) => {
    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <img
                    src="/no-messages.png"  here
                    alt="No conversations"
                    className="w-40 h-40 mb-4 opacity-80"
                />
                <p className="text-lg font-semibold">No Conversations Yet</p>
                <p className="text-sm">Start a chat to see them here 💬</p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto h-full text-black">
            {conversations.map((c) => {
                const otherUser = c.participants.find((p) => p._id !== userId);
                const isSelected = selectedConversation?._id === c._id;

                return (
                    <div
                        key={c._id}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition ${isSelected ? "bg-orange-200" : "hover:bg-gray-300"
                            }`}
                        onClick={() => onSelect(c)}
                    >
                        <img
                            src={otherUser?.profileImage || "/default-avatar.png"}
                            alt={otherUser?.name}
                            className="w-12 h-12 rounded-full border object-cover"
                        />
                        <div className="flex-1">
                            <h4 className="font-bold text-base text-gray-800">
                                {otherUser?.name}
                            </h4>
                            <p className="text-sm text-gray-500 truncate">
                                {c.lastMessage
                                    ? c.lastMessage.text
                                        ? c.lastMessage.text
                                        : c.lastMessage.attachments?.length > 0
                                            ? c.lastMessage.attachments[0].type === "image"
                                                ? "📷 Photo"
                                                : c.lastMessage.attachments[0].type === "video"
                                                    ? "🎥 Video"
                                                    : "📎 File"
                                            : ""
                                    : "No messages yet"}
                            </p>
                        </div>
                        {c.lastMessage && (
                            <span className="text-xs text-gray-500">
                                {dayjs(c.lastMessage.createdAt).fromNow()}
                            </span>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ConversationList;

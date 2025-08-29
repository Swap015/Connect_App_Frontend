import dayjs from "dayjs";

const ConversationList = ({ conversations, selectedConversation, onSelect, userId }) => {
    return (
        <div className="overflow-y-auto h-full text-black">
            {conversations.map((c) => {
                const otherUser = c.participants.find((p) => p._id !== userId);
                const isSelected = selectedConversation?._id === c._id;

                return (
                    <div
                        key={c._id}
                        className={`flex items-center gap-3 p-3 cursor-pointer transition ${isSelected ? "bg-blue-100" : "hover:bg-gray-100"
                            }`}
                        onClick={() => onSelect(c)}
                    >
                        <img
                            src={otherUser?.profileImage || "/default-avatar.png"}
                            alt={otherUser?.name}
                            className="w-12 h-12 rounded-full border object-cover"
                        />
                        <div className="flex-1">
                            <h4 className="font-semibold text-gray-800">{otherUser?.name}</h4>
                            <p className="text-sm text-gray-500 truncate">
                                {c.lastMessage?.text || "No messages yet"}
                            </p>
                        </div>
                        {c.lastMessage && (
                            <span className="text-xs text-gray-400">
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

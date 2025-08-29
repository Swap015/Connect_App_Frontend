import { useEffect, useState } from "react";
import ConversationList from "../../components/messages/ConversationList.jsx";
import ChatWindow from "../../components/messages/ChatWindow.jsx";
import api from "../../api/axios.js";
import { io } from "socket.io-client";

const socket = io("http://localhost:7000", { withCredentials: true });

const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserAndConvos = async () => {
            try {
                const resUser = await api.get("/user/me");
                setUser(resUser.data.user);

                const resConvo = await api.get("/chat/getAllConversation");
                setConversations(resConvo.data.conversations);

                socket.emit("addUser", resUser.data.user._id);
            } catch (err) {
                console.error("Error fetching conversations:", err);
            }
        };
        fetchUserAndConvos();
    }, []);

    return (
        <div className="flex h-[90vh] border rounded-lg shadow-lg overflow-hidden">
            {/* messages sidebar */}
            <div className="w-1/3 border-r bg-gray-50 text-black">
                <ConversationList
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onSelect={setSelectedConversation}
                    userId={user?._id}
                />
            </div>

            {/* chat window */}
            <div className="flex-1">
                {selectedConversation ? (
                    <ChatWindow
                        conversation={selectedConversation}
                        user={user}
                        socket={socket}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;

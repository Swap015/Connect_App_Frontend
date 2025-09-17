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
        <div className="w-full h-[90vh] bg-white  shadow-xl flex overflow-hidden border-2 border-white">
            {/* Sidebar (Conversation List) */}
            <div
                className={`${selectedConversation ? "hidden sm:block" : "block"
                    } w-full sm:w-1/3 border-r bg-gray-50 text-black`}
            >
                <ConversationList
                    conversations={conversations}
                    selectedConversation={selectedConversation}
                    onSelect={setSelectedConversation}
                    userId={user?._id}
                />
            </div>

            <div
                className={`${selectedConversation ? "block" : "hidden sm:block"
                    } flex-1 flex flex-col`}
            >
                {selectedConversation ? (
                    <ChatWindow
                        conversation={selectedConversation}
                        user={user}
                        socket={socket}
                        onBack={() => setSelectedConversation(null)} // 👈 back button handler
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-700 text-center px-4 font-semibold text-base bg-gray-300">
                        Select a conversation to start chatting{" "}
                        <span className="text-2xl drop-shadow-sm"> 💬</span>
                    </div>
                )}
            </div>
        </div>

    );
};

export default Messages;

import { useContext, useEffect, useState } from "react";
import ConversationList from "../../components/messages/ConversationList.jsx";
import ChatWindow from "../../components/messages/ChatWindow.jsx";
import api from "../../api/axios.js";
import { io } from "socket.io-client";
import UserContext from "../../components/Context/UserContext.jsx";


const Messages = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [socket, setSocket] = useState(null);
    const { user, loading } = useContext(UserContext);
    const [convoLoading, setConvoLoading] = useState(true);
    const VITE_SOCKET_URL=import.meta.env.VITE_SOCKET_URL

    useEffect(() => {

        if (!loading && user) {
            const newSocket = io(VITE_SOCKET_URL, { withCredentials: true });
            setSocket(newSocket);

            const fetchConvos = async () => {
                try {
                    setConvoLoading(true);
                    const resConvo = await api.get("/chat/getAllConversation");
                    setConversations(resConvo.data.conversations);

                    if (user?._id) {
                        newSocket.emit("addUser", user._id);
                    }
                } catch (err) {
                    console.error("Error fetching conversations:", err);
                } finally {
                    setConvoLoading(false);
                }
            };

            fetchConvos();
            return () => newSocket.disconnect();
        }

    }, [user, loading]);

    if (loading || convoLoading) {
        return (
            <div className="flex justify-center items-center h-[90vh]">
                <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
            </div>
        );
    }

    return (
        <div className="w-full h-[90vh] bg-white  shadow-xl flex overflow-hidden border-2 border-white">

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
                        onBack={() => setSelectedConversation(null)}
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

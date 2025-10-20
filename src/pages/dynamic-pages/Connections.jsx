import { useContext, useEffect, useState } from "react";
import {
    FaCheck,
    FaTimes,
    FaUserPlus,
    FaUndo,
    FaUserMinus,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../api/axios";
import UserContext from "../../components/Context/UserContext";
import { useNavigate } from "react-router-dom";

const Connections = () => {
    const [activeTab, setActiveTab] = useState("received");
    const [received, setReceived] = useState([]);
    const [sent, setSent] = useState([]);
    const [users, setUsers] = useState([]);
    const [connections, setConnections] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user: me } = useContext(UserContext);

    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const startChat = async (otherUserId) => {
        try {
            const res = await api.post("/chat/conversation", { otherUserId });
            const conversation = res.data.conversation;

            navigate("/messages", { state: { conversationId: conversation._id } });
        } catch {
            toast.error("Failed to start chat");
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [recRes, sentRes, usersRes, connRes] = await Promise.all([
                api.get("/connection/received-requests"),
                api.get("/connection/sent-requests"),
                api.get("/user/getUsers"),
                api.get("/connection/my-connections")
            ]);

            setReceived(recRes.data.requests);
            setSent(sentRes.data.sentRequests);
            setUsers(usersRes.data.users);
            setConnections(connRes.data.connections);
        } catch {
            toast.error("Error fetching connections");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (id, name) => {
        try {
            await api.post(`/connection/accept/${id}`);
            toast.success(`You are now connected with ${name}`);

            setReceived(prev => prev.filter(r => r.user._id !== id));
            setConnections(prev => [...prev, { _id: id, name }]);
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to accept request");
        }
    };

    const handleReject = async (id) => {
        try {
            await api.post(`/connection/reject/${id}`);
            toast.info("Connection request rejected");

            setReceived((prev) => prev.filter((r) => r.user._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to reject request");
        }
    };

    const handleSend = async (id) => {
        try {
            await api.post(`/connection/send/${id}`);
            toast.success("Connection request sent");

            setSent(prev => [...prev, { _id: id }]);
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to send request");
        }
    };

    const handleCancel = async (id) => {
        try {
            await api.post(`/connection/cancel/${id}`);
            toast.info("Connection request cancelled");

            setSent((prev) => prev.filter((s) => s._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to cancel request");
        }
    };

    const handleRemove = async (id) => {
        try {
            await api.delete(`/connection/remove/${id}`);
            toast.info("Connection removed");

            setConnections((prev) => prev.filter((c) => c._id !== id));
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to remove connection");
        }
    };

    const renderUserAction = (u) => {
        if (!me || u._id === me._id) return null;

        if (connections.some((c) => c._id === u._id)) {
            return (
                <button
                    onClick={() => handleRemove(u._id)}
                    className="btn btn-sm mt-4 bg-gray-200 text-gray-700 hover:bg-gray-300 border-none"
                >
                    <FaUserMinus className="mr-1" /> Remove
                </button>
            );
        }

        if (sent.some((s) => s._id === u._id)) {
            return (
                <button
                    onClick={() => handleCancel(u._id)}
                    className="btn btn-sm mt-4 bg-gray-200 text-gray-700 hover:bg-gray-300 border-none"
                >
                    <FaUndo className="mr-1" /> Cancel
                </button>
            );
        }

        if (received.some((r) => r.user._id === u._id)) {
            return (
                <button
                    onClick={() => handleAccept(u._id, u.name)}
                    className="btn btn-sm mt-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white border-none"
                >
                    <FaCheck className="mr-1" /> Accept
                </button>
            );
        }



        return (
            <button
                onClick={() => handleSend(u._id)}
                className="btn btn-sm mt-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white border-none"
            >
                <FaUserPlus className="mr-1" /> Connect
            </button>
        );
    };

    useEffect(() => {
        if (!activeTab) return;

        const fetchTabData = async () => {
            try {
                if (activeTab === "received") {
                    const res = await api.get("/connection/received-requests");
                    setReceived(res.data.requests);
                } else if (activeTab === "sent") {
                    const res = await api.get("/connection/sent-requests");
                    setSent(res.data.sentRequests);
                } else if (activeTab === "all") {
                    const res = await api.get("/user/getUsers");
                    setUsers(res.data.users);
                } else if (activeTab === "connections") {
                    const res = await api.get("/connection/my-connections");
                    setConnections(res.data.connections);
                }
            } catch {
                toast.error("Error fetching data");
            }
        };

        fetchTabData();
    }, [activeTab]);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="max-w-4xl mx-auto">

                <h2 className="text-xl sm:2xl lg:text-3xl font-bold mb-8 text-center text-black">
                    Manage Your Connections
                </h2>

                <div className="flex justify-center mb-8 gap-3 flex-wrap">
                    {["received", "sent", "all", "connections"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-2 text-xs lg:text-base rounded-full font-medium transition ${activeTab === tab
                                ? "bg-gradient-to-r from-orange-400 to-orange-500 text-white shadow-md"
                                : "border border-gray-500 text-gray-700 font-semibold hover:bg-gray-100"
                                }`}
                        >
                            {tab === "received"
                                ? "Requests Received"
                                : tab === "sent"
                                    ? "Requests Sent"
                                    : tab === "all"
                                        ? "All Users"
                                        : "Connections"}
                        </button>
                    ))}
                </div>

                {/* Received requests */}
                {activeTab === "received" && (
                    <div className="space-y-5">
                        {received.length > 0 ? (
                            received.map((req) => (
                                <div
                                    key={req.user._id}
                                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg py-4 px-3 shadow-md"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={req.user.profileImage}
                                            alt={req.user.name}
                                            onClick={() => navigate(`/profile/${req.user._id}`)}
                                            className="w-12 h-12 lg:w-14 lg:h-14 rounded-full ring-2 ring-orange-400 cursor-pointer"
                                        />
                                        <div>
                                            <h4 onClick={() => navigate(`/profile/${req.user._id}`)}
                                                className="text-sm sm:text-base  font-semibold text-gray-800 cursor-pointer">
                                                {req.user.name}
                                            </h4>
                                            <p className="text-xs hidden sm:block sm:text-sm lg:text-base text-gray-500">
                                                {req.user.headline}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(req.user._id, req.user.name)}
                                            className="btn btn-sm bg-gradient-to-r from-orange-400 to-orange-500 text-white border-none text-xs sm:text-sm cursor-pointer"
                                        >
                                            <FaCheck className="mr-1 hidden sm:block cursor-pointer" /> Accept
                                        </button>
                                        <button
                                            onClick={() => handleReject(req.user._id)}
                                            className="btn btn-sm text-xs sm:text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 border-none cursor-pointer"
                                        >
                                            <FaTimes className="mr-1 hidden sm:block cursor-pointer" /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm lg:text-base text-gray-500">
                                No received requests.
                            </p>
                        )}
                    </div>
                )}

                {/* sent requests */}
                {activeTab === "sent" && (
                    <div className="space-y-3">
                        {sent.length > 0 ? (
                            sent.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-md"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={user.profileImage}
                                            alt={user.name}
                                            onClick={() => navigate(`/profile/${user._id}`)}
                                            className="w-12 h-12 lg:w-14 lg:h-14 rounded-full ring-2 ring-orange-400 cursor-pointer"
                                        />
                                        <h4 onClick={() => navigate(`/profile/${user._id}`)} className="text-sm sm:text-base font-semibold text-gray-800 cursor-pointer">{user.name}</h4>
                                    </div>
                                    <button
                                        onClick={() => handleCancel(user._id)}
                                        className="btn btn-sm text-xs sm:text-sm bg-gray-200 text-gray-700 hover:bg-gray-300 border-none cursor-pointer"
                                    >
                                        <FaUndo className="mr-1" /> Cancel
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm lg:text-base text-gray-500">
                                No sent requests.
                            </p>
                        )}
                    </div>
                )}

                {activeTab === "all" && (
                    <div className="grid  sm:grid-cols-4  lg:grid-cols-5 grid-cols-2 gap-6 text-sm sm:text-base">
                        {users.length > 0 ? (
                            users
                                .filter((u) => me && u._id !== me._id && u.role !== "admin")
                                .map((u) => (
                                    <div
                                        key={u._id}
                                        className="bg-white border border-gray-200 rounded-lg p-5 shadow-md transition text-center  flex flex-col items-center justify-between"
                                    >
                                        <img
                                            src={u.profileImage}
                                            alt={u.name}
                                            onClick={() => navigate(`/profile/${u._id}`)}
                                            className="w-12 h-12 lg:w-14 lg:h-14  rounded-full ring-2 ring-orange-400 cursor-pointer"
                                        />
                                        <h4 onClick={() => navigate(`/profile/${u._id}`)}
                                            className="font-semibold text-xs md:text-sm lg:text-base mt-3 text-gray-800 cursor-pointer">
                                            {u.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 min-h-[0.6rem]">
                                            {u.headline ? (u.headline.length > 10 ? u.headline.slice(0, 18) + "..." : u.headline) : " "}
                                        </p>
                                        {renderUserAction(u)}
                                    </div>
                                ))
                        ) : (
                            <p className="text-center text-sm lg:text-base text-gray-500">
                                No users available.
                            </p>
                        )}
                    </div>
                )}

                {/* My connections */}
                {activeTab === "connections" && (
                    <div className="space-y-5">
                        {connections.length > 0 ? (
                            connections.map((conn) => (
                                <div
                                    key={conn._id}
                                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-4 shadow-md transition"
                                >
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={conn.profileImage}
                                            alt={conn.name}
                                            onClick={() => navigate(`/profile/${conn._id}`)}
                                            className="w-12 h-12 lg:w-14 lg:h-14  rounded-full ring-2 ring-orange-400 cursor-pointer"
                                        />
                                        <div>
                                            <h4 onClick={() => navigate(`/profile/${conn._id}`)} className="font-semibold text-gray-800 text-sm lg:text-base 2xl:text-lg cursor-pointer">
                                                {conn.name}
                                            </h4>
                                            <p className="text-sm text-gray-500">
                                                {conn.headline}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => startChat(conn._id)}
                                            className="btn btn-sm bg-blue-500 text-white border-none text-xs sm:text-sm cursor-pointer"
                                        >
                                            Message
                                        </button>
                                        <button
                                            onClick={() => handleRemove(conn._id)}
                                            className="btn btn-sm bg-gray-200 text-gray-700 hover:bg-gray-300 border-none text-xs sm:text-sm cursor-pointer"
                                        >
                                            Remove
                                        </button>
                                    </div>

                                </div>
                            ))
                        ) : (
                            <p className="text-center text-sm lg:text-base text-gray-500">
                                You have no connections yet.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Connections;

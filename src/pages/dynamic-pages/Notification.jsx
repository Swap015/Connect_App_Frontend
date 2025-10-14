import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { FaBell, FaCheckCircle, FaTrashAlt } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
dayjs.extend(relativeTime);

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notification/getNotifications");
            setNotifications(res.data.notifications);
        } catch {
            toast.error("Failed to fetch notifications");
        } finally {
            setLoading(false);
        }
    };

    const markAllRead = async () => {
        try {
            await api.patch("/notification/markAllAsRead", {}, { withCredentials: true });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch {
            toast.error("Failed to mark all notifications as read");
        }
    };

    const markOneRead = async (id) => {
        try {
            await api.patch(`/notification/markOneAsRead/${id}`, {}, { withCredentials: true });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch {
            toast.error(" Failed to mark notification as read");
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notification/deleteNotification/${id}`, { withCredentials: true });
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch  {
            toast.error("Failed to delete notification");
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-spinner w-13 h-17text-orange-500"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-lg sm:text-xl lg:text-2xl 3xl:text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <FaBell className="text-yellow-400" /> Notifications
                </h1>
                <button
                    onClick={markAllRead}
                    className="px-1.5 py-1.5 sm:px-2 sm:py-2 text-[9px] text-xs md:text-sm bg-green-600 hover:bg-green-500 text-white rounded shadow"
                >
                    Mark All as Read
                </button>
            </div>

            {notifications.length === 0 ? (
                <p className="text-gray-700 text-center mt-10 text-sm sm:text-lg">No notifications yet!</p>
            ) : (
                <div className="space-y-4">
                    {notifications.map((n) => (
                        <div
                            key={n._id}
                            className={`flex justify-between items-center p-4 rounded-lg shadow-md transition ${n.read ? "bg-white" : n.type === "admin" ? "bg-blue-50 border-l-4 border-blue-500" : "bg-orange-50 border-l-4 border-orange-500"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={n.sender?.profileImage || "/default-avatar.png"}
                                    alt={n.sender?.name}
                                    onClick={() => navigate(`/profile/${n.sender?._id}`)}
                                    className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border cursor-pointer"
                                />
                                <div>
                                    <p className="text-gray-700">
                                        <span onClick={() => navigate(`/profile/${n.sender?._id}`)}
                                            className="font-semibold sm:font-bold cursor-pointer text-xs sm:text-sm lg:text-base 2xl:text-xl">  {n.type === "admin" ? "Connect" : n.sender?.name}</span>{" "}
                                        <span className="text-xs sm:text-sm lg:text-base 2xl:text-lg">{getNotificationText(n)}</span>
                                    </p>
                                    <p className="text-xs text-gray-500">{dayjs(n.createdAt).fromNow()}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {!n.read && (
                                    <FaCheckCircle
                                        onClick={() => markOneRead(n._id)}
                                        className="text-green-500 hover:text-green-600 cursor-pointer text-lg lg:text-2xl transition-transform hover:scale-110"
                                        title="Mark as Read"
                                    />
                                )}
                                <FaTrashAlt
                                    onClick={() => deleteNotification(n._id)}
                                    className="text-red-500 hover:text-red-600 cursor-pointer text-lg lg:text-2xl  transition-transform hover:scale-110"
                                    title="Delete"
                                />
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const getNotificationText = (n) => {
    switch (n.type) {
        case "like":
            return "liked your post ❤️";
        case "comment":
            return "commented on your post 💬";
        case "follow":
            return "started following you 👥";
        case "newPost":
            return "posted something 📝";
        case "profileVisit":
            return "visited your profile 👀";
        case "mention":
            return "mentioned you in a post 🔔";
        case "jobApplication":
            return "applied for your job posting 📄";
        case "jobStatusUpdate":
            return "updated the status of your job application 🚀";
        default:
            return "";
    }
};

export default NotificationsPage;

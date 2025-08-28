import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { FaBell, FaCheckCircle, FaTrashAlt } from "react-icons/fa";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notification/getNotifications");
            setNotifications(res.data.notifications);
        } catch (err) {
            console.error("Failed to fetch notifications:", err);
        } finally {
            setLoading(false);
        }
    };

    const markAllRead = async () => {
        try {
            await api.patch("/notification/markAllAsRead", {}, { withCredentials: true });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error(err);
        }
    };

    const markOneRead = async (id) => {
        try {
            await api.patch(`/notification/markOneAsRead/${id}`, {}, { withCredentials: true });
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notification/deleteNotification/${id}`, { withCredentials: true });
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                    <FaBell /> Notifications
                </h1>
                <button
                    onClick={markAllRead}
                    className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded shadow"
                >
                    Mark All as Read
                </button>
            </div>

            {notifications.length === 0 ? (
                <p className="text-gray-500 text-center mt-10">No notifications yet!</p>
            ) : (
                <div className="space-y-4">
                    {notifications.map((n) => (
                        <div
                            key={n._id}
                            className={`flex justify-between items-center p-4 rounded-lg shadow-md transition ${n.read ? "bg-white" : "bg-orange-50 border-l-4 border-orange-500"
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={n.sender?.profileImage || "/default-avatar.png"}
                                    alt={n.sender?.name}
                                    className="w-12 h-12 rounded-full object-cover border"
                                />
                                <div>
                                    <p className="text-gray-700">
                                        <span className="font-semibold">{n.sender?.name}</span>{" "}
                                        {getNotificationText(n)}
                                    </p>
                                    <p className="text-xs text-gray-400">{dayjs(n.createdAt).fromNow()}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                {!n.read && (
                                    <FaCheckCircle
                                        onClick={() => markOneRead(n._id)}
                                        className="text-green-500 hover:text-green-600 cursor-pointer text-lg transition-transform hover:scale-110"
                                        title="Mark as Read"
                                    />
                                )}
                                <FaTrashAlt
                                    onClick={() => deleteNotification(n._id)}
                                    className="text-red-500 hover:text-red-600 cursor-pointer text-lg transition-transform hover:scale-110"
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

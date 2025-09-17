import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { FaUserCircle } from "react-icons/fa";
import { format, formatDistanceToNow } from "date-fns";

const ProfileVisitsPage = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const res = await api.get(
                    "/user/profileVisits"
                );
                setVisits(res.data.visits || []);
            } catch (err) {
                console.error("Error fetching visits:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVisits();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-tr from-indigo-100 via-white to-purple-100 py-10 px-4 sm:px-10">
            <div className="max-w-6xl mx-auto">

                <div className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        👀 Profile Visits
                    </h1>
                    <span className="text-lg font-semibold text-purple-700 bg-purple-100 px-5 py-2 rounded-full shadow-sm">
                        {visits.length} Visits
                    </span>
                </div>


                {loading ? (
                    <p className="text-center text-gray-600">Loading visits...</p>
                ) : visits.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        No one has visited your profile yet.
                    </p>
                ) : (
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {visits.map((visit, index) => (
                            <div
                                key={index}
                                className="relative bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col items-center text-center"
                            >
                              
                                <div className="w-20 h-20 mb-3">
                                    {visit.user?.profileImage ? (
                                        <img
                                            src={visit.user.profileImage}
                                            alt={visit.user.name}
                                            className="w-20 h-20 rounded-full border-2 border-purple-300 shadow-md object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-20 h-20 text-gray-500" />
                                    )}
                                </div>

                                {/* user info*/}
                                <h3 className="text-lg font-bold text-gray-800">
                                    {visit.user?.name || "Unknown User"}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2">
                                    {visit.user?.headline || "No headline available"}
                                </p>

                                {/* post time  */}
                                <span className="absolute top-3 right-3 text-xs font-medium text-white bg-gradient-to-r from-purple-500 to-indigo-500 px-3 py-1 rounded-full shadow-md">
                                    {format(new Date(visit.visitedAt), "d MMM yyyy")} ·{" "}
                                    {formatDistanceToNow(new Date(visit.visitedAt), { addSuffix: true })}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileVisitsPage;

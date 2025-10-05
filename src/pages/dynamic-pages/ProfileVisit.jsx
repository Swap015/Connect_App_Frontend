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
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                        Profile Visits 👀
                    </h1>
                    <span className="text-base lg:text-lg 2xl:text-xl font-semibold text-purple-700 bg-purple-100 px-2 py-1 lg:px-3 rounded-full shadow-sm">
                        {visits.length} Visits
                    </span>
                </div>


                {loading ? (
                    <div className="flex items-center justify-center h-screen bg-gray-50">
                        <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
                    </div>
                ) : visits.length === 0 ? (
                    <p className="text-center text-gray-500 text-lg">
                        No one has visited your profile yet.
                    </p>
                ) : (
                    <div className="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {visits.map((visit, index) => (
                            <div
                                key={index}
                                className="relative bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-3 flex flex-col items-center text-center w-60"
                            >

                                <div className="w-16 h-16 mb-3">
                                    {visit.user?.profileImage ? (
                                        <img
                                            src={visit.user.profileImage}
                                            alt={visit.user.name}
                                            className="w-20 h-20 rounded-full  object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-20 h-20 text-gray-500" />
                                    )}
                                </div>

                                <h3 className="text-lg lg:text-xl 3xl:text-2xl font-bold text-gray-800">
                                    {visit.user?.name || "Unknown User"}
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-600 mb-2">
                                    {visit.user?.headline || "No headline available"}
                                </p>

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

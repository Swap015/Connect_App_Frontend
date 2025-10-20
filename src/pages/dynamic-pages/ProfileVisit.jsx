import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { FaUserCircle } from "react-icons/fa";
import { format, formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ProfileVisitsPage = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVisits = async () => {
            try {
                const res = await api.get(
                    "/user/profileVisits"
                );
                setVisits(res.data.visits || []);
            } catch {
                toast.error("Error fetching visits");
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
                    <p className="text-center text-gray-500 text-sm md:text-base lg:text-lg ">
                        No one has visited your profile yet.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 justify-center place-items-center">
                        {visits.map((visit, index) => (
                            <div
                                key={index}
                                className="relative bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200 p-3 flex flex-col items-center text-center w-60"
                            >
                                <div onClick={() => navigate(`/profile/${visit.user?._id}`)} className="w-16 h-16 mb-4 cursor-pointer">
                                    {visit.user?.profileImage ? (
                                        <img
                                            src={visit.user.profileImage}
                                            alt={visit.user.name}
                                            className="w-18 h-18 rounded-full  object-cover cursor-pointer"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-20 h-20 text-gray-500" />
                                    )}
                                </div>

                                <h3 onClick={() => navigate(`/profile/${visit.user?._id}`)} className="text-base md:text-lg xl:text-xl 4xl:text-2xl font-bold text-gray-800 cursor-pointer">
                                    {visit.user?.name || "Unknown User"}
                                </h3>
                                <p className="text-xs md:text-sm lg:text-base 2xl:text-lg text-gray-600 mb-2">
                                    {visit.user?.headline}
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

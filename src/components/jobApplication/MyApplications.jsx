import { FaTimes, FaEdit, FaTrash, FaBuilding, FaMapMarkerAlt, FaClipboardList } from "react-icons/fa";

const MyApplicationsModal = ({ applications, onClose, onEdit, onDelete }) => {
    const isLoading = applications === null || applications === undefined;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
            <div className="bg-[#f4f4f4] rounded-lg shadow-xl border border-gray-200 w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                    onClick={onClose}
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-lg md:text-xl lg:text-2xl  font-bold mb-6 text-gray-800">
                    My Applications
                </h2>

                {isLoading && (
                    <div className="flex justify-center py-10">
                        <span className="loading loading-spinner w-12 h-12 text-blue-600"></span>
                    </div>
                )}

                {!isLoading && applications.length === 0 && (
                    <p className="text-red-600 text-sm lg:text-base 2xl:text-lg text-center">
                        No applications yet.
                    </p>
                )}

                {!isLoading && applications.length > 0 && (
                    <ul className="space-y-4">
                        {applications.map((app) => (
                            <li
                                key={app._id}
                                className="px-5 "
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="font-bold text-sm md:text-base lg:text-base  text-gray-800">
                                            {app.job.title}
                                        </p>

                                        <p className="text-xs md:text-sm lg:text-base 2xl:text-lg flex items-center gap-2 text-gray-700">
                                            <FaBuilding className="text-blue-500" /> {app.job.companyName}
                                        </p>

                                        <p className="text-xs md:text-sm lg:text-base 2xl:text-lg flex items-center gap-2 text-gray-700">
                                            <FaMapMarkerAlt className="text-red-500" /> {app.job.location}
                                        </p>

                                        <p className="text-xs md:text-sm lg:text-base 2xl:text-lg flex items-center gap-2 text-gray-900 mt-2">
                                            <FaClipboardList className="text-purple-500" />
                                            Status:{" "}
                                            <span
                                                className={`ml-1 font-bold px-2 py-0.5 rounded text-xs md:text-sm lg:text-base 2xl:text-lg ${app.status === "Pending"
                                                    ? "bg-yellow-300 text-black"
                                                    : app.status === "Shortlisted"
                                                        ? "bg-blue-300 text-blue-700"
                                                        : app.status === "Rejected"
                                                            ? "bg-red-300 text-red-700"
                                                            : "bg-green-200 text-green-700"
                                                    }`}
                                            >
                                                {app.status}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onEdit(app)}
                                            className="btn btn-xs sm:btn-sm lg:btn-base 3xl:btn-lg btn-outline btn-warning font-bold bg-[#fff132] hover:bg-[#ffdf0e] text-black flex items-center gap-1 "
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(app)}
                                            className="btn btn-xs sm:btn-sm lg:btn-base 3xl:btn-lg btn-outline btn-error flex items-center gap-1 font-bold bg-red-500 hover:bg-red-600 text-white"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MyApplicationsModal;

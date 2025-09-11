import { FaTimes, FaEdit, FaTrash, FaBuilding, FaMapMarkerAlt, FaClipboardList } from "react-icons/fa";

const MyApplicationsModal = ({ applications, onClose, onEdit, onDelete }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
            <div className="bg-white rounded-lg shadow-xl border border-gray-200 w-full max-w-3xl p-6 relative max-h-[90vh] overflow-y-auto">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                    onClick={onClose}
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    My Applications
                </h2>

                {applications.length === 0 ? (
                    <p className="text-gray-700 text-center">No applications yet.</p>
                ) : (
                    <ul className="space-y-4">
                        {applications.map((app) => (
                            <li
                                key={app._id}
                                className="px-5 "
                            >
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <p className="font-bold text-lg text-gray-800">
                                            {app.job.title}
                                        </p>

                                        <p className="text-sm flex items-center gap-2 text-gray-700">
                                            <FaBuilding className="text-blue-500" /> {app.job.companyName}
                                        </p>

                                        <p className="text-sm flex items-center gap-2 text-gray-700">
                                            <FaMapMarkerAlt className="text-red-500" /> {app.job.location}
                                        </p>

                                        <p className="text-sm flex items-center gap-2 text-gray-900 mt-2">
                                            <FaClipboardList className="text-purple-500" />
                                            Status:{" "}
                                            <span
                                                className={`ml-1 font-bold px-2 py-0.5 rounded text-xs ${app.status === "Pending"
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
                                            className="btn btn-sm btn-outline btn-warning font-bold bg-yellow-400 hover:bg-yellow-500 text-black flex items-center gap-1"
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button
                                            onClick={() => onDelete(app)}
                                            className="btn btn-sm btn-outline btn-error flex items-center gap-1 font-bold bg-red-400 hover:bg-red-500 text-black"
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

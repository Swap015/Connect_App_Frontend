
import { useState } from "react";
import {
    FaUsers,
    FaBuilding,
    FaEdit,
    FaTrash,
    FaChevronDown,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../../api/axios.js";

export default function JobCard({
    job,
    isRecruiterVerified,
    currentUser,
    onEdit,
    onDelete,
}) {
    const [openDetails, setOpenDetails] = useState(false);
    const [jobDetails, setJobDetails] = useState(null);

    // applicants modal state
    const [openApplicants, setOpenApplicants] = useState(false);
    const [applicants, setApplicants] = useState([]);
    const [loadingApplicants, setLoadingApplicants] = useState(false);

    const fetchJobDetails = async () => {
        try {
            const res = await api.get(`/job/${job._id}`);
            setJobDetails(res.data.job);
            setOpenDetails(true);
        } catch (err) {
            console.error("fetchJobDetails:", err);
            toast.error(err?.response?.data?.msg || "Failed to fetch job details");
        }
    };

    const fetchApplicants = async () => {
        try {
            setLoadingApplicants(true);

            const res = await api.get(`/applications/getApplicants/${job._id}`);
            setApplicants(res.data.applicants || []);
            setOpenApplicants(true);
        } catch (err) {
            console.error("fetchApplicants error:", err);
            toast.error(err?.response?.data?.msg || "Failed to fetch applicants");
        } finally {
            setLoadingApplicants(false);
        }
    };

    return (
        <>
            <article className="bg-white border rounded-lg shadow-lg overflow-hidden flex flex-col">
                <div className="p-4 flex flex-col flex-grow gap-3">
                    <div className="flex justify-between items-start ">
                        <h2 className="text-base lg:text-lg font-bold text-gray-800">
                            {job.title}
                        </h2>

                        {isRecruiterVerified && job.postedBy?._id === currentUser?._id && (
                            <div className="dropdown dropdown-end text-black ">
                                <label tabIndex={0} className="btn btn-ghost btn-sm p-1">
                                    <FaChevronDown />
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content border-gray-300 border menu p-2 shadow-lg bg-white rounded-lg w-40 z-10"
                                >
                                    <li>
                                        <button
                                            onClick={() => onEdit(job)}
                                            className="text-sm lg:text-base flex items-center gap-2 text-blue-600 hover:bg-gray-200"
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => onDelete(job)}
                                            className="flex items-center gap-2 text-red-600 hover:bg-gray-200"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={fetchApplicants}
                                            className="flex items-center gap-2 text-green-600 hover:bg-gray-200"
                                        >
                                            View Applicants
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-gray-600 flex items-center gap-2 font-bold">
                        <FaBuilding /> {job.companyName} — {job.location}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-1 text-base lg:text-lg ">
                        <span className="badge text-xs sm:text-sm lg:text-base bg-blue-100 text-blue-800">
                            {job.jobType}
                        </span>

                        <span
                            className="badge text-xs sm:text-sm lg:text-base bg-gray-100 text-gray-800 flex items-center gap-1 cursor-pointer hover:bg-gray-200"
                            onClick={fetchApplicants}
                            title="Click to view applicants"
                        >
                            <FaUsers /> {job.applications?.length || 0} Applicants
                        </span>
                    </div>

                    <p className="font-bold text-gray-600 text-sm sm:text-base lg:text-lg ">
                        Salary: ₹{job.salaryRange?.min ?? 0} - ₹{job.salaryRange?.max ?? 0}
                    </p>

                    <p className="text-sm sm:text-base text-gray-700 line-clamp-3">
                        {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                        {(job.skills || []).map((s, i) => (
                            <span
                                key={i}
                                className="badge bg-gray-100 text-gray-800 max-w-[8rem] truncate text-xs sm:text-sm lg:text-base"
                                title={s}
                            >
                                {s}
                            </span>
                        ))}
                    </div>

                    <div className="flex justify-end mt-auto">
                        <button
                            className="btn btn-xs sm:btn-sm bg-[#655bff] text-white hover:bg-[#493cfe]"
                            onClick={fetchJobDetails}
                        >
                            View
                        </button>
                    </div>
                </div>
            </article>

            {/* Job details modal */}
            {openDetails && jobDetails && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-3 sm:px-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-lg">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-3 text-gray-800">
                            {jobDetails.title}
                        </h2>

                        <p className="text-gray-600 text-xs sm:text-sm md:text-base font-semibold mb-3 flex items-center gap-2">
                            <FaBuilding /> {jobDetails.companyName} — {jobDetails.location}
                        </p>

                        <p className="font-semibold mb-3 text-gray-700 text-sm sm:text-base md:text-lg">
                            Salary: ₹{jobDetails.salaryRange?.min ?? 0} - ₹
                            {jobDetails.salaryRange?.max ?? 0}
                        </p>

                        <div className="mb-4">
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                Description:
                            </h3>
                            <p className="text-gray-700 text-xs sm:text-sm mt-1 whitespace-pre-wrap break-words leading-relaxed">
                                {jobDetails.description}
                            </p>
                        </div>

                        {jobDetails.skills?.length > 0 && (
                            <div className="mb-4">
                                <h3 className="font-semibold text-sm sm:text-base text-gray-800">
                                    Skills
                                </h3>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {jobDetails.skills.map((s, i) => (
                                        <span
                                            key={i}
                                            className="badge bg-gray-100 text-gray-800 max-w-[10rem] truncate text-xs sm:text-sm"
                                            title={s}
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end mt-4">
                            <button
                                className="btn btn-sm sm:btn-md bg-gray-200 text-gray-800 hover:bg-gray-300"
                                onClick={() => setOpenDetails(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Applicants modal */}
            {openApplicants && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-3 sm:px-4">
                    <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-bold">Applicants</h2>
                            <button
                                className="btn btn-sm btn-ghost"
                                onClick={() => setOpenApplicants(false)}
                            >
                                Close
                            </button>
                        </div>

                        {loadingApplicants ? (
                            <div className="text-center py-10">Loading...</div>
                        ) : applicants.length === 0 ? (
                            <div className="text-center py-10 text-gray-500">No applicants yet.</div>
                        ) : (
                            <div className="space-y-4">
                                {applicants.map((app) => (
                                    <div
                                        key={app._id}
                                        className="border p-3 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                                    >
                                        <div>
                                            <p className="font-bold">
                                                {app.applicant?.name || "Unknown Applicant"}
                                            </p>
                                            <p className="text-sm text-gray-600">{app.applicant?.email}</p>
                                            <p className="text-sm text-gray-600">Status: {app.status}</p>
                                            {app.coverLetter && (
                                                <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                                                    <strong>Cover Letter:</strong>
                                                    <br />
                                                    {app.coverLetter}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex gap-2 mt-2 sm:mt-0">
                                            {app.resumeUrl && (
                                                <a
                                                    href={app.resumeUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-xs bg-blue-600 text-white"
                                                >
                                                    View Resume
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

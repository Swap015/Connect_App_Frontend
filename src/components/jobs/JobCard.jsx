import { useState } from "react";
import { FaUsers, FaBuilding, FaEdit, FaTrash, FaChevronDown } from "react-icons/fa";
import api from "../../api/axios.js";

export default function JobCard({ job, isRecruiterVerified, currentUser, onEdit, onDelete }) {
    const [openDetails, setOpenDetails] = useState(false);
    const [jobDetails, setJobDetails] = useState(null);

    const fetchJobDetails = async () => {
        try {
            const res = await api.get(`/job/${job._id}`);
            setJobDetails(res.data.job);
            setOpenDetails(true);
        } catch {
            alert("Failed to fetch job details");
        }
    };

    return (
        <>
            <article className="bg-white border rounded-lg shadow-lg overflow-hidden">
                <div className="p-4 flex flex-col gap-3">
                   
                    <div className="flex justify-between items-start">
                        <h2 className="text-lg font-bold text-gray-800">{job.title}</h2>

                        {isRecruiterVerified && job.postedBy?._id === currentUser?._id && (
                            <div className="dropdown dropdown-end text-black ">
                                <label tabIndex={0} className="btn btn-ghost btn-sm p-1">
                                    <FaChevronDown />
                                </label>
                                <ul
                                    tabIndex={0}
                                    className="dropdown-content border-gray-300 border-1 menu p-2 shadow-lg bg-white rounded-lg w-40 z-10"
                                >
                                    <li>
                                        <button onClick={() => onEdit(job)} className="flex items-center gap-2 text-blue-600 hover:bg-gray-200">
                                            <FaEdit /> Edit
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => onDelete(job)}
                                            className="flex items-center gap-2 text-red-600  hover:bg-gray-200"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>

                    
                    <p className="text-sm text-gray-600 flex items-center gap-2 font-bold">
                        <FaBuilding /> {job.companyName} — {job.location}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-1">
                        <span className="badge bg-blue-100 text-blue-800">{job.jobType}</span>
                        <span className="badge bg-gray-100 text-gray-800 flex items-center gap-1">
                            <FaUsers /> {job.applicantsCount || 0} Applicants
                        </span>
                    </div>

                    {/* Salary */}
                    <p className="font-semibold text-gray-600 text-lg">
                        Salary: ₹{job.salaryRange?.min ?? 0} - ₹{job.salaryRange?.max ?? 0}
                    </p>

                    {/*job Description */}
                    <p className="text-sm text-gray-700 line-clamp-3">
                        {job.description}
                    </p>

                    {/* skills */}
                    <div className="flex flex-wrap gap-2 mt-2">
                        {(job.skills || []).map((s, i) => (
                            <span
                                key={i}
                                className="badge bg-gray-100 text-gray-800 max-w-[8rem] truncate"
                                title={s}
                            >
                                {s}
                            </span>
                        ))}
                    </div>

                    {/* view btn */}
                    <div className="flex justify-end mt-3">
                        <button
                            className="btn btn-sm bg-[#655bff] text-white hover:bg-[#493cfe]"
                            onClick={fetchJobDetails}
                        >
                            View
                        </button>
                    </div>
                </div>
            </article>

            {/* modal with full details */}
            {openDetails && jobDetails && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{jobDetails.title}</h2>
                        <p className="text-gray-600 text-sm font-semibold mb-4 flex items-center gap-2">
                            <FaBuilding /> {jobDetails.companyName} — {jobDetails.location}
                        </p>

                        <p className="font-semibold mb-3 text-gray-700 text-base">
                            Salary: ₹{jobDetails.salaryRange?.min ?? 0} - ₹{jobDetails.salaryRange?.max ?? 0}
                        </p>

                      
                        <div className="mb-5">
                            <h3 className="font-semibold text-black text-base">Description:</h3>
                            <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap break-words leading-relaxed">
                                {jobDetails.description}
                            </p>
                        </div>

                    
                        {jobDetails.skills?.length > 0 && (
                            <div className="mb-5">
                                <h3 className="font-semibold text-base text-gray-800">Skills</h3>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {jobDetails.skills.map((s, i) => (
                                        <span
                                            key={i}
                                            className="badge bg-gray-100 text-gray-800 max-w-[10rem] truncate"
                                            title={s}
                                        >
                                            {s}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                       
                        {jobDetails.requirements?.length > 0 && (
                            <div className="mb-5">
                                <h3 className="font-semibold text-base text-gray-800">Requirements</h3>
                                <ul className="list-disc list-inside text-gray-700 text-sm mt-2 space-y-1">
                                    {jobDetails.requirements.map((r, i) => (
                                        <li
                                            key={i}
                                            className="whitespace-pre-wrap break-words leading-relaxed"
                                        >
                                            {r}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex justify-end mt-4">
                            <button
                                className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                                onClick={() => setOpenDetails(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

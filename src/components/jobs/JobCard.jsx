import { FaUsers, FaBuilding, FaEdit, FaTrash, FaChevronDown } from "react-icons/fa";
import api from "../../api/axios.js";
import { toast } from "react-toastify";

export default function JobCard({ job, isRecruiterVerified, currentUser, onEdit, onDelete }) {
    return (
        <article className="card bg-base-100 border hover:shadow-lg transition-shadow">
            <div className="card-body">
                <div className="flex justify-between">
                    <h2 className="card-title">{job.title}</h2>
                    {isRecruiterVerified && job.postedBy?._id === currentUser?.id && (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-sm">
                                <FaChevronDown />
                            </label>
                            <ul
                                tabIndex={0}
                                className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-44"
                            >
                                <li>
                                    <button onClick={() => onEdit(job)}>
                                        <FaEdit /> Edit
                                    </button>
                                </li>
                                <li>
                                    <button onClick={() => onDelete(job)} className="text-red-500">
                                        <FaTrash /> Delete
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FaBuilding /> {job.companyName}
                </p>
                <p className="text-sm">{job.location}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                    <span className="badge badge-primary">{job.jobType}</span>
                    <span className="badge badge-ghost flex items-center gap-2">
                        <FaUsers /> {job.applicantsCount || 0} Applicants
                    </span>
                </div>

                <p className="mt-3 font-semibold">
                    Salary: ₹{job.salaryRange?.min ?? 0} - ₹{job.salaryRange?.max ?? 0}
                </p>

                <p className="mt-3 text-sm text-gray-700 line-clamp-3">{job.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                    {(job.skills || []).map((s, i) => (
                        <span key={i} className="badge badge-outline">
                            {s}
                        </span>
                    ))}
                </div>

                <div className="card-actions justify-end mt-4">
                    <button
                        className="btn btn-sm btn-outline"
                        onClick={async () => {
                            try {
                                const res = await api.get(`/job/${job._id}`);
                                const j = res.data.job;
                                toast.info(
                                    <div>
                                        <b>{j.title}</b>
                                        <div className="mt-2 text-sm">{j.description}</div>
                                    </div>,
                                    { autoClose: 5000 }
                                );
                            } catch {
                                toast.error("Failed to fetch job details");
                            }
                        }}
                    >
                        View
                    </button>
                </div>
            </div>
        </article>
    );
}

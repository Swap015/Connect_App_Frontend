import { useState, useEffect } from "react";
import {
    FaBuilding,
    FaMapMarkerAlt,
    FaMoneyBillWave,
    FaBriefcase,
    FaTimes,
    FaCheckCircle,
    FaUserTie,
    FaUsers,
} from "react-icons/fa";
import api from "../../api/axios.js";

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [applyJob, setApplyJob] = useState(null);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchJobs();
        fetchCurrentUser();
    }, []);

    const fetchJobs = async () => {
        try {
            const res = await api.get("/job");
            setJobs(res.data.jobs);
        } catch (err) {
            console.error("Failed to fetch jobs", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCurrentUser = async () => {
        try {
            const res = await api.get("/user/me");
            setUser(res.data.user);
        } catch (err) {
            console.error("Failed to fetch current user", err);
        }
    };

   
    const handleApplySubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append("jobId", applyJob._id);

        try {
            await api.post("/applications/apply", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            await fetchJobs();

            setApplyJob(null); 
            alert("Application submitted successfully!");
        } catch (err) {
            console.error("Failed to apply", err);
            alert(err.response?.data?.msg || "Something went wrong");
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto bg-white">
            <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
                Jobs
            </h1>

            {loading ? (
                <p className="text-center text-gray-500">Loading jobs...</p>
            ) : jobs.length === 0 ? (
                <p className="text-center text-gray-500">
                    No jobs available right now.
                </p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {jobs.map((job) => (
                        <div
                            key={job._id}
                            onClick={(e) => {
                                
                                if (e.target.tagName !== "BUTTON") setSelectedJob(job);
                            }}
                            className="bg-white shadow-md border rounded-lg p-5 hover:shadow-lg transition cursor-pointer"
                        >
                            <h2 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                <FaBriefcase className="text-blue-500" /> {job.title}
                            </h2>
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                <FaBuilding className="text-gray-500" /> {job.companyName}
                            </p>
                            <p className="text-sm text-gray-700 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-red-500" /> {job.location}
                            </p>
                            {job.salaryRange?.min > 0 && (
                                <p className="text-sm text-gray-700 flex items-center gap-2">
                                    <FaMoneyBillWave className="text-green-500" /> ₹
                                    {job.salaryRange.min} - ₹{job.salaryRange.max}
                                </p>
                            )}

                            <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                                {job.description}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                {job.skills.slice(0, 3).map((skill, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-medium"
                                    >
                                        {skill}
                                    </span>
                                ))}
                                {job.skills.length > 3 && (
                                    <span className="text-xs text-gray-400">
                                        +{job.skills.length - 3} more
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-gray-600 mt-3 flex items-center gap-2">
                                <FaUsers className="text-purple-500" />
                                Applicants: {job.applications?.length || 0}
                            </p>

                            {user?.role === "user" && (
                                <button
                                    onClick={() => setApplyJob(job)}
                                    className="btn btn-sm btn-primary w-full mt-4"
                                >
                                    Apply Now
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* job details modal */}
            {selectedJob && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                            onClick={() => setSelectedJob(null)}
                        >
                            <FaTimes size={20} />
                        </button>

                        <h2 className="text-2xl font-bold mb-2 text-gray-800 flex items-center gap-2">
                            <FaBriefcase className="text-blue-500" /> {selectedJob.title}
                        </h2>
                        <p className="text-gray-700 mb-1 flex items-center gap-2">
                            <FaBuilding className="text-gray-500" /> {selectedJob.companyName}
                        </p>
                        <p className="text-gray-700 mb-1 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-red-500" /> {selectedJob.location}
                        </p>
                        {selectedJob.salaryRange?.min > 0 && (
                            <p className="text-gray-700 mb-4 flex items-center gap-2">
                                <FaMoneyBillWave className="text-green-500" /> ₹
                                {selectedJob.salaryRange.min} - ₹{selectedJob.salaryRange.max}
                            </p>
                        )}

                        <h3 className="text-lg font-semibold text-gray-800 mt-4">Job Description</h3>
                        <p className="text-gray-600 whitespace-pre-line mt-2">
                            {selectedJob.description}
                        </p>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4">Requirements</h3>
                        <ul className="list-disc list-inside text-gray-600 mt-2">
                            {selectedJob.requirements.map((req, i) => (
                                <li key={i} className="flex items-center gap-2">
                                    <FaCheckCircle className="text-green-500" /> {req}
                                </li>
                            ))}
                        </ul>

                        <h3 className="text-lg font-semibold text-gray-800 mt-4">Skills</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {selectedJob.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>

                        <p className="text-sm text-gray-600 mt-6 flex items-center gap-2">
                            <FaUsers className="text-purple-500" /> Applicants:{" "}
                            {selectedJob.applications?.length || 0}
                        </p>

                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-2">
                            <FaUserTie className="text-purple-500" /> Posted by:{" "}
                            {selectedJob.postedBy?.name || "Recruiter"}
                        </p>
                    </div>
                </div>
            )}

            {/* Apply Modal */}
            {applyJob && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 px-4">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                        <button
                            className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                            onClick={() => setApplyJob(null)}
                        >
                            <FaTimes size={20} />
                        </button>

                        <h2 className="text-2xl font-bold mb-4 text-gray-800">
                            Apply for {applyJob.title}
                        </h2>

                        <form className="space-y-4" onSubmit={handleApplySubmit}>
                            <textarea
                                name="coverLetter"
                                className="textarea textarea-bordered w-full"
                                placeholder="Write your cover letter..."
                                rows={4}
                            />
                            <input
                                type="file"
                                name="resume"
                                accept=".pdf,.doc,.docx"
                                className="file-input file-input-bordered w-full"
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    className="btn"
                                    onClick={() => setApplyJob(null)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Submit Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Jobs;


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios.js";

import ApplyJobForm from "../../components/jobApplication/ApplyJobForm.jsx";
import MyApplications from "../../components/jobApplication/MyApplications.jsx";
import ApplicantsList from "../../components/jobApplication/ApplicantsList.jsx";

const JobApplications = ({ currentUser }) => {
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchJob = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/job/${jobId}`, { withCredentials: true });
            setJob(res.data.job);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch job details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobId) fetchJob();
    }, [jobId]);

    if (loading) return <p className="p-6 text-gray-500">Loading job details...</p>;
    if (!job) return <p className="p-6 text-gray-500">Job not found</p>;

    const isRecruiter = currentUser?.role === "recruiter";
    const isUser = currentUser?.role === "user";

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            {/* Job Info */}
            <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{job.title}</h1>
                <p className="text-gray-600">{job.companyName} • {job.location}</p>
                <p className="mt-3 text-gray-700">{job.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                    Applicants: {job.applicantsCount || 0}
                </div>
            </div>

            {/* Conditional UI based on role */}
            {isUser && (
                <>
                    <ApplyJobForm jobId={job._id} jobTitle={job.title} onApplied={fetchJob} />
                    <div className="mt-8">
                        <MyApplications />
                    </div>
                </>
            )}

            {isRecruiter && (
                <div className="mt-8">
                    <ApplicantsList jobId={job._id} />
                </div>
            )}
        </div>
    );
};

export default JobApplications;

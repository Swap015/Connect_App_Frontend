// components/jobs/ApplicantsList.jsx
import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const ApplicantsList = ({ jobId }) => {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(false);
    const [changingId, setChangingId] = useState(null);
    const [statusUpdating, setStatusUpdating] = useState(false);

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/jobs/getApplicants/${jobId}`, { withCredentials: true });
            // backend returns { applicants }
            setApplicants(res.data.applicants || []);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch applicants");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (jobId) fetchApplicants();
    }, [jobId]);

    const changeStatus = async (applicationId, newStatus) => {
        if (!confirm(`Set status to "${newStatus}"?`)) return;
        setChangingId(applicationId);
        setStatusUpdating(true);
        try {
            const res = await api.put(`/jobs/updateStatus/${applicationId}`, { status: newStatus }, { withCredentials: true });
            alert(res.data?.msg || "Status updated");
            fetchApplicants();
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        } finally {
            setStatusUpdating(false);
            setChangingId(null);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">Applicants</h2>

            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : applicants.length === 0 ? (
                <p className="text-gray-500">No applicants yet.</p>
            ) : (
                <div className="space-y-3">
                    {applicants.map((app) => (
                        <div key={app._id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row md:justify-between gap-3">
                            <div>
                                <h3 className="font-semibold">{app.applicant?.name}</h3>
                                <p className="text-sm text-gray-500">{app.applicant?.email} • {app.applicant?.location}</p>
                                <p className="text-sm mt-2">{app.applicant?.skills?.join(", ")}</p>
                                <p className="text-sm mt-2 text-gray-700"><span className="font-medium">Cover:</span> {app.coverLetter || <span className="text-gray-400">No cover</span>}</p>
                                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="text-indigo-600 text-sm mt-1 inline-block">Open resume</a>
                            </div>

                            <div className="flex flex-col items-start md:items-end gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-medium">Status:</span>
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold"
                                        style={{ background: statusColor(app.status), color: statusTextColor(app.status) }}>
                                        {app.status}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    {["Pending", "Shortlisted", "Rejected", "Hired"].map((s) => (
                                        <button
                                            key={s}
                                            disabled={statusUpdating && changingId === app._id}
                                            onClick={() => changeStatus(app._id, s)}
                                            className="text-xs px-3 py-1 rounded border hover:bg-gray-50"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>

                                <span className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// small helpers to color status badges
function statusColor(status) {
    switch ((status || "").toLowerCase()) {
        case "shortlisted": return "#FEF9C3"; // yellow-50
        case "rejected": return "#FEE2E2"; // red-50
        case "hired": return "#DCFCE7"; // green-50
        default: return "#EFF6FF"; // blue-50 (pending)
    }
}
function statusTextColor(status) {
    switch ((status || "").toLowerCase()) {
        case "shortlisted": return "#92400E";
        case "rejected": return "#991B1B";
        case "hired": return "#065F46";
        default: return "#1E40AF";
    }
}

export default ApplicantsList;

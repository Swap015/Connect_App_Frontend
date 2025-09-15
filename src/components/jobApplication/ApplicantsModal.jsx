import { useEffect, useState } from "react";
import api from "../../api/axios.js";

export default function ApplicantsModal({ jobId, onClose }) {
    const [loading, setLoading] = useState(false);
    const [applicants, setApplicants] = useState([]);

    const fetchApplicants = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/application/getApplicants/${jobId}`);
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

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 px-3 sm:px-4">
            <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-xl max-h-[80vh] overflow-y-auto shadow-lg">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                    Applicants
                </h2>

                {loading ? (
                    <div className="flex justify-center py-10">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : applicants.length === 0 ? (
                    <p className="text-gray-500 text-center py-6">
                        No applicants for this job yet.
                    </p>
                ) : (
                    <ul className="space-y-4">
                        {applicants.map((app) => (
                            <li
                                key={app._id}
                                className="p-3 border rounded-lg bg-gray-50 flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {app.applicant?.name || "Unknown"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {app.applicant?.email}
                                    </p>
                                </div>
                                <a
                                    href={app.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-sm bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    View Resume
                                </a>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex justify-end mt-6">
                    <button
                        className="btn btn-sm bg-gray-200 text-gray-800 hover:bg-gray-300"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

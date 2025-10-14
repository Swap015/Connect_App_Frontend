
import { useState } from "react";
import api from "../../../api/axios.js";
import { toast } from "react-toastify";

export default function ApplicantStatus({ applicant, jobId, onStatusChange }) {
    const [status, setStatus] = useState(applicant.status);

    const statuses = ["Pending", "Shortlisted", "Rejected", "Hired"];


    const handleChange = async (newStatus) => {
        try {
            setStatus(newStatus);


            const res = await api.put(`/applications/updateStatus/${jobId}/${applicant._id}`, {
                status: newStatus,
            });

            toast.success(res.data?.msg || "Status updated");
            if (onStatusChange) onStatusChange(applicant._id, newStatus);
        } catch {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Status:</label>
            <select
                value={status}
                onChange={(e) => handleChange(e.target.value)}
                className="select select-sm border bg-white border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500"
            >
                {statuses.map((s) => (
                    <option key={s} value={s}>
                        {s}
                    </option>
                ))}
            </select>
        </div>
    );
}

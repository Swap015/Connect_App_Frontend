import { useState } from "react";
import api from "../../api/axios.js";

const ApplyJobModal = ({ job, onClose, onSuccess }) => {
    const [coverLetter, setCoverLetter] = useState("");
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleApply = async (e) => {
        e.preventDefault();
        if (!resume) {
            alert("Please upload a resume");
            return;
        }

        const formData = new FormData();
        formData.append("jobId", job._id);
        formData.append("coverLetter", coverLetter);
        formData.append("resume", resume);

        try {
            setLoading(true);
            await api.post("/applications/apply", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            alert("✅ Applied successfully!");
            onClose();
            onSuccess();
        } catch (err) {
            alert(err.response?.data?.msg || "Failed to apply");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-2xl">
                <h2 className="font-bold text-xl mb-4">Apply for {job.title}</h2>
                <form onSubmit={handleApply} className="space-y-4">
                    <textarea
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                        placeholder="Write your cover letter..."
                        className="textarea textarea-bordered w-full"
                        rows={4}
                    />
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => setResume(e.target.files[0])}
                        className="file-input file-input-bordered w-full"
                    />
                    <div className="modal-action">
                        <button type="button" className="btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? "Applying..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyJobModal;

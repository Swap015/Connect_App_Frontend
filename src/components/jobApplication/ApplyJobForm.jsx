
import { useState } from "react";
import api from "../../api/axios.js";

const ApplyJobForm = ({ jobId, jobTitle, onApplied }) => {
    const [coverLetter, setCoverLetter] = useState("");
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!resumeFile) {
            alert("Please upload your resume (PDF preferred).");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("jobId", jobId);
            formData.append("coverLetter", coverLetter);
            formData.append("resume", resumeFile);

            const res = await api.post("/jobs/apply", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            alert(res.data?.msg || "Applied successfully");
            setCoverLetter("");
            setResumeFile(null);
            if (onApplied) onApplied();
        } catch (err) {
            console.error(err);
            const msg = err?.response?.data?.msg || "Failed to apply";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg shadow-md p-5 max-w-2xl mx-auto"
        >
            <h3 className="text-lg font-semibold mb-3">Apply for: <span className="text-indigo-600">{jobTitle}</span></h3>

            <label className="block mb-2 text-sm font-medium text-gray-700">Resume (PDF / DOCX)</label>
            <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="w-full text-sm text-gray-700 file:border-0 file:bg-indigo-50 file:py-2 file:px-3 rounded-lg"
            />
            {resumeFile && (
                <p className="mt-2 text-xs text-gray-600">
                    Selected: <span className="font-medium">{resumeFile.name}</span>
                </p>
            )}

            <label className="block mt-4 mb-2 text-sm font-medium text-gray-700">Cover Letter (optional)</label>
            <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
                placeholder="Write a short cover letter..."
                className="w-full border rounded-lg p-3 text-sm resize-none"
            />

            <div className="mt-4 flex items-center gap-3">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-60"
                >
                    {loading ? "Applying..." : "Apply"}
                </button>
                <p className="text-sm text-gray-500">We will notify the recruiter and store your resume securely.</p>
            </div>
        </form>
    );
};

export default ApplyJobForm;

import { useState, useEffect } from "react";
import { FaTimes, FaFilePdf } from "react-icons/fa";
import api from "../../api/axios.js";
import { toast } from "react-toastify";

const EditApplicationModal = ({ application, onClose, onUpdated }) => {
    const [coverLetter, setCoverLetter] = useState(application.coverLetter || "");
    const [resumeFile, setResumeFile] = useState(null); // stores File object for new upload
    const [resumeName, setResumeName] = useState(""); // stores display name
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setCoverLetter(application.coverLetter || "");
        setResumeFile(null);

        // If there’s already a resume, store its original name for display
        if (application.resumeName) {
            setResumeName(application.resumeName);
        } else if (application.resumeUrl) {
            // fallback: extract filename from URL
            const parts = application.resumeUrl.split("/");
            setResumeName(parts[parts.length - 1]);
        } else {
            setResumeName("");
        }
    }, [application]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setResumeFile(file);
            setResumeName(file.name); // show the actual file name
        }
    };

    const handleRemoveResume = () => {
        setResumeFile(null);
        setResumeName("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("coverLetter", coverLetter);
        if (resumeFile) {
            formData.append("resume", resumeFile);
        }

        try {
            setLoading(true);
            await api.put(`/applications/editApplication/${application._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            toast.success("Application updated successfully!");
            onUpdated();
            onClose();
        } catch (err) {
            console.error("Failed to update application", err);
            toast.error(err.response?.data?.msg || "Update failed!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-black">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg relative">

                <button
                    className="absolute top-3 right-3 btn btn-sm btn-circle btn-ghost"
                    onClick={onClose}
                >
                    <FaTimes size={18} />
                </button>

                <h2 className="text-xl font-semibold mb-4">Edit Application</h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <textarea
                        className="textarea textarea-bordered w-full"
                        rows={4}
                        value={coverLetter}
                        onChange={(e) => setCoverLetter(e.target.value)}
                    />

                    {/* PDF icon with original file name */}
                    {resumeName && (
                        <div className="flex items-center justify-between border p-3 rounded">
                            <div className="flex items-center gap-2">
                                <FaFilePdf className="text-red-500" />
                                <span className="truncate max-w-xs">{resumeName}</span>
                            </div>
                            <button
                                type="button"
                                className="btn btn-xs btn-circle btn-error text-white"
                                onClick={handleRemoveResume}
                            >
                                <FaTimes size={12} />
                            </button>
                        </div>
                    )}

                    {/* File input if no file */}
                    {!resumeName && (
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="file-input file-input-bordered w-full"
                        />
                    )}

                    <div className="flex justify-end gap-3">
                        <button type="button" className="btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    Saving
                                    <span className="loading loading-spinner loading-sm"></span>
                                </span>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditApplicationModal;

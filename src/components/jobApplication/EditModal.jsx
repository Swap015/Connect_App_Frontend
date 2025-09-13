import { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import api from "../../api/axios.js";
import { toast } from "react-toastify";

const EditApplicationModal = ({ application, onClose, onUpdated }) => {
    const [coverLetter, setCoverLetter] = useState(application.coverLetter || "");
    const [resumeUrl, setResumeUrl] = useState(application.resumeUrl || null);
    const [newResume, setNewResume] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setResumeUrl(application.resumeUrl || null);
        setNewResume(null);
    }, [application]);

    const getPreviewUrl = (url) => {
        if (!url) return null;
        return url.includes("/upload/") ? url.replace("/upload/", "/upload/fl_inline/") : url;
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewResume(file);
            setResumeUrl(URL.createObjectURL(file));
        }
    };

    const handleRemoveResume = () => {
        setResumeUrl(null);
        setNewResume(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("coverLetter", coverLetter);
        if (newResume) {
            formData.append("resume", newResume);
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

                    {/* resume preview */}
                    {resumeUrl && (
                        <div className="border p-3 rounded relative">

                            <button
                                type="button"
                                className="absolute top-2 right-2 btn btn-xs btn-circle btn-error text-white"
                                onClick={handleRemoveResume}
                            >
                                <FaTimes size={14} />
                            </button>

                            <iframe
                                src={resumeUrl.startsWith("blob:") ? resumeUrl : getPreviewUrl(resumeUrl)}
                                className="w-full h-64 border rounded"
                                title="Resume Preview"
                            />
                        </div>
                    )}

                    {!resumeUrl && (
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
                        <button type="submit" className="btn btn-primary" >
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

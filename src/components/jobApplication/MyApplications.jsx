
import { useEffect, useState } from "react";
import api from "../../api/axios.js";

const MyApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editCover, setEditCover] = useState("");
    const [editResume, setEditResume] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const res = await api.get("/jobs/userApplications", { withCredentials: true });
            setApplications(res.data.applications || []);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleDelete = async (id) => {
        if (!confirm("Delete this application?")) return;
        try {
            await api.delete(`/jobs/delete/${id}`);
            setApplications((s) => s.filter((a) => a._id !== id));
            alert("Deleted");
        } catch (err) {
            console.error(err);
            alert("Failed to delete");
        }
    };

    const startEdit = (app) => {
        setEditingId(app._id);
        setEditCover(app.coverLetter || "");
        setEditResume(null);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditCover("");
        setEditResume(null);
    };

    const submitEdit = async (applicationId) => {
        setActionLoading(true);
        try {
            const fd = new FormData();
            fd.append("coverLetter", editCover || "");
            if (editResume) fd.append("resume", editResume);

            const res = await api.put(`/jobs/editApplication/${applicationId}`, fd, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            alert(res.data?.msg || "Application updated");
            cancelEdit();
            fetchApplications();
        } catch (err) {
            console.error(err);
            alert("Failed to update application");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-4">My Applications</h2>

            {loading ? (
                <p className="text-gray-500">Loading...</p>
            ) : applications.length === 0 ? (
                <p className="text-gray-500">You haven't applied to any jobs yet.</p>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <div key={app._id} className="bg-white rounded-lg shadow-sm p-4 flex flex-col md:flex-row md:justify-between gap-3">
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{app.job?.title}</h3>
                                <p className="text-sm text-gray-500">{app.job?.companyName} • {app.job?.location}</p>
                                <p className="text-sm mt-2 text-gray-700"><span className="font-medium">Status:</span> {app.status}</p>
                                <p className="text-sm mt-2 text-gray-600 break-words">
                                    <span className="font-medium">Cover:</span> {app.coverLetter ? app.coverLetter : <span className="text-gray-400">No cover letter</span>}
                                </p>
                                <a href={app.resumeUrl} target="_blank" rel="noreferrer" className="inline-block mt-2 text-sm text-indigo-600">View resume</a>
                            </div>

                            <div className="flex flex-col gap-2 items-start md:items-end">
                                {editingId === app._id ? (
                                    <>
                                        <textarea value={editCover} onChange={(e) => setEditCover(e.target.value)} className="border rounded p-2 w-64 text-sm" rows={3} />
                                        <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setEditResume(e.target.files[0])} />
                                        <div className="flex gap-2">
                                            <button onClick={() => submitEdit(app._id)} disabled={actionLoading} className="bg-indigo-600 text-white px-3 py-1 rounded">Save</button>
                                            <button onClick={cancelEdit} className="px-3 py-1 rounded border">Cancel</button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => startEdit(app)} className="px-3 py-1 rounded border hover:bg-gray-50">Edit</button>
                                        <button onClick={() => handleDelete(app._id)} className="px-3 py-1 rounded bg-red-50 text-red-600">Delete</button>
                                    </>
                                )}
                                <span className="text-xs text-gray-400">{new Date(app.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyApplications;

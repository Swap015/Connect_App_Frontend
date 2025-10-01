import { useEffect, useState } from "react";
import api from "../../../api/axios.js";

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobToDelete, setJobToDelete] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await api.get("/admin/getJobs");
                setJobs(res.data.jobs);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    const toggleStatus = async (id) => {
        await api.patch(`/admin/${id}/toggle-status`);
        setJobs(
            jobs.map((j) =>
                j._id === id ? { ...j, isJobActive: !j.isJobActive } : j
            )
        );
    };

    const confirmDelete = async () => {
        if (!jobToDelete) return;
        await api.delete(`/admin/${jobToDelete}`);
        setJobs(jobs.filter((j) => j._id !== jobToDelete));
        setJobToDelete(null);
        document.getElementById("delete_modal").close();
    };


    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
            </div>
        );

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center text-gray-800">
                Jobs Management
            </h1>

            {jobs.length === 0 ? (
                <p className="text-center text-sm text-red-600 mt-10 font-semibold">
                    No jobs available
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {jobs.map((j) => (
                        <div
                            key={j._id}
                            className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2"
                        >
                            <div>
                                <p className="text-blue-700 font-bold text-lg">{j.title}</p>
                                <p className="text-sm text-gray-500">
                                    Posted by: {j.postedBy.name}
                                </p>
                                <p
                                    className={`text-sm font-semibold ${j.isJobActive ? "text-green-600" : "text-red-600"
                                        }`}
                                >
                                    {j.isJobActive ? "Active" : "Inactive"}
                                </p>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button
                                    onClick={() => toggleStatus(j._id)}
                                    className="btn btn-warning btn-sm text-black"
                                >
                                    Change Status
                                </button>
                                <button
                                    onClick={() => {
                                        setJobToDelete(j._id);
                                        document.getElementById("delete_modal").showModal();
                                    }}
                                    className="btn btn-error btn-sm text-black"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <dialog id="delete_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-red-500">Delete Job?</h3>
                    <p className="py-4 text-gray-700 text-sm">
                        Are you sure you want to delete this job? This action cannot be
                        undone.
                    </p>
                    <div className="modal-action">
                        <form method="dialog" className="flex gap-2">
                            <button className="btn">Cancel</button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="btn btn-error"
                            >
                                Delete
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AdminJobs;

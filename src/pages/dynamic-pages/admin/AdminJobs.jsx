import { useEffect, useState } from "react";
import api from "../../../api/axios.js";

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

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
        setJobs(jobs.map(j => j._id === id ? { ...j, isJobActive: !j.isJobActive } : j));
    };

    const deleteJob = async (id) => {
        if (!confirm("Delete this job?")) return;
        await api.delete(`/admin/${id}`);
        setJobs(jobs.filter(j => j._id !== id));
    };

    if (loading) return <p className="text-center mt-10">Loading jobs...</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center text-gray-800">Jobs Management</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {jobs.map(j => (
                    <div key={j._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2">
                        <div>
                            <p className="text-blue-700 font-bold text-lg">{j.title}</p>
                            <p className="text-sm text-gray-500">Posted by: {j.postedBy.name}</p>
                            <p className={`text-sm font-semibold ${j.isJobActive ? "text-green-600" : "text-red-600"}`}>
                                {j.isJobActive ? "Active" : "Inactive"}
                            </p>
                        </div>
                        <div className="flex gap-2 mt-2">
                            <button onClick={() => toggleStatus(j._id)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">
                                Change Status
                            </button>
                            <button onClick={() => deleteJob(j._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminJobs;

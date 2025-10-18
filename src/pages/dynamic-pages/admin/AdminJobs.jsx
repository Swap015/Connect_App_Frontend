import { useEffect, useState } from "react";
import api from "../../../api/axios.js";
import { toast } from "react-toastify";

const AdminJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [recruiters, setRecruiters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [jobToDelete, setJobToDelete] = useState(null);

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, usersRes] = await Promise.all([
                    api.get("/admin/getJobs"),
                    api.get("/admin/getusers")
                ]);
                setJobs(jobsRes.data.jobs || []);
               
                const recruiterList = usersRes.data.filter(u => u.role === "recruiter");
                setRecruiters(recruiterList);
            } catch  {
                toast.error("Failed to load data!");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

   
    const toggleStatus = async (id) => {
        try {
            await api.patch(`/admin/${id}/toggle-status`);
            setJobs(jobs.map(j => j._id === id ? { ...j, isJobActive: !j.isJobActive } : j));
        } catch {
            toast.error("Failed to update job status!");
        }
    };

 
    const confirmDelete = async () => {
        if (!jobToDelete) return;
        try {
            await api.delete(`/admin/${jobToDelete}`);
            setJobs(jobs.filter(j => j._id !== jobToDelete));
            setJobToDelete(null);
            document.getElementById("delete_modal").close();
        } catch {
            toast.error("Failed to delete job!");
        }
    };

    
    const toggleVerifyRecruiter = async (id) => {
        try {
            const res = await api.patch(`/admin/verifyRecruiter/${id}`);
            setRecruiters(recruiters.map(r => r._id === id ? { ...r, isVerified: res.data.isVerified } : r));
            toast.success(res.data.msg);
        } catch (err) {
            toast.error(err.response?.data?.msg || "Failed to update recruiter verification!");
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
            </div>
        );

    return (
        <div className="p-6 space-y-10">

            {/* Jobs Section */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800  mb-3">
                    Jobs Management
                </h1>
                {jobs.length === 0 ? (
                    <p className="text-center text-red-600 font-semibold mt-10 text-sm lg:text-base">No jobs available</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {jobs.map(j => (
                            <div key={j._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2">
                                <p className="text-blue-700 font-bold text-sm lg:text-base">{j.title}</p>
                                <p className="text-sm text-gray-500">Posted by: {j.postedBy.name}</p>
                                <p className={`font-semibold text-sm lg:text-base ${j.isJobActive ? "text-green-600" : "text-red-600"}`}>
                                    {j.isJobActive ? "Active" : "Inactive"}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => toggleStatus(j._id)} className="btn btn-warning btn-sm text-black">Change Status</button>
                                    <button onClick={() => { setJobToDelete(j._id); document.getElementById("delete_modal").showModal(); }} className="btn btn-error btn-sm text-black">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Recruiter Section */}
            <div>
                <h1 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-3">
                    Recruiters Management
                </h1>
                {recruiters.length === 0 ? (
                    <p className="text-center text-red-600 font-semibold mt-10 text-sm lg:text-base">No recruiters found</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {recruiters.map(r => (
                            <div key={r._id} className="bg-white p-4 rounded-lg shadow-md flex flex-col gap-2">
                                <p className="font-bold text-sm lg:text-base text-blue-700">{r.name}</p>
                                <p className="text-sm text-gray-500">Email: {r.email}</p>
                                <p className={`font-semibold text-sm lg:text-base ${r.isVerified ? "text-green-600" : "text-red-600"}`}>
                                    {r.isVerified ? "Verified" : "Not Verified"}
                                </p>
                                <button onClick={() => toggleVerifyRecruiter(r._id)} className="btn btn-warning btn-sm mt-2 text-black">
                                    {r.isVerified ? "Unverify" : "Verify"}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Job*/}
            <dialog id="delete_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg text-red-500">Delete Job?</h3>
                    <p className="py-4 text-gray-700 text-sm">Are you sure you want to delete this job? This action cannot be undone.</p>
                    <div className="modal-action">
                        <form method="dialog" className="flex gap-2">
                            <button className="btn">Cancel</button>
                            <button type="button" onClick={confirmDelete} className="btn btn-error">Delete</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default AdminJobs;

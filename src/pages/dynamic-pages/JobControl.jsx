
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { toast } from "react-toastify";
import api from "../../api/axios.js";


import EditJobModal from "../../components/jobs/EditJobModal.jsx";
import AddJobModal from "../../components/jobs/AddJobModal.jsx";
import JobCard from "../../components/jobs/JobCard.jsx";
import DeleteJobModal from "../../components/jobs/DeleteModal.jsx";

export default function JobControl() {

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(true);

    const [currentUser, setCurrentUser] = useState(null);
    const isRecruiterVerified =
        currentUser?.role === "recruiter" && currentUser?.isVerified;

    const [activeTab, setActiveTab] = useState("active");
    const [openAdd, setOpenAdd] = useState(false);
    const [openEditJob, setOpenEditJob] = useState(null);
    const [openDeleteJob, setOpenDeleteJob] = useState(null);

    

    const initialForm = {
        title: "",
        companyName: "",
        location: "",
        jobType: "Full Time",
        salaryMin: "",
        salaryMax: "",
        description: "",
        skills: [],
        requirements: [],
        isJobActive: true,
    };
    const [form, setForm] = useState(initialForm);
    const resetForm = () => setForm(initialForm);


    useEffect(() => {
        if (openEditJob) {
            setForm({
                title: openEditJob.title || "",
                companyName: openEditJob.companyName || "",
                location: openEditJob.location || "",
                jobType: openEditJob.jobType || "Full Time",
                salaryMin: openEditJob.salaryRange?.min || "",
                salaryMax: openEditJob.salaryRange?.max || "",
                description: openEditJob.description || "",
                skills: openEditJob.skills || [],
                requirements: openEditJob.requirements || [],
                isJobActive: openEditJob.isJobActive ?? true,
            });
        }
    }, [openEditJob]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await api.get("/job");
            setJobs(Array.isArray(res.data.jobs) ? res.data.jobs : []);
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.msg || "Failed to fetch jobs.");
        } finally {
            setLoading(false);
        }
    };


    const fetchCurrentUser = async () => {
        try {
            setUserLoading(true);
            const res = await api.get("/user/me");
            setCurrentUser(res.data.user || res.data);
        } catch (err) {
            console.warn("Could not fetch /user/me:", err?.response?.data || err);
            setCurrentUser(null);
        } finally {
            setUserLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
        fetchJobs();
    }, []);


    const handleAddJob = async (e) => {
        e.preventDefault();
        const payload = {
            title: form.title,
            companyName: form.companyName,
            location: form.location,
            jobType: form.jobType,
            salaryRange: {
                min: form.salaryMin ? Number(form.salaryMin) : 0,
                max: form.salaryMax ? Number(form.salaryMax) : 0,
            },
            skills: form.skills,
            requirements: form.requirements,
            description: form.description,
            isJobActive: form.isJobActive,
        };

        try {
            const res = await api.post("/job/addJob", payload);
            toast.success("Job added");
            console.log(res.data);
            setOpenAdd(false);
            fetchJobs();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add job");
        }
    };

    const handleEditJob = async (e) => {
        e.preventDefault();
        if (!openEditJob) return;

        const payload = {
            title: form.title,
            companyName: form.companyName,
            location: form.location,
            jobType: form.jobType,
            salaryRange: {
                min: form.salaryMin ? Number(form.salaryMin) : 0,
                max: form.salaryMax ? Number(form.salaryMax) : 0,
            },
            skills: form.skills,
            requirements: form.requirements,
            description: form.description,
            isJobActive: form.isJobActive,
        };

        try {
            const res = await api.put(`/job/update/${openEditJob._id}`, payload);
            toast.success("Job updated");
            console.log(res.data);
            setOpenEditJob(null);
            resetForm();
            fetchJobs();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.msg || "Failed to update job");
        }
    };

    const handleDeleteJob = async () => {
        if (!openDeleteJob) return;
        try {
            const res = await api.delete(`/job/remove/${openDeleteJob._id}`);
            toast.success(res.data.msg || "Job deleted");
            setOpenDeleteJob(null);
            fetchJobs();
        } catch (err) {
            console.error(err);
            toast.error(err?.response?.data?.msg || "Failed to delete job");
        }
    };


    const displayedJobs = jobs.filter((j) =>
        activeTab === "active" ? j.isJobActive : !j.isJobActive
    );

    return (
        <div className="p-6 max-w-7xl mx-auto bg-[#eef9ff] text-black">

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">Job Management</h1>

                        {!userLoading && currentUser && (
                            <>
                                {currentUser.role === "recruiter" ? (
                                    currentUser.isVerified ? (
                                        <RiVerifiedBadgeFill className="text-green-500 text-base sm:text-lg lg:text-2xl" />
                                    ) : (
                                        <span className="badge badge-warning text-xs">(Not verified)</span>
                                    )
                                ) : (
                                    <span className="badge text-xs">User</span>
                                )}
                            </>
                        )}
                    </div>

                    <p className="text-sm  sm:text-base text-gray-700 mt-1">
                        Manage job postings — add, edit or remove. Actions restricted to
                        verified recruiters.
                    </p>

                </div>

                <div className="flex items-center gap-4">
                    <button
                        className="btn btn-primary btn-sm lg:btn-md gap-2 text-white/100 shadow-md"
                        onClick={() => {
                            resetForm();
                            setOpenAdd(true);
                        }}
                        disabled={!isRecruiterVerified}
                    >
                        <FaPlus /> Add Job
                    </button>
                </div>
            </div>


            <div role="tablist" className="tabs tabs-boxed p-1">
                <button
                    aria-selected={activeTab === "active"}
                    className={`tab px-4 btn btn-sm lg:btn-md py-2 rounded-lg font-bold transition-colors ${activeTab === "active" ? "bg-[#4f23ff] shadow-md" : "bg-gray-200 hover:bg-gray-300 "
                        }`}
                    onClick={() => setActiveTab("active")}
                >
                    <span className={activeTab === "active" ? "opacity-100 text-white " : "opacity-60 text-gray-900 "}>
                        Active Jobs ({jobs.filter((j) => j.isJobActive).length})
                    </span>
                </button>

                <button
                    aria-selected={activeTab === "inactive"}
                    className={`tab px-4 py-2 btn btn-sm lg:btn-md rounded-lg font-bold ml-2 transition-colors ${activeTab === "inactive" ? "bg-[#4f23ff] shadow-md" : "bg-gray-200 hover:bg-gray-300"
                        }`}
                    onClick={() => setActiveTab("inactive")}
                >
                    <span className={activeTab === "inactive" ? "opacity-100 text-white " : "opacity-60 text-gray-800"}>
                        Inactive Jobs ({jobs.filter((j) => !j.isJobActive).length})
                    </span>
                </button>
            </div>

            <div className="mt-6">
                {loading ? (
                    <div className="flex justify-center items-center py-10">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                    </div>
                ) : displayedJobs.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No jobs found.</div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {displayedJobs.map((job) => (
                            <JobCard
                                key={job._id}
                                job={job}
                                currentUser={currentUser}
                                isRecruiterVerified={isRecruiterVerified}
                                onEdit={setOpenEditJob}
                                onDelete={setOpenDeleteJob}
                                
                            />

                        ))}
                    </div>
                )}
            </div>


            {openAdd && (
                <AddJobModal
                    form={form}
                    setForm={setForm}
                    onClose={() => setOpenAdd(false)}
                    onSubmit={handleAddJob}
                />
            )}

            {openEditJob && (
                <EditJobModal
                    form={form}
                    setForm={setForm}
                    onClose={() => {
                        setOpenEditJob(null);
                        resetForm();
                    }}
                    onSubmit={handleEditJob}
                />
            )}

            {openDeleteJob && (
                <DeleteJobModal
                    onCancel={() => setOpenDeleteJob(null)}
                    onConfirm={handleDeleteJob}
                />
            )}

           
        </div>
    );
}


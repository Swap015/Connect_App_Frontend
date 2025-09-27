import { useEffect, useState } from "react";
import api from "../../../api/axios.js";
import { toast } from "react-toastify";

const AdminDashboard = () => {
    const [reports, setReports] = useState(null);
    const [users, setUsers] = useState([]);
    const [posts, setPosts] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [r, u, p, j] = await Promise.all([
                    api.get("/admin/reports"),
                    api.get("/admin/users"),
                    api.get("/admin/posts"),
                    api.get("/admin/jobs"),
                ]);
                setReports(r.data);
                setUsers(u.data);
                setPosts(p.data.posts);
                setJobs(j.data.jobs);
            } catch {
                toast.error("Failed to load admin data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Delete user
    const deleteUser = async (id) => {
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(users.filter(u => u._id !== id));
            toast.success("User deleted");
        } catch {
            toast.error("Failed to delete user");
        }
    };

    // Delete post
    const deletePost = async (id) => {
        try {
            await api.delete(`/admin/posts/${id}`);
            setPosts(posts.filter(p => p._id !== id));
            toast.success("Post deleted");
        } catch {
            toast.error("Failed to delete post");
        }
    };

    // Toggle job
    const toggleJob = async (id) => {
        try {
            const res = await api.patch(`/admin/jobs/toggle/${id}`);
            setJobs(jobs.map(j => j._id === id ? res.data.job : j));
            toast.success("Job status updated");
        } catch {
            toast.error("Failed to update job");
        }
    };

    // Delete job
    const deleteJob = async (id) => {
        try {
            await api.delete(`/admin/jobs/${id}`);
            setJobs(jobs.filter(j => j._id !== id));
            toast.success("Job deleted");
        } catch {
            toast.error("Failed to delete job");
        }
    };

    if (loading) return <p className="text-center p-6">Loading admin dashboard...</p>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            {/* Reports */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-100 p-4 rounded shadow">
                    <h2 className="font-semibold">Total Users</h2>
                    <p>{reports?.users?.totalUsers}</p>
                </div>
                <div className="bg-green-100 p-4 rounded shadow">
                    <h2 className="font-semibold">Total Jobs</h2>
                    <p>{reports?.jobs?.totalJobs}</p>
                </div>
                <div className="bg-purple-100 p-4 rounded shadow">
                    <h2 className="font-semibold">Total Posts</h2>
                    <p>{reports?.engagement?.totalPosts}</p>
                </div>
            </section>

            {/* Users */}
            <section>
                <h2 className="text-xl font-bold mb-2">Users</h2>
                <div className="bg-white rounded shadow p-4">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u._id} className="border-b">
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                    <td>
                                        <button
                                            onClick={() => deleteUser(u._id)}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Posts */}
            <section>
                <h2 className="text-xl font-bold mb-2">Posts</h2>
                <div className="grid gap-4">
                    {posts.map(p => (
                        <div key={p._id} className="bg-white p-4 rounded shadow flex justify-between">
                            <div>
                                <p><strong>{p.postedBy?.name}</strong>: {p.text}</p>
                            </div>
                            <button
                                onClick={() => deletePost(p._id)}
                                className="text-red-600 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Jobs */}
            <section>
                <h2 className="text-xl font-bold mb-2">Jobs</h2>
                <div className="grid gap-4">
                    {jobs.map(j => (
                        <div key={j._id} className="bg-white p-4 rounded shadow flex justify-between">
                            <div>
                                <p className="font-semibold">{j.title}</p>
                                <p>Status: {j.isJobActive ? "Active" : "Inactive"}</p>
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => toggleJob(j._id)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Toggle
                                </button>
                                <button
                                    onClick={() => deleteJob(j._id)}
                                    className="text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AdminDashboard;

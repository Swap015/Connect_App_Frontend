import { useEffect, useState } from "react";
import api from "../../../api/axios.js";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell
} from "recharts";
import { toast } from "react-toastify";

const AdminDashboard = () => {
    const [reports, setReports] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const res = await api.get("/admin/reports");
                setReports(res.data);
            } catch {
                toast.error("Failed to load reports. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (!reports)
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
            </div>
        );

    const data = [
        { name: "Users", value: reports.users.totalUsers },
        { name: "Recruiters", value: reports.users.recruitersCount },
        { name: "Candidates", value: reports.users.candidatesCount },
        { name: "Jobs", value: reports.jobs.totalJobs },
        { name: "Active Jobs", value: reports.jobs.activeJobs },
        { name: "Inactive Jobs", value: reports.jobs.inactiveJobs },
        { name: "Posts", value: reports.engagement.totalPosts },
        { name: "Comments", value: reports.engagement.totalComments },
        { name: "Applications", value: reports.applications.totalApplications },
    ];


    const COLORS = [
        "#4F46E5", // Indigo
        "#10B981", // Green
        "#F59E0B", // Amber
        "#EF4444", // Red
        "#3B82F6", // Blue
        "#8B5CF6", // Violet
        "#F97316", // Orange
        "#14B8A6", // Teal
        "#6366F1", // Indigo Light
    ];

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
            </div>
        );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center text-gray-900">
                Admin Dashboard
            </h1>

            <div className="bg-white shadow-lg rounded-lg p-4">
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            dataKey="name"
                            tick={{
                                fill: "#000",
                                fontWeight: "bold",
                                fontSize: window.innerWidth < 640 ? 10 : 14
                            }}
                        />

                        <YAxis allowDecimals={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
                            itemStyle={{ color: "#000" }}
                            labelStyle={{ color: "#000", fontWeight: "bold" }}
                        />

                        <Bar dataKey="value" barSize={40}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default AdminDashboard;

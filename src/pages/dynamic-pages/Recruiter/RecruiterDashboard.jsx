import { useEffect, useState } from "react";
import api from "../../../api/axios";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { toast } from "react-toastify";

const RecruiterDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const res = await api.get("/applications/dashboard");
                setData(res.data);
            } catch {
                toast.error("Failed to fetch dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
            </div>
        );
    }

    if (!data) {
        return <p className="text-center mt-10 text-gray-600">No data available.</p>;
    }

    const { totalJobs, totalApplicants, statusSummary } = data;

    // Recharts data format
    const chartData = [
        { name: "Pending", value: statusSummary.Pending, fill: "#fbbf24" },
        { name: "Shortlisted", value: statusSummary.Shortlisted, fill: "#3b82f6" },
        { name: "Rejected", value: statusSummary.Rejected, fill: "#ef4444" },
        { name: "Hired", value: statusSummary.Hired, fill: "#22c55e" },
    ];

    return (
        <div className="p-6 min-h-screen bg-gradient-to-r from-[#b9c4d5] to-[#ababab]">
            <h1 className="text-3xl font-extrabold text-white mb-6 text-center">
                Recruiter Dashboard
            </h1>

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h2 className="text-gray-700 font-semibold text-lg">Total Jobs</h2>
                    <p className="text-3xl font-bold text-orange-600">{totalJobs}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                    <h2 className="text-gray-700 font-semibold text-lg">Total Applicants</h2>
                    <p className="text-3xl font-bold text-blue-600">{totalApplicants}</p>
                </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">
                    Application Status Overview
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
                            itemStyle={{ color: "#000" }}
                            labelStyle={{ color: "#000", fontWeight: "bold" }} />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {chartData.map((entry, index) => (
                                <cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default RecruiterDashboard;

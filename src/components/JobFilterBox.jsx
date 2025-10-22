import { useState } from "react";
import { FaTimes } from "react-icons/fa";

const JobFilterBox = ({ onFilterChange, onClose }) => {
    const [filters, setFilters] = useState({
        jobType: "",
        location: "",
        skills: "",
        minSalary: 0,
        maxSalary: 100000,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const handleSalaryChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: Number(value) });
    };

    const applyFilters = () => {
        onFilterChange(filters);
        if (onClose) onClose(); // ✅ close after applying (mobile only)
    };

    const resetFilters = () => {
        const reset = {
            jobType: "",
            location: "",
            skills: "",
            minSalary: 0,
            maxSalary: 100000,
        };
        setFilters(reset);
        onFilterChange(reset);
    };

    return (
        <div className="relative bg-white/90 backdrop-blur-xl shadow-xl border border-gray-200 rounded-2xl w-full max-w-xs md:w-64 text-black transition-all duration-300 hover:shadow-2xl max-h-[90vh] overflow-y-auto lg:overflow-y-hidden py-10 px-9">

           
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 md:hidden"
                >
                    <FaTimes size={20} />
                </button>
            )}

            <h2 className="text-xl font-semibold text-center mb-5 text-gray-800 tracking-wide border-b border-gray-300 pb-2">
                🔍 Filter Jobs
            </h2>

            <div className="form-control mb-3">
                <label className="label font-medium text-sm text-gray-700">Job Type</label>
                <select
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleChange}
                    className="select select-bordered w-full bg-gray-200 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                >
                    <option value="">All</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Internship">Internship</option>
                </select>
            </div>

            <div className="form-control mb-3">
                <label className="label font-medium text-sm text-gray-700">Location</label>
                <input
                    type="text"
                    name="location"
                    placeholder="Enter city"
                    value={filters.location}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-gray-200 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="form-control mb-3">
                <label className="label font-medium text-sm text-gray-700">Skills</label>
                <input
                    type="text"
                    name="skills"
                    placeholder="React, Node"
                    value={filters.skills}
                    onChange={handleChange}
                    className="input input-bordered w-full bg-gray-200 h-9 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
            </div>

            <div className="form-control mb-5">
                <label className="label font-medium text-sm text-gray-700 mb-3">
                    Salary Range
                </label>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>₹{filters.minSalary}</span>
                    <span>₹{filters.maxSalary}</span>
                </div>
                <input
                    type="range"
                    name="minSalary"
                    min="0"
                    max="100000"
                    step="5000"
                    value={filters.minSalary}
                    onChange={handleSalaryChange}
                    className="range range-primary range-xs mb-1 accent-blue-500"
                />
                <input
                    type="range"
                    name="maxSalary"
                    min="0"
                    max="100000"
                    step="5000"
                    value={filters.maxSalary}
                    onChange={handleSalaryChange}
                    className="range range-secondary range-xs accent-green-500"
                />
            </div>

            <div className="flex flex-col gap-2">
                <button
                    onClick={applyFilters}
                    className="btn bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 border-none text-white text-sm h-8 transition-all"
                >
                    Apply Filters
                </button>
                <button
                    onClick={resetFilters}
                    className="btn btn-outline border-gray-400 text-sm h-8 hover:bg-gray-100"
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default JobFilterBox;

import InputField from "../../components/jobs/InputField.jsx";

export default function JobForm({ form, setForm, onSubmit, onCancel, isEdit = false }) {
    return (
        <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Job Title"
                    className="input input-bordered w-full"
                />
                <input
                    required
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="Company Name"
                    className="input input-bordered w-full"
                />
                <input
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Location"
                    className="input input-bordered w-full"
                />
                <select
                    value={form.jobType}
                    onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                    className="select select-bordered w-full"
                >
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Internship</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <input
                    type="number"
                    value={form.salaryMin}
                    onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
                    placeholder="Min Salary"
                    className="input input-bordered w-full"
                />
                <input
                    type="number"
                    value={form.salaryMax}
                    onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                    placeholder="Max Salary"
                    className="input input-bordered w-full"
                />
            </div>

            <textarea
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Job Description"
                className="textarea textarea-bordered w-full"
            />

            <div>
                <label className="block text-sm font-medium mb-1">Skills</label>
                <InputField tags={form.skills} setTags={(t) => setForm({ ...form, skills: t })} />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Requirements</label>
                <InputField tags={form.requirements} setTags={(t) => setForm({ ...form, requirements: t })} />
            </div>

            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={form.isJobActive}
                        onChange={(e) => setForm({ ...form, isJobActive: e.target.checked })}
                        className="checkbox"
                    />
                    <span>Job Active</span>
                </label>
            </div>

            <div className="modal-action">
                <button type="submit" className={`btn ${isEdit ? "btn-success" : "btn-primary"}`}>
                    {isEdit ? "Update Job" : "Save Job"}
                </button>
                <button type="button" className="btn" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

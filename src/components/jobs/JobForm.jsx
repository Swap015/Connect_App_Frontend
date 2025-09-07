import InputField from "./InputField.jsx";

export default function JobForm({ form, setForm, onSubmit, isEdit = false, onCancel }) {
    return (
        <form
            onSubmit={onSubmit}
            className="space-y-3 bg-white text-black p-4 rounded-lg max-h-[70vh] overflow-y-auto"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Job Title"
                    className="input input-bordered border-black w-full bg-gray-200 text-black"
                />
                <input
                    required
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    placeholder="Company Name"
                    className="input input-bordered border-black w-full bg-gray-200 text-black"
                />
                <input
                    required
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="Location"
                    className="input input-bordered border-black w-full bg-gray-200 text-black"
                />
                <select
                    value={form.jobType}
                    onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                    className="select select-bordered border-black w-full bg-gray-200 text-black"
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
                    className="input input-bordered border-black w-full bg-gray-200 text-black"
                />
                <input
                    type="number"
                    value={form.salaryMax}
                    onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
                    placeholder="Max Salary"
                    className="input input-bordered border-black w-full bg-gray-200 text-black"
                />
            </div>

            <textarea
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Job Description"
                className="textarea textarea-bordered border-black w-full bg-gray-200 text-black"
            />

            <div>
                <label className="block text-base font-semibold mb-1">Skills</label>
                <InputField className="text-base"
                    tags={form.skills || []}
                    setTags={(t) => setForm({ ...form, skills: t })}
                />
            </div>

            <div>
                <label className="block text-base font-semibold mb-1">Requirements</label>
                <InputField className="text-base"
                    tags={form.requirements || []}
                    setTags={(t) => setForm({ ...form, requirements: t })}
                />
            </div>

            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={!!form.isJobActive}
                        onChange={(e) => setForm({ ...form, isJobActive: e.target.checked })}
                        className="checkbox checkbox-primary"
                    />
                    <span className="text-sm font-bold">Job Active</span>
                </label>
            </div>


            <div className="modal-action flex gap-3">
                <button
                    type="submit"
                    className="btn bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 border-none"
                >
                    {isEdit ? "Update Job" : "Save Job"}
                </button>

                <button
                    type="button"
                    className="btn bg-gray-200 text-black hover:bg-gray-300"
                    onClick={onCancel}
                >
                    Cancel
                </button>

            </div>
        </form>
    );
}

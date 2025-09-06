import JobForm from "../../components/jobs/JobForm.jsx";

export default function AddJobModal({ form, setForm, onClose, onSubmit }) {
    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-2xl">
                <h3 className="font-bold text-lg mb-4">Add New Job</h3>

                <JobForm form={form} setForm={setForm} onSubmit={onSubmit} />

                <div className="modal-action">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

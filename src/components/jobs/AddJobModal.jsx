import JobForm from "../../components/jobs/JobForm.jsx";

export default function AddJobModal({ form, setForm, onClose, onSubmit }) {
    return (
        <div className="modal modal-open ">
            <div className="modal-box max-w-2xl bg-white text-black">
                <h3 className="font-bold  text-lg mb-4 ml-4">Add New Job</h3>

                <JobForm form={form} setForm={setForm} onSubmit={onSubmit} onCancel={onClose} />

            </div>
        </div>
    );
}

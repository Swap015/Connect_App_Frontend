import JobForm from "../../components/jobs/JobForm.jsx";

export default function EditJobModal({ form, setForm, onClose, onSubmit }) {
    return (
        <div className="modal modal-open ">
            <div className="modal-box max-w-2xl bg-white">
                <h3 className="font-bold text-lg mb-4 ml-4">Edit Job Details</h3>

                <JobForm form={form} setForm={setForm} onSubmit={onSubmit} isEdit onCancel={onClose} />

            </div>
        </div>
    );
}

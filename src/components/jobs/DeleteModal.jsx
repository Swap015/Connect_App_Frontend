export default function DeleteModal({ onConfirm, onCancel }) {
    return (
        <div className="modal modal-open">
            <div className="modal-box text-center">
                <h3 className="font-bold text-lg">Delete Job?</h3>
                <p className="py-3">Are you sure you want to remove this job posting?</p>
                <div className="modal-action justify-center">
                    <button className="btn btn-error" onClick={onConfirm}>
                        Yes, Delete
                    </button>
                    <button className="btn" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

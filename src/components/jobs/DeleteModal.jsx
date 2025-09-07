
export default function DeleteModal({ onConfirm, onCancel }) {
    
    return (
        <div className="modal modal-open">
            <div className="modal-box bg-white text-gray-800 rounded-lg shadow-lg p-6 text-center max-w-sm mx-auto">
                <h3 className="font-bold text-xl mb-2">Delete Job?</h3>
                <p className="text-gray-700 mb-4">
                    Are you sure you want to remove this job posting? This action cannot be undone.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        className="btn bg-red-600 text-white hover:bg-red-700 transition-colors px-6"
                        onClick={onConfirm}
                    >
                        Yes, Delete
                    </button>
                    <button
                        className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors px-6"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

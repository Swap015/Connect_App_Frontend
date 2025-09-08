export default function DeleteModal({ onConfirm, onCancel }) {
    return (
        <div className="modal modal-open flex items-center justify-center px-4">
            <div className="modal-box bg-white text-gray-800 rounded-lg shadow-lg p-4 sm:p-6 text-center w-full max-w-xs sm:max-w-sm md:max-w-md">
              
                <h3 className="font-bold text-lg sm:text-xl mb-2">Delete Job?</h3>

                
                <p className="text-gray-700 text-sm sm:text-base mb-4">
                    Are you sure you want to remove this job posting? <br className="hidden sm:block" />
                    This action cannot be undone.
                </p>

               
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    <button
                        className="btn w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 transition-colors px-4 sm:px-6"
                        onClick={onConfirm}
                    >
                        Yes, Delete
                    </button>
                    <button
                        className="btn w-full sm:w-auto bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors px-4 sm:px-6"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

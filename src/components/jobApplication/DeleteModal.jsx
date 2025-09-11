
import { FaTimes } from "react-icons/fa";
import api from "../../api/axios.js";

const DeleteApplicationModal = ({ application, onClose, onDeleted }) => {
    const handleDelete = async () => {
        try {
            await api.delete(`/applications/delete/${application._id}`);
            alert("Application deleted!");
            onDeleted();
            onClose();
        } catch (err) {
            alert(err.response?.data?.msg || "Failed to delete");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                    onClick={onClose}
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-xl font-bold mb-4 text-black">
                    Delete Application
                </h2>
                <p className="text-gray-800 text-sm">
                    Are you sure you want to delete your application for{" "}
                    <b>{application.job.title}</b>?
                </p>

                <div className="flex justify-end gap-3 mt-6">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-error" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteApplicationModal;

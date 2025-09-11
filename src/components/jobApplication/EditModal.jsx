
import { FaTimes } from "react-icons/fa";
import api from "../../api/axios.js";

const EditApplicationModal = ({ application, onClose, onUpdated }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            await api.put(
                `/applications/editApplication/${application._id}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            alert("Application updated!");
            onUpdated();
            onClose();
        } catch (err) {
            alert(err.response?.data?.msg || "Failed to update");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                    onClick={onClose}
                >
                    <FaTimes size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                    Edit Application for {application.job.title}
                </h2>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <textarea
                        name="coverLetter"
                        defaultValue={application.coverLetter}
                        className="textarea textarea-bordered w-full bg-gray-200 text-black border-black"
                        rows={4}
                    />
                    <input
                        type="file"
                        name="resume"
                        accept=".pdf,.doc,.docx"
                        className="file-input file-input-bordered w-full bg-gray-200 text-black border-black"
                    />
                    <div className="flex justify-end gap-3">
                        <button type="button" className="btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditApplicationModal;

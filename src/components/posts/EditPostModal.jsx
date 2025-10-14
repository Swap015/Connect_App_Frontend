import { useState } from "react";
import api from "../../api/axios.js";
import { toast } from "react-toastify";

const EditPostModal = ({ post, isOpen, onClose, onEdit }) => {
    const [content, setContent] = useState(post.content);

    const handleSubmit = async () => {
        try {
            const res = await api.patch(
                `/post/editPost/${post._id}`,
                { content },
                { withCredentials: true }
            );
            onEdit(res.data.post.content);
            onClose();
        } catch {
            toast.error("Failed to edit post");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-black">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-lg font-semibold mb-4">Edit Post</h2>
                <textarea
                    className="w-full border rounded p-2 mb-3"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                />
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-3 py-1 border rounded bg-red-500 text-white hover:bg-red-600">Cancel</button>
                    <button onClick={handleSubmit} className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded">Save</button>
                </div>
            </div>
        </div>
    );
};

export default EditPostModal;

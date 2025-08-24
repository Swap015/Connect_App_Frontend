import React, { useState } from "react";
import axios from "axios";

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content && files.length === 0) {
            alert("Please add content or at least one image!");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("content", content);
            files.forEach((file) => formData.append("file", file));

            const res = await axios.post(
                "http://localhost:7000/api/posts/createPost",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            setLoading(false);
            setContent("");
            setFiles([]);
            onClose();
            if (onPostCreated) onPostCreated(res.data.post); // update feed without refresh
        } catch (err) {
            setLoading(false);
            console.error("Error creating post:", err);
            alert("Post creation failed. Try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg p-6 w-[90%] sm:w-[500px] shadow-lg">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Create Post</h2>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full p-3 border rounded-lg resize-none"
                        rows={3}
                    />

                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileChange}
                        className="text-sm"
                    />

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
                        >
                            {loading ? "Posting..." : "Post"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;

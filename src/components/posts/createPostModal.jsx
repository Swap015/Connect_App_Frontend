import { useState, useEffect } from "react";
import api from "../../api/axios.js";
import { FaTimes } from "react-icons/fa";
import { MdAttachFile } from "react-icons/md";

const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
    const [content, setContent] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);


    useEffect(() => {
        if (isOpen) {
            const fetchUser = async () => {
                try {
                    const res = await api.get("/user/me", { withCredentials: true });
                    setUser(res.data.user);
                } catch (err) {
                    console.error("Failed to fetch user:", err);
                }
            };
            fetchUser();
        }
    }, [isOpen]);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles([...files, ...selectedFiles]);
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
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

            const res = await api.post(
                "/posts/createPost",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setLoading(false);
            setContent("");
            setFiles([]);
            onClose();
            if (onPostCreated) onPostCreated(res.data.post);
        } catch (err) {
            setLoading(false);
            console.error("Error creating post:", err);
            alert("Post creation failed. Try again.");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-gray-700/40 backdrop-blur-sm"></div>

            <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 backdrop-blur-xl rounded-xl p-6 w-[90%] sm:w-[500px] shadow-2xl animate-fadeIn border-2 border-black/50">
                {/* Create Post Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Create Post</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* user profile pic */}
                <div className="flex items-center gap-3 mb-3">
                    <img
                        src={user?.profileImage}
                        alt="profile"
                        className="w-10 h-10 rounded-full "
                    />
                    <span className="font-medium text-gray-700">{user?.name || "You"}</span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="What's on your mind?"
                        className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white/70"
                        rows={4}
                    />

                    {/* file preview */}
                    {files.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {files.map((file, index) => (
                                <div key={index} className="relative">
                                    <img
                                        src={URL.createObjectURL(file)}
                                        alt="preview"
                                        className="w-20 h-20 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center justify-between border-t pt-3">
                        {/* File Upload */}
                        <div className="flex items-center gap-3">
                            <label className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:text-shadow-lg">
                                <MdAttachFile className="text-blue-600 font-extrabold text-xl" />
                                <span className="text-gray-900 font-bold">Choose File</span>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>

                            {/*  file count */}
                            {files.length > 0 && (
                                <span className="text-sm text-gray-600">
                                    {files.length} file{files.length > 1 ? "s" : ""} selected
                                </span>
                            )}
                        </div>

                        {/* Post Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:opacity-50 shadow-md"
                        >
                            {loading ? (
                                <>
                                    Posting
                                    <span className="loading loading-spinner loading-sm"></span>
                                </>
                            ) : (
                                "Post"
                            )}
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePostModal;

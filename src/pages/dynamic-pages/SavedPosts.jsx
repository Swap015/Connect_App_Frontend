import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { FaBookmark, FaTrash, FaUserCircle } from "react-icons/fa";

const SavedPosts = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSavedPosts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/post/savedPosts");
            setSavedPosts(res.data.posts || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching saved posts:", err);
            setLoading(false);
        }
    };

    const handleUnsave = async (postId) => {
        try {
            await api.put(`/post/unsavePost/${postId}`);
            setSavedPosts(savedPosts.filter((p) => p._id !== postId));
        } catch (err) {
            console.error("Error unsaving post:", err);
        }
    };

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <FaBookmark className="text-yellow-400" /> Saved Posts
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <span className="loading loading-spinner w-13 h-17 text-yellow-400 "></span>
                    </div>
                ) : savedPosts.length === 0 ? (
                    <p className="text-gray-300 text-center text-lg">
                        You don’t have any saved posts yet ✨
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {savedPosts.map((post) => (
                            <div
                                key={post._id}
                                className="bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-md"
                            >
                                {/* user info */}
                                <div className="flex items-center gap-3 mb-3">
                                    {post.postedBy?.profileImage ? (
                                        <img
                                            src={post.postedBy.profileImage}
                                            alt="profile"
                                            className="w-9 h-9 rounded-full border border-gray-600 object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-9 h-9 text-gray-500" />
                                    )}
                                    <div>
                                        <h3 className="text-white font-medium text-sm">
                                            {post.postedBy?.name}
                                        </h3>
                                        <p className="text-gray-400 text-xs">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* post content */}
                                {post.content && (
                                    <p className="text-gray-200 text-sm mb-2 line-clamp-3">
                                        {post.content}
                                    </p>
                                )}

                                {/* post image */}
                                {Array.isArray(post.file) && post.file.length > 0 && (
                                    <img
                                        src={post.file[0]}
                                        alt="post"
                                        className="w-full h-36 object-cover rounded-lg mb-2"
                                    />
                                )}

                                {/* save/unsave button */}
                                <div className="flex justify-between items-center mt-2">
                                    <button
                                        onClick={() => handleUnsave(post._id)}
                                        className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all text-sm"
                                    >
                                        <FaTrash className="text-sm" /> Unsave
                                    </button>

                                    <span className="text-green-400 text-xs font-medium flex items-center gap-1">
                                        <FaBookmark className="text-yellow-400" /> Saved
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedPosts;

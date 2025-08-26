import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { FaBookmark, FaTrash, FaUserCircle } from "react-icons/fa";

const SavedPosts = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    // fetch saved posts
    const fetchSavedPosts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/post/saved");
            setSavedPosts(res.data.posts || []);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching saved posts:", err);
            setLoading(false);
        }
    };

    // unsave post
    const handleUnsave = async (postId) => {
        try {
            await api.put(
                `/post/unsave/${postId}`
            );
            setSavedPosts(savedPosts.filter((p) => p._id !== postId));
        } catch (err) {
            console.error("Error unsaving post:", err);
        }
    };

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                    <FaBookmark className="text-orange-400" /> Saved Posts
                </h1>

                {loading ? (
                    <p className="text-gray-400 text-center">Loading saved posts...</p>
                ) : savedPosts.length === 0 ? (
                    <p className="text-gray-500 text-center text-lg">
                        You don’t have any saved posts yet ✨
                    </p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {savedPosts.map((post) => (
                            <div
                                key={post._id}
                                className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-xl hover:scale-[1.02] transition-transform"
                            >
                                {/* user info */}
                                <div className="flex items-center gap-3 mb-4">
                                    {post.author?.profileImage ? (
                                        <img
                                            src={post.author.profileImage}
                                            alt="profile"
                                            className="w-10 h-10 rounded-full border"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-10 h-10 text-gray-400" />
                                    )}
                                    <div>
                                        <h3 className="text-white font-semibold">
                                            {post.author?.name || "Unknown User"}
                                        </h3>
                                        <p className="text-gray-400 text-sm">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* post content */}
                                <p className="text-gray-200 mb-3">{post.content}</p>

                                {/* Images */}
                                {post.imageUrl && (
                                    <img
                                        src={post.imageUrl}
                                        alt="post"
                                        className="w-full h-52 object-cover rounded-xl mb-3"
                                    />
                                )}

                                {/* save/unsave button */}
                                <div className="flex justify-between items-center mt-2">
                                    <button
                                        onClick={() => handleUnsave(post._id)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/80 text-white hover:bg-red-600 transition"
                                    >
                                        <FaTrash /> Unsave
                                    </button>
                                    <span className="text-gray-400 text-sm">💾 Saved</span>
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

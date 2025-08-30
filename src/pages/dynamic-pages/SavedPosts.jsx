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
            await api.put(
                `/post/unsavePost/${postId}`
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
        <div className="min-h-screen bg-gradient-to-br from-white/90 via-white to-white/80 p-6">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <FaBookmark className="text-orange-400" /> Saved Posts
                </h1>

                {loading ? (
                    <p className="text-black text-center">Loading saved posts...</p>
                ) : savedPosts.length === 0 ? (
                        <p className="text-black text-center text-lg">
                        You don’t have any saved posts yet ✨
                    </p>
                ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-black">
                        {savedPosts.map((post) => (
                            <div
                                key={post._id}
                                className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-xl hover:scale-[1.02] transition-transform"
                            >
                                {/* user info */}
                                <div className="flex items-center gap-3 mb-4 text-black">
                                    {post.postedBy?.profileImage ? (
                                        <img
                                            src={post.author.profileImage}
                                            alt="profile"
                                            className="w-10 h-10 rounded-full border"
                                        />
                                    ) : (
                                        <FaUserCircle className="w-10 h-10 text-gray-500" />
                                    )}
                                    <div>
                                        <h3 className="font-semibold">
                                            {post.name || "Unknown User"}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {new Date(post.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                {/* post content */}
                                <p className="text-gray-900 mb-3">{post.content}</p>

                                {/* images */}
                                {post.imageUrl && (
                                    <img
                                        src={post.imageUrl}
                                        alt="post"
                                        className="w-full h-52 object-cover rounded-xl mb-3"
                                    />
                                )}

                                {/* save/unsave button */}
                                <div className="flex justify-between items-center mt-3">
                                    <button
                                        onClick={() => handleUnsave(post._id)}
                                        className="group flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white transition-all duration-300"
                                    >
                                        <FaTrash className="text-lg" />
                                        
                                    </button>

                                    <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                                        Saved
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

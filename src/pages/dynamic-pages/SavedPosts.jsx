import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { FaTrash, FaBookmark } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SavedPosts = () => {
    const [savedPosts, setSavedPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchSavedPosts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/post/savedPosts");
            setSavedPosts(res.data.posts || []);
            setLoading(false);
        } catch {
            toast.error("Error fetching saved posts");
            setLoading(false);
        }
    };

    const handleUnsave = async (postId) => {
        try {
            await api.put(`/post/unsavePost/${postId}`);
            setSavedPosts(savedPosts.filter((p) => p._id !== postId));
        } catch  {
            toast.error("Error unsaving post");
        }
    };

    useEffect(() => {
        fetchSavedPosts();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-xl sm:text-2xl lg:text-3xl 3xl:text-4xl font-bold text-black mb-6 flex items-center gap-3">
                    <FaBookmark className="text-red-600" /> Saved Posts
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <span className="loading loading-spinner w-16 h-16 text-orange-500"></span>
                    </div>
                ) : savedPosts.length === 0 ? (
                    <p className="text-gray-300 text-center text-lg">
                        You don’t have any saved posts yet ✨
                    </p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {savedPosts.map((post) => (
                            <div
                                key={post._id}
                                onClick={
                                    () => navigate(`/Singlepost/${post._id}`)
                                }
                                className="relative group bg-gray-800 border border-gray-300 rounded-lg overflow-hidden shadow-md"
                            >

                                {Array.isArray(post.file) && post.file.length > 0 ? (
                                    <img
                                        src={post.file[0]}
                                        alt="post"
                                        className="w-full h-36 sm:h-44 md:h-48 lg:h-52
                                        object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-48 flex items-center justify-center bg-gray-700">
                                        <FaBookmark className="text-gray-500 text-3xl" />
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/60 opacity-100 lg:opacity-0 lg:group-hover:opacity-100   transition-opacity duration-200 flex flex-col justify-between p-3">

                                    <div className="flex items-center gap-2">
                                        <img
                                            src={post.postedBy?.profileImage || "/default-avatar.png"}
                                            alt="profile"
                                            className="w-8 h-8 sm:w-9 sm:h-9  rounded-full border border-gray-400 object-cover"
                                        />
                                        <h3 className="text-white font-medium text-sm sm:text-base md:text-lg 2xl:text-xl">
                                            {post.postedBy?.name}
                                        </h3>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleUnsave(post._id);
                                        }
                                        }
                                        className="flex items-center justify-center gap-2 px-1 py-1 lg:py-2  bg-red-500 rounded-md text-white text-sm hover:bg-red-600 transition"
                                    >

                                        <FaTrash /> Unsave
                                    </button>
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

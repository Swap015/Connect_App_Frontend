import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { FaHeart, FaCommentDots } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LikedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLikedPosts = async () => {
            try {
                const res = await api.get("/post/liked");
                setPosts(res.data.likedPosts);
            } catch  {
                toast.error("Error fetching liked posts");
            } finally {
                setLoading(false);
            }
        };
        fetchLikedPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4 bg-white">
                <span className="loading loading-spinner w-12 h-12 text-orange-500"></span>
                <p className="text-lg font-semibold text-gray-900 animate-pulse">
                    Loading your liked posts...
                </p>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex justify-center items-center min-h-screen text-xl text-gray-600">
                💔 No liked posts yet.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 p-6">
            <h1 className="text-xl lg:text-2xl 3xl:text-3xl font-bold text-center mb-6 text-gray-800">
                ❤️ Your Liked Posts
            </h1>

            <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {posts.map((post) => (
                    <div
                        key={post._id}
                        onClick={() => navigate(`/Singlepost/${post._id}`)}
                        className="backdrop-blur-lg bg-white/60 border border-white/60 rounded-xl shadow-lg p-3 shadow-black/70 cursor-pointer"
                    >
                        {/* user info */}
                        <div className="flex items-center gap-2 mb-2">
                            <img
                                src={post.postedBy?.profileImage}
                                alt={post.postedBy?.name}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/profile/${post.postedBy?._id}`);
                                }}
                                className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-gray-300 cursor-pointer"
                            />
                            <div>
                                <h3 onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/profile/${post.postedBy?._id}`);
                                }
                                } className="text-xs sm:text-sm lg:text-base font-semibold text-gray-800 cursor-pointer">
                                    {post.postedBy?.name}
                                </h3>
                                <p className="text-xs 2xl:text-sm text-gray-600">
                                    {post.postedBy?.headline}
                                </p>
                            </div>
                        </div>

                        {post.content && (
                            <p className="text-gray-800 mb-2 text-sm line-clamp-3">
                                {post.content}
                            </p>
                        )}

                        {/* post image */}
                        {post.file?.length > 0 && (
                            <img
                                src={post.file[0]}
                                alt="Post"
                                className="w-full rounded-lg object-cover mb-2 max-h-40"
                            />
                        )}

                        {/* likes & comments */}
                        <div className="flex justify-between items-center text-gray-600 mt-1 text-xs">
                            <span className="flex items-center gap-1 text-red-500">
                                <FaHeart className="text-sm" /> {post.likes.length}
                            </span>
                            <span className="flex items-center gap-1 text-blue-600">
                                <FaCommentDots className="text-sm" /> {post.comments.length}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LikedPosts;

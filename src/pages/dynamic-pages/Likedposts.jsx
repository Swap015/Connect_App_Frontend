import React, { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { FaHeart, FaCommentDots } from "react-icons/fa";

const LikedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedPosts = async () => {
            try {
                const res = await api.get("/post/liked");
                setPosts(res.data.likedPosts);
            } catch (err) {
                console.error("Error fetching liked posts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLikedPosts();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-4 bg-white">
               
                <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
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
            <h1 className="text-xl font-bold text-center mb-6 text-gray-800">
                ❤️ Your Liked Posts
            </h1>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                    <div
                        key={post._id}
                        className="backdrop-blur-lg bg-white/40 border border-white/20 rounded-xl shadow-lg p-5 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src={post.postedBy?.profileImage}
                                alt={post.postedBy?.name}
                                className="w-10 h-10 rounded-full border border-gray-300"
                            />
                            <div>
                                <h3 className="text-sm font-semibold text-gray-800">
                                    {post.postedBy?.name}
                                </h3>
                                <p className="text-[9px] text-gray-600">{post.postedBy?.headline}</p>
                            </div>
                        </div>

                        <p className="text-gray-800 mb-3 text-sm  sm:text-base lg:text-lg">{post.content}</p>

                        {post.file?.length > 0 && (
                            <img
                                src={post.file[0]}
                                alt="Post"
                                className="w-30 rounded-lg object-cover mb-3 max-h-64"
                            />
                        )}

                        <div className="flex justify-between items-center text-gray-600 mt-2">
                            <span className="flex items-center gap-2 text-red-500">
                                <FaHeart /> {post.likes.length}
                            </span>
                            <span className="flex items-center gap-2 text-blue-600">
                                <FaCommentDots /> {post.comments.length}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LikedPosts;

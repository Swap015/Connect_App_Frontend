import { useCallback, useContext, useEffect, useState } from "react";
import api from "../../api/axios.js"
import CreatePostModal from "../../components/posts/createPostModal.jsx";
import { useNavigate } from "react-router-dom";
import PostCard from "../../components/posts/PostCard.jsx";
import UserContext from "../../components/Context/UserContext.jsx";
import { toast } from "react-toastify";

const Home = () => {
    const { user, loading } = useContext(UserContext);
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [postsLoading, setPostsLoading] = useState(false);

    const navigate = useNavigate();

    const fetchPosts = useCallback(async (currentUser) => {
        setPostsLoading(true);
        try {
            const res = await api.get("/post/feed");
            const postsData = res.data.posts || [];
            setPosts(postsData);

            if (currentUser) {
                const likedSet = new Set(
                    postsData.filter(p => p.likes.includes(currentUser._id)).map(p => p._id)
                );
                setLikedPosts(likedSet);
            }
        } catch {
            toast.error("Failed to fetch posts");
        } finally {
            setPostsLoading(false);
        }
    }, []);

    const handleLike = async (postId) => {
        try {
            const res = await api.patch(`/post/likePost/${postId}`, {});

            setPosts((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? { ...p, likesCount: res.data.likesCount }
                        : p
                )
            );

            setLikedPosts((prev) => {
                const updated = new Set(prev);
                if (updated.has(postId)) updated.delete(postId);
                else updated.add(postId);
                return updated;
            });
        } catch {
            toast.error("Error liking post");
        }
    };

    useEffect(() => {
        if (!loading && user) fetchPosts(user);
    }, [loading, user, fetchPosts]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex  overflow-x-hidden">

            {/* left side section-----for Big devices */}
            <aside className="w-48 lg:w-54 bg-white shadow-lg p-6 hidden md:block text-black font-bold">

                <ul className="space-y-6 ">
                    <div className="p-2 lg:p-3">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 text-sm lg:text-base"
                        >
                            + Create Post
                        </button>

                    </div>
                    <li className="cursor-pointer hover:text-orange-500 transition text-base lg:text-xl" onClick={() => navigate("/savedPosts")}>🔖 Saved Posts</li>
                    <li className="cursor-pointer hover:text-orange-500 transition text-base lg:text-xl" onClick={() => navigate("/likedPosts")}>❤️ Liked Posts</li>
                    <li className="cursor-pointer hover:text-orange-500 transition text-base lg:text-xl" onClick={() => navigate("/profileVisits")}>👀 Profile Visits</li>
                </ul>
            </aside>


            <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
                <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                    Welcome, <span className="text-orange-500">{user?.name}</span> 👋
                </h2>

                {/*  mobile menu*/}

                <div className="flex justify-around bg-white shadow-xl p-2 mb-3 gap-2 rounded-lg md:hidden text-black font-bold">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 text-xs"
                    >
                        + Post
                    </button>
                    <button
                        onClick={() => navigate("/savedPosts")}
                        className="px-3 py-1 hover:text-orange-500 transition text-sm"
                    >
                        🔖 Saved
                    </button>
                    <button
                        onClick={() => navigate("/likedPosts")}
                        className="px-3 py-1 hover:text-orange-500 transition text-sm"
                    >
                        ❤️ Liked
                    </button>
                    <button
                        onClick={() => navigate("/profileVisits")}
                        className="px-3 py-1 hover:text-orange-500 transition text-sm"
                    >
                        👀 Visits
                    </button>
                </div>

                {/*USER POSTS */}

                {postsLoading ? (
                    <div className="flex justify-center py-10">
                        <span className="loading loading-spinner w-12 h-12 text-orange-500"></span>
                    </div>
                ) : posts.length === 0 ? (
                    <p className="text-center text-gray-500">No posts from your connections yet.</p>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <PostCard
                                key={post._id}
                                post={post}
                                currentUser={user}
                                liked={likedPosts.has(post._id)}
                                handleLike={handleLike}
                                onDelete={(postId) => setPosts(prev => prev.filter(p => p._id !== postId))}
                                onEdit={(postId, newContent) =>
                                    setPosts(prev => prev.map(p => p._id === postId ? { ...p, content: newContent } : p))
                                }
                            />

                        ))}
                    </div>
                )}
            </main>
            <CreatePostModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onPostCreated={() => fetchPosts(user)}

            />
        </div>
    );
};

export default Home;



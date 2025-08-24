import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegThumbsUp, FaThumbsUp, FaRegCommentDots } from "react-icons/fa";
import CreatePostModal from "../../components/posts/createPostModal";

const Home = () => {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState(new Set());
    const [isModalOpen, setIsModalOpen] = useState(false);

    // time 
    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + "y";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + "mo";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + "d";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + "h";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + "m";
        return Math.floor(seconds) + "s";
    };

    // fetch logged-in user
    const fetchUser = async () => {
        try {
            const res = await axios.get("http://localhost:7000/api/user/me", {
                withCredentials: true,
            });
            setUser(res.data.user);
        } catch (err) {
            console.log("Failed to fetch user", err);
        }
    };

    const fetchPosts = async () => {
        try {
            const res = await axios.get("http://localhost:7000/api/post/feed", {
                withCredentials: true,
            });
            setPosts(res.data.posts || []);
        } catch (err) {
            console.error("Failed to fetch posts", err);
        } finally {
            setLoading(false);
        }
    };


    // like post
    const handleLike = async (postId) => {
        try {
            await axios.patch(
                `http://localhost:7000/api/post/likePost/${postId}`,
                {},
                { withCredentials: true }
            );
            // update state of like on post
            setPosts((prev) =>
                prev.map((p) =>
                    p._id === postId
                        ? { ...p, likes: likedPosts.has(postId) ? p.likes - 1 : p.likes + 1 }
                        : p
                )
            );
            setLikedPosts((prev) => {
                const updated = new Set(prev);
                if (updated.has(postId)) updated.delete(postId);
                else updated.add(postId);
                return updated;
            });
        } catch (err) {
            console.log("Error liking post", err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await fetchUser();
            await fetchPosts();
        };
        loadData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <span className="loading loading-spinner loading-lg text-orange-500"></span>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* left side section */}
            <aside className="w-64 bg-gray-200 shadow-lg p-6 hidden md:block text-black text-base font-bold">

                <ul className="space-y-4">
                    <div className="p-6">
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                        >
                            + Create Post
                        </button>

                        <CreatePostModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            onPostCreated={(newPost) => console.log("New post created:", newPost)}
                        />
                    </div>
                    <li className="cursor-pointer hover:text-orange-500 transition">🔖 Saved Posts</li>
                    <li className="cursor-pointer hover:text-orange-500 transition">❤️ Liked Posts</li>
                    <li className="cursor-pointer hover:text-orange-500 transition">👀 Profile Visits</li>
                </ul>
            </aside>


            <main className="flex-1 container mx-auto px-4 py-6 max-w-2xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Welcome, <span className="text-orange-500">{user?.name}</span> 👋
                </h2>

                {/* Feed */}
                {posts.length === 0 ? (
                    <p className="text-center text-gray-500">No posts from your connections yet.</p>
                ) : (
                    <div className="space-y-6">
                        {posts.map((post) => (
                            <div
                                key={post._id}
                                className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl hover:scale-[1.01] transition transform"
                            >

                                <div className="flex items-center gap-3">
                                    <img
                                        src={post.postedBy.profileImage || "/default-avatar.png"}
                                        alt="user"
                                        className="w-10 h-10 rounded-full object-cover border"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{post.postedBy.name}</h4>
                                        <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
                                    </div>
                                </div>


                                <p className="mt-3 text-gray-700">{post.content}</p>

                                {post.file?.length > 0 && (
                                    <div className="mt-3">
                                        <img
                                            src={post.file[0]}
                                            alt="post"
                                            className="rounded-lg max-h-72 w-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* like comment */}
                                <div className="flex gap-6 mt-4 text-gray-600 border-t pt-3">
                                    <button
                                        onClick={() => handleLike(post._id)}
                                        className={`flex items-center gap-2 transition ${likedPosts.has(post._id) ? "text-orange-500 scale-110" : "hover:text-orange-500"
                                            }`}
                                    >
                                        {likedPosts.has(post._id) ? <FaThumbsUp /> : <FaRegThumbsUp />}
                                        {post.likes || 0}
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-orange-500 transition">
                                        <FaRegCommentDots /> {post.comments?.length || 0}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;

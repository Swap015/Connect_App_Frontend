import { useContext, useEffect, useState } from "react";
import api from "../../api/axios.js";
import { toast } from "react-toastify";
import PostCard from "../../components/posts/PostCard.jsx";
import CreatePostModal from "../../components/posts/createPostModal.jsx";
import EditPostModal from "../../components/posts/EditPostModal.jsx";
import UserContext from "../Context/UserContext.jsx";

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(UserContext);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        if (user?._id) {
            const fetchPosts = async () => {
                try {
                    const res = await api.get(`/post/userPosts/${user._id}`);
                    setPosts(res.data.posts);
                } catch {
                    toast.error("Failed to load posts");
                }
            };
            fetchPosts();
        }
    }, [user]);

    const handleLike = async (postId) => {
        try {
            const res = await api.patch(`/post/likePost/${postId}`, {}, { withCredentials: true });
            setPosts((prev) =>
                prev.map((p) =>
                    p._id === postId ? { ...p, likes: res.data.likes } : p
                )
            );
        } catch {
            toast.error("Failed to like post");
        }
    };

    const handleDelete = (postId) => {
        setPosts((prev) => prev.filter((p) => p._id !== postId));
    };

    const handleEdit = (postId, newContent) => {
        setPosts((prev) =>
            prev.map((p) =>
                p._id === postId ? { ...p, content: newContent } : p
            )
        );
    };

    const handleNewPost = (newPost) => {
        setPosts((prev) => [newPost, ...prev]);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
            </div>
        );
    }
    return (
        <div className="p-6 max-w-3xl mx-auto">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl md:text-2xl 2xl:text-3xl font-bold text-gray-800">My Posts</h2>
                <button
                    onClick={() => setShowCreatePost(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg shadow-md text-xs md:text-sm 2xl:text-base"
                >
                    + Create Post
                </button>
            </div>

            {posts.length === 0 ? (
                <p className="text-red-500 text-center text-sm md:text-base lg:text-xl">No posts yet. Start creating!</p>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            currentUser={user}
                            liked={post.likes?.includes(user._id)}
                            handleLike={handleLike}
                            onDelete={() => handleDelete(post._id)}
                            onEdit={handleEdit}
                        />
                    ))}
                </div>
            )}


            {showCreatePost && (
                <CreatePostModal
                    isOpen={showCreatePost}
                    onClose={() => setShowCreatePost(false)}
                    onPostCreated={handleNewPost}
                />
            )}

            {editingPost && (
                <EditPostModal
                    post={editingPost}
                    isOpen={!!editingPost}
                    onClose={() => setEditingPost(null)}
                    onEdit={(newContent) => handleEdit(editingPost._id, newContent)}
                />
            )}
        </div>
    );
};

export default MyPosts;

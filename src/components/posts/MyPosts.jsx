import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { toast } from "react-toastify";
import PostCard from "../../components/posts/PostCard.jsx";
import CreatePostModal from "../../components/posts/createPostModal.jsx";
import EditPostModal from "../../components/posts/EditPostModal.jsx";

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [showCreatePost, setShowCreatePost] = useState(false);
    const [editingPost, setEditingPost] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get("/user/me", { withCredentials: true });
                setUser(res.data.user);
            } catch {
                toast.error("Failed to load user");
            }
        };
        fetchUser();
    }, []);


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
            const res = await api.put(`/post/like/${postId}`, {}, { withCredentials: true });
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

    if (!user) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="p-6 max-w-3xl mx-auto">
        
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Posts</h2>
                <button
                    onClick={() => setShowCreatePost(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md"
                >
                    + Create Post
                </button>
            </div>


            {posts.length === 0 ? (
                <p className="text-gray-500 text-center">No posts yet. Start creating!</p>
            ) : (
                <div className="space-y-6">
                    {posts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            currentUser={user}
                            liked={post.likes?.includes(user._id)}
                            handleLike={() => handleLike(post._id)}
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

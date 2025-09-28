import { useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { format } from "date-fns";
import api from "../../api/axios.js";
import {
    FaRegThumbsUp,
    FaThumbsUp,
    FaRegCommentDots,
    FaBookmark,
    FaRegBookmark,
} from "react-icons/fa";
import UserContext from "../../components/Context/UserContext.jsx";

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [comment, setComment] = useState([]);
    const [comments, setComments] = useState([]);
    const { user: currentUser, loading: userLoading } = useContext(UserContext);

    const fetchPost = async () => {
        try {
            const resPost = await api.get(`/post/getPost/${id}`);
            const postData = resPost.data.post;

            setPost(postData);

            if (currentUser) {
                setLiked(postData.likes?.some((u) => u === currentUser._id));
                setSaved(currentUser.savedPosts?.includes(postData._id));
            }
        } catch (err) {
            console.error("Failed to load post", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchComments = async () => {
        try {
            const res = await api.get(`/comments/getPostComments/${id}`);
            setComments(res.data.comments);
        } catch (err) {
            console.error("Failed to load comments", err);
        }
    };

    useEffect(() => {
        if (!userLoading) {
            fetchPost();
            fetchComments();
        }
    }, [id, currentUser, userLoading]);

    const handleLike = async () => {
        try {
            const res = await api.patch(`/post/likePost/${post._id}`);
            const updatedLikes = res.data.likes;
            setPost({ ...post, likes: updatedLikes });
            setLiked(updatedLikes.includes(currentUser._id));
        } catch (err) {
            console.error("Like failed", err);
        }
    };


    const handleSave = async () => {
        try {
            if (saved) {
                await api.put(`/post/unsavePost/${post._id}`);
            } else {
                await api.put(`/post/savePost/${post._id}`);
            }
            setSaved(!saved);
        } catch (err) {
            console.error("Save failed", err);
        }
    };


    const handleAddComment = async () => {
        if (!comment.trim()) return;
        try {
            await api.post(`/comments/addComment/${post._id}`, { text: comment });
            setComment("");
            fetchComments();
        } catch (err) {
            console.error("Comment failed", err);
        }
    };


    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
            </div>
        );
    }
    if (!post) return <p className="text-center mt-10">Post not found</p>;

    return (
        <div className="max-w-2xl mx-auto mt-6 p-6 bg-white rounded-lg shadow-md text-gray-800">

            <div className="flex items-center gap-3 mb-4 ">
                <img
                    src={post.postedBy?.profileImage || "/default-avatar.png"}
                    alt="user"
                    className="w-12 h-12 rounded-full border object-cover"
                />
                <div>
                    <p className="font-semibold">{post.postedBy?.name}</p>
                    <p className="text-sm text-gray-500">{post.postedBy?.headline}</p>
                    <p className="text-xs text-gray-400">
                        {post.createdAt && format(new Date(post.createdAt), "d MMM yyyy")}
                    </p>
                </div>
            </div>

            <p className="text-gray-800 mb-3 leading-relaxed">{post.content}</p>

            {Array.isArray(post.file) && post.file.length > 0 && (
                <div className="flex justify-center mb-3">
                    <img
                        src={post.file[0]}
                        alt="post"
                        className="rounded-md max-h-[400px] object-contain"
                    />
                </div>
            )}


            <div className="flex justify-between text-sm text-gray-600 border-b pb-2 mb-3">
                <span>{post.likes?.length || 0} Likes</span>
                <span>{post.comments?.length || 0} Comments</span>
            </div>


            <div className="flex justify-around text-gray-600 mb-4">
                <button
                    onClick={handleLike}
                    className="flex items-center gap-2 hover:text-orange-600"
                >
                    {liked ? (
                        <span className="flex items-center gap-2"> <FaThumbsUp className="text-orange-600" />Liked</span>
                    ) : (
                        <span className="flex items-center gap-2"><FaRegThumbsUp /> Like</span>
                    )}{" "}

                </button>

                <button className="flex items-center gap-2 hover:text-red-600">
                    <FaRegCommentDots /> Comment
                </button>

                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 hover:text-red-600"
                >
                    {saved ? (
                        <span className="flex items-center gap-2">
                            <FaBookmark className="text-orange-600" /> Saved
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <FaRegBookmark /> Save
                        </span>
                    )}
                </button>

            </div>


            <div>
                <h3 className="font-semibold mb-3">Comments</h3>


                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="border rounded px-3 py-2 flex-1 text-sm"
                    />
                    <button
                        onClick={handleAddComment}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Post
                    </button>
                </div>


                {comments.length > 0 ? (
                    comments.map((c, idx) => (
                        <div key={idx} className="flex gap-3 mb-3">
                            <img
                                src={c.commentedBy?.profileImage || "/default-avatar.png"}
                                alt="user"
                                className="w-8 h-8 rounded-full border object-cover"
                            />
                            <div className="bg-gray-100 p-2 rounded-lg flex-1">
                                <p className="font-semibold text-sm">
                                    {c.commentedBy?.name || "Unknown User"}
                                </p>
                                <p className="text-gray-700 text-sm">{c.text}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {c.createdAt && format(new Date(c.createdAt), "d MMM yyyy, h:mm a")}

                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No comments yet.</p>
                )}
            </div>

        </div>
    );
};

export default Post;

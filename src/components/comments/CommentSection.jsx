import { useState, useEffect } from "react";
import { FaTrash, FaEdit, FaReply } from "react-icons/fa";
import api from "../../api/axios.js";

const CommentSection = ({ postId, currentUser }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [replyingId, setReplyingId] = useState(null);
    const [replyText, setReplyText] = useState("");

    // mention search
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const fetchComments = async () => {
        try {
            const res = await api.get(`/comments/getPostComments/${postId}`);
            setComments(res.data.comments || []);
        } catch (err) {
            console.error("Failed to load comments", err);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    // detect @ mentions
    const handleChange = async (e) => {
        const value = e.target.value;
        setNewComment(value);

        const words = value.split(" ");
        const lastWord = words[words.length - 1];

        if (lastWord.startsWith("@")) {
            const query = lastWord.slice(1); // remove @
            if (query.length > 1) {
                try {
                    const res = await api.get(`/user/mentionSearch?q=${query}`);
                    setSearchResults(res.data.users);
                    setShowDropdown(true);
                } catch (err) {
                    console.error("Mention search failed", err);
                }
            } else {
                setShowDropdown(false);
            }
        } else {
            setShowDropdown(false);
        }
    };

    const handleSelectUser = (user) => {
        const cursorPos = newComment.lastIndexOf("@");
        const beforeAt = newComment.substring(0, cursorPos); // text before @
        const afterAt = `@${user.name} `; // insert selected mention + space
        setNewComment(beforeAt + afterAt);
        setShowDropdown(false);
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;
        try {
            await api.post(`/comments/addComment/${postId}`, {
                text: newComment,
            });
            setNewComment("");
            fetchComments();
        } catch (err) {
            console.error("Failed to add comment", err);
        }
    };

    //  Edit comment
    const handleEditComment = async (commentId) => {
        try {
            await api.patch(`/comments/editComment/${commentId}/${postId}`, {
                text: newComment,
            });
            setEditingId(null);
            setNewComment("");
            fetchComments();
        } catch (err) {
            console.error("Failed to edit comment", err);
        }
    };

    //  Delete comment
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await api.delete(`/comments/deleteComment/${commentId}/${postId}`);
            fetchComments();
        } catch (err) {
            console.error("Failed to delete comment", err);
        }
    };

    //  Reply to a comment
    const handleReply = async (parentId) => {
        if (!replyText.trim()) return;
        try {
            await api.post(`/comments/addComment/${postId}`, {
                text: replyText,
                parentComment: parentId,
            });
            setReplyingId(null);
            setReplyText("");
            fetchComments();
        } catch (err) {
            console.error("Failed to reply", err);
        }
    };

    return (
        <div className="mt-3 text-black">
            {/* Add new comment */}
            <div className="flex gap-2 relative">
                <input
                    type="text"
                    value={newComment}
                    onChange={handleChange}
                    placeholder="Write a comment..."
                    className="border rounded px-3 py-2 flex-1 text-sm"
                />
                {editingId ? (
                    <button
                        onClick={() => handleEditComment(editingId)}
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Save
                    </button>
                ) : (
                    <button
                        onClick={handleAddComment}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Post
                    </button>
                )}

                {showDropdown && (
                    <div className="absolute top-10 left-0 border bg-white shadow-md rounded w-64 max-h-40 overflow-y-auto z-50">
                        {searchResults.map((u) => (
                            <div
                                key={u._id}
                                onClick={() => handleSelectUser(u)}
                                className="px-3 py-2 hover:bg-gray-200 cursor-pointer flex items-center gap-2"
                            >
                                <img
                                    src={u.profileImage || "/default-avatar.png"}
                                    alt={u.name}
                                    className="w-6 h-6 rounded-full"
                                />
                                <span>{u.name}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* get comments */}
            <div className="mt-4 space-y-3">
                {comments.length === 0 && (
                    <p className="text-gray-500 text-sm">No comments yet.</p>
                )}
                {comments.map((c) => (
                    <div key={c._id} className="border-b pb-2">
                        <p className="text-sm">
                            <span className="font-semibold">
                                {c.commentedBy?.name}
                            </span>
                            : {c.text}
                        </p>

                        {/* buttons */}
                        <div className="flex gap-3 text-xs mt-1 text-gray-600">
                            {currentUser?._id === c.commentedBy?._id && (
                                <>
                                    <button
                                        onClick={() => {
                                            setEditingId(c._id);
                                            setNewComment(c.text);
                                        }}
                                        className="flex items-center gap-1"
                                    >
                                        <FaEdit /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteComment(c._id)}
                                        className="flex items-center gap-1 text-red-500"
                                    >
                                        <FaTrash /> Delete
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() =>
                                    setReplyingId(
                                        replyingId === c._id ? null : c._id
                                    )
                                }
                                className="flex items-center gap-1"
                            >
                                <FaReply /> Reply
                            </button>
                        </div>

                        {/* Reply box */}
                        {replyingId === c._id && (
                            <div className="ml-6 mt-2 flex gap-2">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) =>
                                        setReplyText(e.target.value)
                                    }
                                    placeholder="Write a reply..."
                                    className="border rounded px-2 py-1 flex-1 text-sm"
                                />
                                <button
                                    onClick={() => handleReply(c._id)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                                >
                                    Reply
                                </button>
                            </div>
                        )}

                        {/* Replies */}
                        {c.replies?.length > 0 && (
                            <div className="ml-6 mt-2 space-y-1">
                                {c.replies.map((r) => (
                                    <p
                                        key={r._id}
                                        className="text-xs text-gray-700"
                                    >
                                        <span className="font-semibold">
                                            {r.commentedBy?.name}
                                        </span>
                                        : {r.text}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentSection;

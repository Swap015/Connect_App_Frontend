import { useState } from "react";
import { FaRegCommentDots, FaRegThumbsUp, FaThumbsUp, FaRegBookmark, FaBookmark, FaEllipsisH } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import EditPostModal from "./EditPostModal.jsx";
import api from "../../api/axios.js";
import CommentSection from "../comments/CommentSection.jsx"

const PostCard = ({ post, currentUser, timeAgo, liked, handleLike, onDelete, onEdit }) => {
    const [zoomedImg, setZoomedImg] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [saved, setSaved] = useState(currentUser?.savedPosts?.includes(post._id));
    const [showComments, setShowComments] = useState(false);

    const isOwner = currentUser?._id === post.postedBy?._id;

    const getFileType = (url) => {
        if (!url) return null;
        const ext = url.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "webp"].includes(ext)) return "image";
        if (["mp4", "mov", "webm"].includes(ext)) return "video";
        if (["pdf"].includes(ext)) return "pdf";
        return "other";
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await api.delete(`/post/deletePost/${post._id}`);
            if (onDelete) onDelete(post._id);
        } catch (err) {
            console.error("Failed to delete post", err);
            alert("Failed to delete post");
        }
    };

    const handleSave = async () => {
        try {
            if (!saved) {
                await api.put(`/post/savePost/${post._id}`, {}, { withCredentials: true });
                setSaved(true);
            } else {
                await api.put(`/post/unsavePost/${post._id}`, {}, { withCredentials: true });
                setSaved(false);
            }
        } catch (err) {
            console.error("Failed to toggle save", err);
            alert("Failed to save/unsave post");
        }
    };

    return (
        <div className="card bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-lg transition relative">

            {/* User info */}
            <div className="flex items-center justify-between ">
                <div className="flex items-center gap-3 ">
                    <img
                        src={post.postedBy?.profileImage}
                        alt="user"
                        className="w-10 h-10 lg:w-12 lg:h-12 rounded-full object-cover border"
                    />
                    <div>
                        <h4 className="font-semibold text-xs lg:text-sm 3xl:text-base text-gray-800">{post.postedBy?.name}</h4>
                        <p className="text-xs text-gray-500 ">{timeAgo(post.createdAt)}</p>
                    </div>
                </div>

                {isOwner && (
                    <div className="relative">
                        <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-gray-200 rounded-full text-black">
                            <FaEllipsisH />
                        </button>
                        {menuOpen && (
                            <div className="absolute right-0 top-8 bg-white border shadow-lg rounded-md z-50 w-28">
                                <button
                                    onClick={() => { setEditModalOpen(true); setMenuOpen(false); }}
                                    className="w-full text-left px-4 py-2 hover:bg-gray-200 text-black"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* post content */}
            {post.content && <p className="mt-3 text-sm lg:text-base text-gray-700">{post.content}</p>}

            {/* post images */}
            {post.file?.length > 0 && (
                <div className="mt-3 ">
                    <Carousel
                        showArrows={post.file.length > 1}
                        showThumbs={false}
                        infiniteLoop={false}
                        showStatus={false}
                        emulateTouch
                        swipeable
                        dynamicHeight
                        showIndicators={post.file.length > 1}

                    >
                        {post.file.map((file, idx) => {
                            const type = getFileType(file);
                            if (type === "image") {
                                return (
                                    <div key={idx} className="cursor-pointer" onClick={() => setZoomedImg(file)}>
                                        <img src={file} alt="post" className="rounded-lg max-h-96 w-full object-contain" />
                                    </div>
                                );
                            }
                            if (type === "video") {
                                return (
                                    <div key={idx}>
                                        <video src={file} controls className="rounded-lg w-full max-h-96 object-contain" />
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </Carousel>
                </div>
            )}

            {/* buttons */}
            <div className="flex gap-6 mt-4 text-gray-600 border-t pt-3 ">
                <button onClick={() => handleLike(post._id)} className={`flex text-sm lg:text-base items-center gap-2 ${liked ? "text-orange-500" : ""}`}>
                    {liked ? <FaThumbsUp /> : <FaRegThumbsUp />} {post.likesCount || post.likes?.length || 0}
                </button>
                <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-sm lg:text-base">
                    <FaRegCommentDots /> {post.comments?.length || 0}
                </button>
                <button onClick={handleSave} className={`flex items-center text-sm lg:text-base gap-2 ${saved ? "text-red-500" : ""}`}>
                    {saved ? <FaBookmark /> : <FaRegBookmark />}
                </button>
            </div>

            {/* zoom modal */}
            {zoomedImg && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="relative">
                        <img src={zoomedImg} alt="zoom" className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain" />
                        <button onClick={() => setZoomedImg(null)} className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded-full shadow-md">✕</button>
                    </div>
                </div>
            )}

            {/* edit post modal */}
            {editModalOpen && (
                <EditPostModal
                    post={post}
                    isOpen={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    onEdit={(newContent) => {
                        if (onEdit) onEdit(post._id, newContent);
                        setEditModalOpen(false);
                    }}
                />
            )}
            {/*comment section */}
            {showComments && (
                <CommentSection postId={post._id} currentUser={currentUser} />
            )}
        </div>
    );
};

export default PostCard;

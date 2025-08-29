import { useState } from "react";
import { FaRegCommentDots, FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const PostCard = ({ post, timeAgo, liked, handleLike }) => {
    const [openModal, setOpenModal] = useState(false);
    const [zoomedImg, setZoomedImg] = useState(null);

    const getFileType = (url) => {
        if (!url) return null;
        const ext = url.split(".").pop().toLowerCase();
        if (["jpg", "jpeg", "png", "webp"].includes(ext)) return "image";
        if (["mp4", "mov", "webm"].includes(ext)) return "video";
        if (["pdf"].includes(ext)) return "pdf";
        return "other";
    };

    return (
        <div className="card bg-white shadow-md rounded-xl p-5 border border-gray-100 hover:shadow-lg transition">

            {/* user info */}
            <div className="flex items-center gap-3">
                <img
                    src={post.postedBy?.profileImage || "/default-avatar.png"}
                    alt="user"
                    className="w-10 h-10 rounded-full object-cover border"
                />
                <div>
                    <h4 className="font-semibold text-gray-800">{post.postedBy?.name}</h4>
                    <p className="text-xs text-gray-500">{timeAgo(post.createdAt)}</p>
                </div>
            </div>

            {/* post text */}
            {post.content && <p className="mt-3 text-gray-700">{post.content}</p>}

            {/* post media */}
            {post.file?.length > 0 && (
                <div className="mt-3">
                    <Carousel
                        showArrows={true}
                        showThumbs={false}
                        infiniteLoop={false}
                        showStatus={false}
                        emulateTouch
                        swipeable
                        dynamicHeight={true}
                    >
                        {post.file.map((file, index) => {
                            const type = getFileType(file);

                            if (type === "image") {
                                return (
                                    <div
                                        key={index}
                                        className="cursor-pointer"
                                        onClick={() => {
                                            setZoomedImg(file);
                                            setOpenModal(true);
                                        }}
                                    >
                                        <img
                                            src={file}
                                            alt="post"
                                            className="rounded-lg max-h-96 w-full object-contain"
                                        />
                                    </div>
                                );
                            }

                            if (type === "video") {
                                return (
                                    <div key={index}>
                                        <video
                                            src={file}
                                            controls
                                            className="rounded-lg w-full max-h-96 object-contain"
                                        />
                                    </div>
                                );
                            }

                            if (type === "pdf") {
                                return <PDFPreview key={index} url={file} />;
                            }

                            return null;
                        })}
                    </Carousel>
                </div>
            )}

            {/* buttons */}
            <div className="flex gap-6 mt-4 text-gray-600 border-t pt-3">
                <button
                    onClick={() => handleLike(post._id)}
                    className={`flex items-center gap-2 transition ${liked
                        ? "text-orange-500 scale-110"
                        : "hover:text-orange-500"
                        }`}
                >
                    {liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    {post.likesCount || post.likes?.length || 0}
                </button>

                <button className="flex items-center gap-2 hover:text-orange-500 transition">
                    <FaRegCommentDots /> {post.comments?.length || 0}
                </button>
            </div>

            {/* zoom modal */}
            {openModal && zoomedImg && (
                <div className="fixed inset-0 bg-black/80 min-h-screen flex items-center justify-center z-50">
                    <div className="relative">
                        <img
                            src={zoomedImg}
                            alt="zoom"
                            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
                        />
                        <button
                            onClick={() => setOpenModal(false)}
                            className="absolute top-2 right-2 bg-white text-black px-2 py-1 rounded-full shadow-md"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;

import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import PostCard from "../posts/PostCard.jsx";
import UserContext from "../Context/UserContext.jsx";
import api from "../../api/axios.js";


const SinglePost = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);

    const { user } = useContext(UserContext);

    // 🧩 Fetch Single Post
    const fetchPost = async () => {
        try {
            const res = await api.get(`/post/getPost/${postId}`);
            const postData = res.data.post;
            setPost(postData);
            setLiked(postData.likes?.includes(user?._id));
           
        } catch (err) {
            console.error("Error fetching post:", err);
        } finally {
            setLoading(false);
        }
    };

    // 👍 Handle Like / Unlike
    const handleLike = async (postId) => {
        try {
            setLiked((prev) => !prev); // instantly toggle in UI
            await api.patch(`/post/likePost/${postId}`, {}, { withCredentials: true });
            const res = await api.get(`/post/getPost/${postId}`);
            setPost(res.data.post);
        } catch (err) {
            console.error("Error liking/unliking post:", err);
        }
    };



    useEffect(() => {
        fetchPost();
    }, [postId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-900">
                <span className="loading loading-spinner w-16 h-16 text-orange-500"></span>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex justify-center items-center text-gray-900 bg-white text-sm md:text-base lg:text-xl 2xl:text-2xl">
                Post not found 😕
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#fad0e9] via-[#ffc7c5] flex justify-center items-start px-3 sm:px-6 pt-6 pb-20">
            <div className="w-full max-w-2xl p-3 sm:p-5 md:p-6  ">
                <PostCard
                    post={post}
                    currentUser={user}
                    liked={liked}
                    handleLike={handleLike}
                    
                   
                />
            </div>
        </div>
    );
};

export default SinglePost;

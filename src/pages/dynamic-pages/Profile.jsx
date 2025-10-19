import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import api from "../../api/axios.js";
import { toast } from "react-toastify";
import UserContext from "../../components/Context/UserContext.jsx";
import PostCard from "../../components/posts/PostCard.jsx";

const Profile = () => {
    const { id } = useParams();
    const { user: loggedInUser } = useContext(UserContext);
    const [profileUser, setProfileUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    const hasEducation = profileUser.education?.some(edu =>
        edu.SSC || edu.HSC || edu.diploma || edu.degree
    );


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get(`/user/getUser/${id}`);
                setProfileUser(res.data.user);

            } catch {
                toast.error("Failed to load user");
            }
        };
        fetchUser();
    }, [id, loggedInUser]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (!id) return;
                const res = await api.get(`/post/userPosts/${id}`, { withCredentials: true });
                setPosts(res.data.posts || []);
            } catch {
                toast.error("Failed to load posts");
            }
        };
        fetchPosts();
    }, [id]);

    const handleMessage = async () => {
        try {
            const res = await api.post("/chat/conversation", { otherUserId: id });
            const conversation = res.data.conversation;

            navigate("/messages", { state: { conversationId: conversation._id } });
        } catch {
            toast.error("Failed to start message");
        }
    };

    if (!profileUser) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <span className="loading loading-spinner w-13 h-17 text-orange-500"></span>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto mt-6 p-5 text-gray-800 space-y-3">

            {/* --- Profile Header --- */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                    src={profileUser.profileImage}
                    alt={profileUser.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-gray-300 object-cover"
                />
                <div className="flex-1 text-center sm:text-left">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl  font-bold">{profileUser.name}</h2>
                    <p className="text-gray-600 mt-1 text-xs sm:text-sm">{profileUser.headline}</p>
                    <p className="text-gray-500 mt-1 text-xs  sm:text-sm">{profileUser.location}</p>
                </div>
                {loggedInUser && id !== loggedInUser._id && (
                    <button
                        onClick={handleMessage}
                        className="mt-2 sm:mt-0 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm sm:text-base font-semibold transition"
                    >
                        Message
                    </button>
                )}
            </div>

            {/* --- Work Section --- */}

            {(profileUser.companyName || profileUser.positionAtCompany || profileUser.experience) && (
                <div className="p-4 ">
                    <h3 className="text-lg sm:text-xl xl:text-2xl font-semibold mb-2">💼 Work</h3>
                    {profileUser.companyName && (
                        <p className="text-sm lg:text-base 3xl:text-xl">
                            <span className="font-semibold">Company:</span> {profileUser.companyName}
                        </p>
                    )}
                    {profileUser.positionAtCompany && (
                        <p className="text-sm lg:text-base 3xl:text-xl">
                            <span className="font-semibold">Position:</span> {profileUser.positionAtCompany}
                        </p>
                    )}
                    {profileUser.experience && (
                        <p className="text-sm lg:text-base 3xl:text-xl">
                            <span className="font-semibold">Experience:</span> {profileUser.experience}
                        </p>
                    )}

                </div>
            )}

            {/* --- Education Section --- */}

            {hasEducation && (
                <div className="bg-gray-50 ">
                    <h3 className="text-lg sm:text-xl xl:text-2xl font-semibold mb-2">🎓 Education</h3>

                    <ul className=" ml-6 space-y-1">
                        {profileUser.education.map((edu, i) => (
                            <li key={i} className="text-sm lg:text-base 3xl:text-xl">
                                {edu.SSC && <p>SSC: {edu.SSC}</p>}
                                {edu.HSC && <p>HSC: {edu.HSC}</p>}
                                {edu.diploma && <p>Diploma: {edu.diploma}</p>}
                                {edu.degree && <p>Graduation: {edu.degree}</p>}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* --- Skills Section --- */}

            {profileUser?.skills?.some(skill => skill && skill.trim() !== "") && (
                <div className="bg-gray-50 pt-4 ">
                    <h3 className="text-lg sm:text-xl xl:text-2xl font-semibold mb-2">🛠 Skills</h3>

                    <div className="flex flex-wrap text-sm lg:text-base 3xl:text-xl">
                        {profileUser.skills.join(", ")}
                    </div>

                </div>
            )}

            {/* --- Connections Section --- */}

            <div className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex flex-wrap gap-6">
                <div className="text-sm lg:text-base 3xl:text-xl"><span className="font-semibold">Connections:</span> {profileUser.connections?.length || 0}</div>
                <div className="text-sm lg:text-base 3xl:text-xl"><span className="font-semibold">Followers:</span> {profileUser.followers?.length || 0}</div>
                <div className="text-sm lg:text-base 3xl:text-xl"><span className="font-semibold">Following:</span> {profileUser.following?.length || 0}</div>
            </div>

            {/* --- Posts Section --- */}
            <div className="mt-6">
                <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-2xl font-semibold mb-4 border-b pb-2">📝 Posts</h3>
                {posts.length > 0 ? (
                    <div className="space-y-6">
                        {posts.map(post => (
                            <PostCard
                                key={post._id}
                                post={post}
                                currentUser={loggedInUser}
                                liked={post.likes?.includes(loggedInUser?._id)}
                                handleLike={async postId => {
                                    try {
                                        await api.patch(`/post/likePost/${postId}`, {}, { withCredentials: true });
                                        setPosts(prev =>
                                            prev.map(p =>
                                                p._id === postId
                                                    ? { ...p, likes: p.likes.includes(loggedInUser._id) ? p.likes.filter(uid => uid !== loggedInUser._id) : [...p.likes, loggedInUser._id] }
                                                    : p
                                            )
                                        );
                                    } catch { toast.error("Error liking post"); }
                                }}
                                onDelete={postId => setPosts(prev => prev.filter(p => p._id !== postId))}
                                onEdit={(postId, newContent) =>
                                    setPosts(prev => prev.map(p => (p._id === postId ? { ...p, content: newContent } : p)))
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No posts yet</p>
                )}
            </div>

        </div>

    );
};

export default Profile;

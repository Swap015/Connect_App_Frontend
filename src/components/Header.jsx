import { useState, useEffect, useContext } from "react";
import { AiFillMessage, AiOutlineSearch } from "react-icons/ai";
import {
    FaHome,
    FaUserFriends,
    FaBriefcase,
    FaBell,
    FaUserCircle,
    FaBars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "./Context/UserContext";

const Header = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState({ users: [], posts: [] });
    const [showDropdown, setShowDropdown] = useState(false);


    useEffect(() => {
        const fetchResults = async () => {
            if (!query.trim()) {
                setResults({ users: [], posts: [] });
                return;
            }
            try {
                const [userRes, postRes] = await Promise.all([
                    axios.get(`http://localhost:7000/api/user/search?keyword=${query}`, { withCredentials: true }),
                    axios.get(`http://localhost:7000/api/post/search?keyword=${query}`, { withCredentials: true })
                ]);
                setResults({
                    users: userRes.data.users || [],
                    posts: postRes.data.posts || []
                });
                setShowDropdown(true);
            } catch (err) {
                console.error("Search failed", err);
            }
        };

        const delayDebounce = setTimeout(fetchResults, 400);
        return () => clearTimeout(delayDebounce);
    }, [query]);

    const handleJobsClick = async () => {
        try {
            if (!user) {
                if (user.role === "recruiter") {
                    navigate("/jobsControl");
                } else {
                    navigate("/jobs");
                }
            }

        } catch (err) {
            console.warn("Could not determine user role, defaulting to /jobs", err);

            navigate("/jobs");
        }
    };

    const handleSelectUser = (id) => {
        navigate(`/profile/${id}`);
        setShowDropdown(false);
        setQuery("");
    };

    const handleSelectPost = (id) => {
        navigate(`/post/${id}`);
        setShowDropdown(false);
        setQuery("");
    };

    return (
        <header className="flex items-center justify-between bg-gradient-to-r from-[#f6d365] to-[#fe6f48] pl-2 pr-5 shadow-md sm:pl-5 sm:pr-12 sm:py-0.5">

            {/* left mobile menu  */}
            <div className="dropdown dropdown-end md:hidden">
                <label tabIndex={0} className="btn btn-ghost hover:bg-white">
                    <FaBars className="text-xl text-gray-800" />
                </label>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-35 left-0">
                    <li onClick={() => navigate("/")}><a className="flex items-center gap-2"><FaHome /> Home</a></li>
                    <li onClick={() => navigate("/connections")}><a className="flex items-center gap-2"><FaUserFriends /> Connections</a></li>
                    <li onClick={() => navigate("/messages")}><a className="flex items-center gap-2"><AiFillMessage /> Messages</a></li>
                    <li onClick={handleJobsClick}><a className="flex items-center gap-2"><FaBriefcase /> Jobs</a></li>
                    <li onClick={() => navigate("/notifications")}><a className="flex items-center gap-2"><FaBell /> Notifications</a></li>
                    <li onClick={() => navigate("/editProfile")}><a className="flex items-center gap-2"><FaUserCircle /> Profile</a></li>
                </ul>
            </div>

            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                <img
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
                    src="https://res.cloudinary.com/swapcloud/image/upload/v1755720079/Logo_wdvg4h.png"
                    alt="Logo"
                />
                <span className="hidden sm:block font-bold text-sm md:text-lg lg:text-xl text-gray-800 hover:text-gray-950">
                    Connect
                </span>
            </div>

            {/*  search bar dropdown  */}
            <div className="flex-1 flex justify-center px-4 relative">
                <div className="relative w-full max-w-sm">
                    <AiOutlineSearch className="absolute left-3 top-2.5 text-gray-700 text-lg" />
                    <input
                        type="text"
                        placeholder="Search users, posts..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query && setShowDropdown(true)}
                        className="w-full pl-10 pr-4 py-2 rounded-full bg-white/70 backdrop-blur-md shadow-md border border-black/30 focus:outline-none focus:ring-2 focus:ring-black text-black text-sm font-semibold"
                    />


                    {showDropdown && (results.users.length > 0 || results.posts.length > 0) && (
                        <div className="absolute mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 max-h-80 overflow-y-auto z-50">

                            {results.users.length > 0 && (
                                <div>
                                    <h4 className="px-3 py-1 text-xs font-bold text-gray-600">Users</h4>
                                    {results.users.map((u) => (
                                        <div
                                            key={u._id}
                                            onClick={() => handleSelectUser(u._id)}
                                            className="flex items-center gap-2 px-3 py-2 text-black hover:bg-gray-100 cursor-pointer"
                                        >
                                            <img src={u.profileImage} alt="user" className="w-8 h-8 rounded-full" />
                                            <div>
                                                <p className="text-sm font-bold">{u.name}</p>
                                                <p className="text-xs text-gray-500">{u.headline || "No headline"}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* posts */}
                            {results.posts.length > 0 && (
                                <div>
                                    <h4 className="px-3 py-1 text-xs font-bold text-gray-500">Posts</h4>
                                    {results.posts.map((p) => (
                                        <div
                                            key={p._id}
                                            onClick={() => handleSelectPost(p._id)}
                                            className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <p className="text-sm text-gray-800 line-clamp-1">{p.content}</p>
                                            <p className="text-xs text-gray-500">by {p.postedBy?.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-none">
                <ul className="hidden md:flex gap-6 items-center text-gray-800 font-medium">
                    {user?.role === "admin" ? (
                        <>
                            <li onClick={() => navigate("/")} className="flex flex-col items-center cursor-pointer hover:text-white">
                                <FaHome className="text-xl" />
                                <span className="text-xs font-bold">Home</span>
                            </li>
                            <li onClick={() => navigate("/connections")} className="flex flex-col items-center cursor-pointer hover:text-white">
                                <FaUserFriends className="text-xl" />
                                <span className="text-xs font-bold">Users</span>
                            </li>
                            <li onClick={() => navigate(user?.role === "recruiter" ? "/jobsControl" : "/jobs")} className="flex flex-col items-center cursor-pointer hover:text-white">
                                <FaBriefcase className="text-xl" />
                                <span className="text-xs font-bold">Jobs</span>
                            </li>
                            <li onClick={() => navigate("/notifications")} className="flex flex-col items-center cursor-pointer hover:text-white">
                                <FaBell className="text-xl" />
                                <span className="text-xs font-bold">Notifications</span>
                            </li>
                            <li onClick={() => navigate("/editProfile")} className="flex flex-col items-center cursor-pointer hover:text-white">
                                <FaUserCircle className="text-xl" />
                                <span className="text-xs font-bold">Profile</span>
                            </li>
                        </>
                    ) : (
                        <>
                            <li onClick={() => navigate("/")} className="flex flex-col items-center cursor-pointer hover:text-white">
                                <FaHome className="text-xl" />
                                <span className="text-xs font-bold">Home</span>
                            </li>
                            <li onClick={() => navigate("/connections")} className="flex flex-col items-center cursor-pointer hover:text-white">
                                <FaUserFriends className="text-xl" />
                                <span className="text-xs font-bold">Connections</span>
                            </li>
                            <li onClick={() => navigate("/messages")} className="flex flex-col items-center cursor-pointer hover:text-white">
                                <AiFillMessage className="text-xl" />
                                <span className="text-xs font-bold">Messages</span>
                            </li>
                            <li onClick={() => navigate(user?.role === "recruiter" ? "/jobsControl" : "/jobs")} className="flex flex-col items-center cursor-pointer hover:text-white">
                                <FaBriefcase className="text-xl" />
                                <span className="text-xs font-bold">Jobs</span>
                            </li>
                            <li onClick={() => navigate("/notifications")} className="flex flex-col items-center cursor-pointer hover:text-white">
                                <FaBell className="text-xl" />
                                <span className="text-xs font-bold">Notifications</span>
                            </li>
                            <li onClick={() => navigate("/editProfile")} className="flex flex-col items-center cursor-pointer hover:text-white">
                                <FaUserCircle className="text-xl" />
                                <span className="text-xs font-bold">Profile</span>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </header>
    );
};

export default Header;

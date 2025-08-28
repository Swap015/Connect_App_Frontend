
import { AiFillMessage } from "react-icons/ai";
import {
    FaHome,
    FaUserFriends,
    FaBriefcase,
    FaBell,
    FaUserCircle,
    FaBars,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Header = () => {

    const navigate = useNavigate();
    return (
        <header className="flex items-center justify-between bg-gradient-to-r from-[#f6d365] to-[#fe6f48] pl-2  pr-5 shadow-md sm:pl-5 sm:pr-12 sm:py-0.5">
            {/* mobile 3-bars button */}

            <div className="dropdown dropdown-end md:hidden">
                <label tabIndex={0} className="btn btn-ghost hover:bg-white">
                    <FaBars className="text-xl text-gray-800" />
                </label>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-35 left-0">
                    <li onClick={() => navigate("/home")}><a className="flex items-center gap-2" ><FaHome /> Home</a></li>
                    <li><a className="flex items-center gap-2"><FaUserFriends /> Connections</a></li>
                    <li><a className="flex items-center gap-2"><AiFillMessage /> Messages</a></li>
                    <li><a className="flex items-center gap-2"><FaBriefcase /> Jobs</a></li>
                    <li><a className="flex items-center gap-2"><FaBell /> Notifications</a></li>
                    <li onClick={() => navigate("/editProfile")}><a className="flex items-center gap-2"><FaUserCircle /> Profile</a></li>
                </ul>
            </div>

            {/* app logo */}

            <div className="flex items-center gap-2" onClick={() => navigate("/home")}>
                <img
                    className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 cursor-pointer"
                    src="https://res.cloudinary.com/swapcloud/image/upload/v1755720079/Logo_wdvg4h.png"
                    alt="Logo"
                />
                <span className="hidden sm:block font-bold text-sm md:text-lg lg:text-xl text-gray-800 hover:text-gray-950 text cursor-pointer ">
                    Connect
                </span>
            </div>

            {/*  Search Bar */}
            <div className="flex-1 flex justify-center px-4">
                <div className="relative w-full max-w-sm ">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-10 pr-4 py-1 sm:py-2 rounded-full bg-white/40 backdrop-blur-md shadow-inner border border-black/60 focus:outline-none focus:ring-2 focus:ring-black text-black text-sm font-bold"
                    />
                </div>
            </div>


            {/* nav items */}
            <div className="flex-none">
                <ul className="hidden md:flex gap-6 items-center text-gray-800 font-medium">
                    <li className="flex flex-col items-center cursor-pointer hover:text-white" onClick={() => navigate("/home")}>
                        <FaHome className="text-xl" />
                        <span className="text-xs font-bold">Home</span>
                    </li>
                    <li className="flex flex-col items-center cursor-pointer hover:text-white">
                        <FaUserFriends className="text-xl" />
                        <span className="text-xs font-bold">Connections</span>
                    </li>
                    <li className="flex flex-col items-center cursor-pointer hover:text-white">
                        <AiFillMessage className="text-xl" />
                        <span className="text-xs font-bold">Messages</span>
                    </li>
                    <li className="flex flex-col items-center cursor-pointer hover:text-white">
                        <FaBriefcase className="text-xl" />
                        <span className="text-xs font-bold">Jobs</span>
                    </li>
                    <li className="flex flex-col items-center cursor-pointer hover:text-white">
                        <FaBell className="text-xl" />
                        <span className="text-xs font-bold">Notifications</span>
                    </li>
                    <li onClick={() => navigate("/editProfile")} className="flex flex-col items-center cursor-pointer hover:text-white">
                        <FaUserCircle className="text-xl" />
                        <span className="text-xs font-bold">Profile</span>
                    </li>
                </ul>


            </div>
        </header>
    );
};

export default Header;

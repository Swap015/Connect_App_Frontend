
import { AiFillMessage } from "react-icons/ai";
import {
    FaHome,
    FaUserFriends,
    FaBriefcase,
    FaBell,
    FaUserCircle,
    FaSearch,
    FaBars,
} from "react-icons/fa";

const Header = () => {
    return (
        <header className="navbar bg-[#BBDCE5] px-4 shadow-md">
            {/* app logo */}
            <div className="flex items-center gap-2">
                <img
                    className="w-12 h-12"
                    src="https://res.cloudinary.com/swapcloud/image/upload/v1755720079/Logo_wdvg4h.png"
                    alt="Logo"
                />
                <span className="hidden sm:block font-bold text-xl  text-gray-800">
                    ConnectApp
                </span>
            </div>

            {/*  Search Bar */}
            <div className="flex-1 flex justify-center px-4">
                <div className="relative w-full max-w-sm hidden sm:block">
                    <FaSearch className="absolute left-3 top-3 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="input input-bordered w-full pl-10"
                    />
                </div>
            </div>

            {/* nav items */}
            <div className="flex-none">
                <ul className="hidden md:flex gap-6 items-center text-gray-800 font-medium">
                    <li className="flex flex-col items-center cursor-pointer hover:text-indigo-700">
                        <FaHome className="text-2xl" />
                        <span className="text-sm font-bold">Home</span>
                    </li>
                    <li className="flex flex-col items-center cursor-pointer hover:text-cyan-700">
                        <FaUserFriends className="text-2xl" />
                        <span className="text-sm font-bold">My Network</span>
                    </li>
                    <li className="flex flex-col items-center cursor-pointer hover:text-blue-600">
                        <AiFillMessage className="text-2xl" />
                        <span className="text-sm font-bold">Chat</span>
                    </li>
                    <li className="flex flex-col items-center cursor-pointer hover:text-blue-600 ">
                        <FaBriefcase className="text-2xl" />
                        <span className="text-sm font-bold">Jobs</span>
                    </li>
                    <li className="flex flex-col items-center cursor-pointer hover:text-blue-600">
                        <FaBell className="text-2xl" />
                        <span className="text-sm font-bold">Notifications</span>
                    </li>
                    <li className="flex flex-col items-center cursor-pointer hover:text-blue-600">
                        <FaUserCircle className="text-2xl" />
                        <span className="text-sm font-bold">Profile</span>
                    </li>
                </ul>

                {/* mobile menu button */}
                <div className="dropdown dropdown-end md:hidden">
                    <label tabIndex={0} className="btn btn-ghost">
                        <FaBars className="text-2xl text-gray-800" />
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                        <li><a className="flex items-center gap-2"><FaHome /> Home</a></li>
                        <li><a className="flex items-center gap-2"><FaUserFriends /> My Network</a></li>
                        <li><a className="flex items-center gap-2"><FaBriefcase /> Jobs</a></li>
                        <li><a className="flex items-center gap-2"><FaBell /> Notifications</a></li>
                        <li><a className="flex items-center gap-2"><FaUserCircle /> Profile</a></li>
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Header;

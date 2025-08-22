import { FaGithub, FaLinkedin } from "react-icons/fa";
import { TbBrandGmail } from "react-icons/tb";

const Footer = () => {
    return (
        <footer className="bg-[#ffb45e] text-gray-800 py-4 px-14 mt-auto">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">

                {/* logo & app name */}
                <div className="flex items-center gap-2">
                    <img
                        className="w-13 h-13 sm:w-17 sm:h-16  md:w-20 md:h-20"
                        src="https://res.cloudinary.com/swapcloud/image/upload/v1755720079/Logo_wdvg4h.png"
                        alt="Logo"
                    />
                    <span className="font-bold text-sm md:text-lg lg:text-xl tracking-wide">Connect</span>
                </div>

                {/* middle links */}
                <ul className="flex flex-wrap justify-center gap-6 text-sm md:text-lg font-medium">
                    {["About", "Terms", "Contact Us"].map((item, i) => (
                        <li
                            key={i}
                            className="relative cursor-pointer after:content-[''] after:block after:w-0 after:h-[2px] after:bg-gray-700 after:transition-all after:duration-300 hover:after:w-full"
                        >
                            {item}
                        </li>
                    ))}
                </ul>

                {/* social media links */}
                <div className="flex gap-4 text-lg md:text-2xl lg:text-3xl">
                    <a href="https://github.com/Swap015" className="p-2 rounded-full bg-white/60 hover:bg-white shadow-md transition" target="_blank">
                        <FaGithub />
                    </a>
                    <a href="https://www.linkedin.com/in/swapnil-motghare/" className="p-2 rounded-full bg-white/60 hover:bg-white shadow-md transition" target="_blank">
                        <FaLinkedin className="text-blue-600" />
                    </a>
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=swapnilmotghare44@gmail.com" className="p-2 rounded-full bg-white/60 hover:bg-white shadow-md transition" target="_blank">
                        <TbBrandGmail className="text-red-500" />
                    </a>
                </div>
            </div>

            {/* copyright */}
            <div className="border-t border-white mt-6 pt-3 text-center text-sm md:text-md  text-gray-700">
                © {new Date().getFullYear()} <span className="font-semibold">ConnectApp</span> · All rights reserved
            </div>
        </footer>
    );
};

export default Footer;

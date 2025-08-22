import { FaGithub, FaLinkedin } from "react-icons/fa";
import { TbBrandGmail } from "react-icons/tb";

const Contact = () => {
    return (
        <section className="w-full bg-gradient-to-b from-white to-gray-50 py-16 px-6">
            <div className="max-w-5xl mx-auto text-center">
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-6">
                    Get in <span className="bg-gradient-to-r from-[#f6d365] to-[#fe6f48] bg-clip-text text-transparent">Touch</span>
                </h1>
                <p className="text-md sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-12">
                    We’d love to connect with you!
                    Find us on these platforms:
                </p>
            </div>

            {/* social media links*/}
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8">

                {/* GitHub */}
                <a
                    href="https://github.com/Swap015"
                    target="_blank"
                    className="flex flex-col items-center gap-3 p-8 rounded-xl shadow-lg shadow-gray-300 bg-white hover:shadow-[#333]/50 hover:scale-105 transition"
                >
                    <FaGithub className="text-5xl text-gray-800" />
                    <h2 className="font-semibold text-gray-700">GitHub</h2>
                    <p className="text-sm text-gray-500">Explore my projects & code.</p>
                </a>

                {/* LinkedIn */}
                <a
                    href="https://www.linkedin.com/in/swapnil-motghare/"
                    target="_blank"
                    className="flex flex-col items-center gap-3 p-8 rounded-xl shadow-lg shadow-gray-300 bg-white hover:shadow-blue-500/50 hover:scale-105 transition"
                >
                    <FaLinkedin className="text-5xl text-blue-600" />
                    <h2 className="font-semibold text-gray-700">LinkedIn</h2>
                    <p className="text-sm text-gray-500">Connect professionally with me.</p>
                </a>

                {/* Gmail */}
                <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=swapnilmotghare44@gmail.com"
                    target="_blank"
                    className="flex flex-col items-center gap-3 p-8 rounded-xl shadow-lg shadow-gray-300 bg-white hover:shadow-red-500/50 hover:scale-105 transition"
                >
                    <TbBrandGmail className="text-5xl text-red-500" />
                    <h2 className="font-semibold text-gray-700">Gmail</h2>
                    <p className="text-sm text-gray-500">Drop me an email anytime.</p>
                </a>

            </div>
        </section>
    );
};

export default Contact;

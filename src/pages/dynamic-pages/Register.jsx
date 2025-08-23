import axios from "axios";
import { useState } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "user",
        gender: "male",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(""); // success or error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post(
                "http://localhost:7000/api/user/register",
                formData
            );

            if (response.status === 201) {
                setMessage("Registration successful! You can now login.");
                setFormData({
                    name: "",
                    email: "",
                    password: "",
                    role: "user",
                    gender: "male",
                });
            }
        } catch (error) {
            console.error("Registration error:", error.response?.data || error.message);
            setMessage(error.response?.data?.msg || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-white p-6">
            <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-2">

                    {/* left side */}
                    <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#fe6f48] to-[#f6d365] text-white p-6">
                        <div className="flex flex-col justify-end items-center text-center">
                            <h2 className="text-4xl font-bold text-white drop-shadow-lg mt-15 py-3">
                                Create <span className="text-black">Account</span>
                            </h2>
                            <p className="text-lg text-white/90 max-w-xs">
                                Join our professional community & connect with opportunities 🚀
                            </p>
                            <img
                                src="https://res.cloudinary.com/swapcloud/image/upload/v1755942152/register-image_dg4oll.png"
                                alt="Register Banner"
                                className="w-80 h-auto absolute object-contain drop-shadow-xl"
                            />
                        </div>
                    </div>

                    {/* right side form */}
                    <div className="p-6 md:px-13 md:pt-8">
                        <h3 className="sm:hidden text-3xl font-bold mb-6 tracking-wide text-center">
                            <span className="text-black">Sign</span>{" "}
                            <span className="text-orange-500">Up</span>
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* name */}
                            <div className="relative sm:text-sm md:text-md">
                                <FaUser className="absolute left-3 top-3 text-black" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-2 border rounded-lg text-black"
                                    required
                                />
                            </div>

                            {/* email */}
                            <div className="relative sm:text-sm md:text-md">
                                <FaEnvelope className="absolute left-3 top-3 text-black" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-2 border rounded-lg text-black"
                                    required
                                />
                            </div>

                            {/* password */}
                            <div className="relative sm:text-sm md:text-md">
                                <FaLock className="absolute left-3 top-3 text-black" />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-3 py-2 border rounded-lg text-black"
                                    required
                                />
                            </div>

                            {/* role */}
                            <div className="sm:text-xs">
                                <label className="block text-black mb-2 sm:text-lg font-bold">Signup As</label>
                                <div className="flex gap-4 text-xs">
                                    {[
                                        { value: "user", label: "User 👤" },
                                        { value: "recruiter", label: "Recruiter 💼" },
                                    ].map((role) => (
                                        <label
                                            key={role.value}
                                            className={`cursor-pointer flex items-center justify-center px-6 py-3 rounded-xl shadow-md transition-all duration-300
                                                 backdrop-blur-lg border
                                             ${formData.role === role.value
                                                    ? "bg-gradient-to-r from-[#fe6f48] to-[#f6d365] text-white scale-105"
                                                    : "bg-white/60 text-black hover:scale-105 hover:shadow-lg"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="role"
                                                value={role.value}
                                                checked={formData.role === role.value}
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            {role.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* gender */}
                            <div>
                                <label className="block mb-2 text-black sm:text-lg  font-bold">Gender</label>
                                <div className="grid grid-cols-3 gap-4 text-xs">
                                    {[
                                        { value: "male", label: "Male ♂️" },
                                        { value: "female", label: "Female ♀️" },
                                        { value: "other", label: "Other 🌈" },
                                    ].map((g) => (
                                        <label
                                            key={g.value}
                                            className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl shadow-md transition-all duration-300 backdrop-blur-lg border text-center          ${formData.gender === g.value
                                                ? "bg-gradient-to-r from-[#fe6f48] to-[#f6d365] text-white scale-105"
                                                : "bg-white/60 text-black hover:scale-105 hover:shadow-lg"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={g.value}
                                                checked={formData.gender === g.value}
                                                onChange={handleChange}
                                                className="hidden"
                                            />
                                            <span className="font-semibold">{g.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>


                            {/* submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-[#fe6f48] to-[#f6d365] text-white py-3 rounded-lg font-bold shadow-lg hover:opacity-90 transition sm:text-sm"
                            >
                                {loading ? "Registering..." : "Register"}
                            </button>
                        </form>

                        {/* already account */}
                        <p className="text-black text-center mt-4 sm:text-sm">
                            Already have an account?{" "}
                            <a href="/login" className="text-orange-500 font-semibold hover:underline">
                                Login
                            </a>
                        </p>

                        {/* success/error message */}
                        {message && (
                            <p
                                className={`mt-3 text-center py-2 rounded text-sm ${message.includes("successful")
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {message}
                            </p>
                        )}

                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;

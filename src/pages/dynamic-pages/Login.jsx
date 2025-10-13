
import { useContext, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import UserContext from "../../components/Context/UserContext";
import api from "../../api/axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const { login } = useContext(UserContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post(`/user/login`, formData, { withCredentials: true }
      );
      setMessage(res.data.msg);
      login(res.data.user);

      if (res.data.userData.role === "admin") {
        navigate("/admin-dashboard");
      } else if (res.data.userData.role === "recruiter") {
        navigate("/recruiter-dashboard");
      }
      else {
        navigate("/");
      }

    } catch {
      setMessage("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-3">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-sm p-6 px-10 my-8">

        <h2 className="text-xl sm:text-2xl font-bold text-center text-black">
          Connect & <span className="text-orange-500">Explore</span>
        </h2>
        <p className="text-center text-gray-600 mt-2 text-sm sm:text-base ">
          Access your account by filling the form below
        </p>


        <form onSubmit={handleSubmit} className="mt-4 space-y-3">

          {/* Email */}
          <div>
            <label className="block text-xs sm:text-sm 2xl:text-base font-bold text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-2 border rounded-lg bg-white text-black placeholder-gray-500 focus:ring-2 text-xs sm:text-sm lg:text-base 2xl:text-lg"
              placeholder="Enter your email address"
            />
          </div>

          {/* Password  */}
          <div className="relative">
            <label className="block text-xs sm:text-sm 2xl:text-base font-bold text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-black placeholder-gray-500 focus:ring-2 text-xs sm:text-sm lg:text-base 2xl:text-lg"
              placeholder="Enter your password"
            />
            <div
              className="absolute top-8 sm:top-10 right-4 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-xs sm:text-sm 2xl:text-base font-bold text-gray-700 mb-2">
              Select Role
            </label>
            <div className="flex gap-2 sm:gap-3 ">
              {[
                { value: "user", label: "User" },
                { value: "recruiter", label: "Recruiter" },
                { value: "admin", label: "Admin" },
              ].map((role) => (
                <label
                  key={role.value}
                  className={`cursor-pointer flex items-center justify-center px-3 sm:px-3 py-1 sm:py-2 3xl:py-4 rounded-xl shadow-md transition-all duration-300
          border text-xs sm:text-sm font-bold  
          ${formData.role === role.value
                      ? "bg-gradient-to-r from-orange-500 to-yellow-400 text-white scale-105"
                      : "bg-gray-100 text-gray-700 hover:scale-105 hover:shadow-lg"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-400 text-white py-2 rounded-lg font-bold shadow-lg hover:opacity-90 transition mt-1 text-xs sm:text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                Logging in
                <span className="loading loading-spinner-sm text-white"></span>
              </>
            ) : (
              "Login"
            )}
          </button>

        </form>

        {message && (
          <p
            className={`mt-3 text-center py-2 rounded text-sm ${message.toLowerCase().includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
              }`}
          >
            {message}
          </p>
        )}

        <p className="text-gray-700 text-center mt-4 text-sm sm:text-base">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-orange-500 font-semibold hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

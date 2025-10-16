import { useNavigate } from "react-router-dom";

function NotFound() {
    const navigate = useNavigate();

    const user = { role: "recruiter" };

    const handleGoHome = () => {
        if (user?.role === "admin") {
            navigate("/admin-dashboard");
        } else if (user?.role === "recruiter") {
            navigate("/recruiter-dashboard");
        } else {
            navigate("/");
        }
    };

    const handleContactSupport = () => {
        navigate("/contact");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-400 via-orange-500 to-orange-700 text-white px-6">
            <h1 className="text-9xl font-extrabold tracking-widest drop-shadow-lg animate-bounce">
                404
            </h1>
            <p className="text-2xl md:text-3xl font-semibold mt-4">
                Oops! Page not found
            </p>
            <p className="mt-2 text-lg text-gray-100 text-center max-w-md">
                The page you’re looking for doesn’t exist or has been moved.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleGoHome}
                    className="px-4 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition-all duration-200 font-medium text-xs md:text-sm"
                >
                    Go Home
                </button>

                <button
                    onClick={handleContactSupport}
                    className="px-3 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 transition-all duration-200 font-medium text-xs md:text-sm"
                >
                    Contact Support
                </button>
            </div>
        </div>
    );
}

export default NotFound;

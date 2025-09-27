import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-black text-white px-6">
       
            <h1 className="text-9xl font-extrabold tracking-widest">404</h1>
            <p className="text-2xl md:text-3xl font-semibold mt-4">
                Oops! Page not found
            </p>
            <p className="mt-2 text-lg text-gray-300 text-center max-w-md">
                The page you’re looking for doesn’t exist or has been moved.
            </p>


            <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                    to="/"
                    className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all duration-200 font-medium"
                >
                    Go Home
                </Link>
                <Link
                    to="/contact"
                    className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-900 transition-all duration-200 font-medium"
                >
                    Contact Support
                </Link>
            </div>

            <div className="mt-10 w-40 h-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 rounded-full"></div>
        </div>
    );
}

export default NotFound;
